"use client";

import { useState, useEffect } from "react";

export function useStreamedObject<T>({
  api,
  body,
}: {
  api: string;
  body: Record<string, unknown>;
}) {
  const [object, setObject] = useState<Partial<T> | undefined>(undefined);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | undefined>(undefined);

  useEffect(() => {
    const controller = new AbortController();

    async function run() {
      setIsLoading(true);
      setError(undefined);
      setObject(undefined);

      try {
        const response = await fetch(api, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(body),
          signal: controller.signal,
        });

        if (!response.ok) {
          const text = await response.text().catch(() => "");
          throw new Error(
            `Request failed (${response.status}): ${text || response.statusText}`
          );
        }

        const reader = response.body?.getReader();
        if (!reader) throw new Error("No response body");

        const decoder = new TextDecoder();
        let buffer = "";

        while (true) {
          const { done, value } = await reader.read();
          if (done) break;

          buffer += decoder.decode(value, { stream: true });

          const parsed = tryParsePartialJson(buffer);
          if (parsed !== undefined) {
            setObject(parsed as Partial<T>);
          }
        }

        // Final parse
        const finalParsed = tryParsePartialJson(buffer);
        if (finalParsed !== undefined) {
          setObject(finalParsed as Partial<T>);
        }
      } catch (err) {
        if ((err as Error).name !== "AbortError") {
          setError(err as Error);
        }
      } finally {
        if (!controller.signal.aborted) {
          setIsLoading(false);
        }
      }
    }

    run();

    return () => {
      controller.abort();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [api, JSON.stringify(body)]);

  return { object, isLoading, error };
}

function tryParsePartialJson(text: string): unknown | undefined {
  const trimmed = text.trim();
  if (!trimmed) return undefined;

  try {
    return JSON.parse(trimmed);
  } catch {
    return repairAndParseJson(trimmed);
  }
}

function repairAndParseJson(text: string): unknown | undefined {
  const stack: string[] = [];
  let inString = false;
  let escaped = false;
  let lastValidEnd = -1;

  for (let i = 0; i < text.length; i++) {
    const char = text[i];

    if (escaped) {
      escaped = false;
      continue;
    }

    if (char === "\\") {
      if (inString) escaped = true;
      continue;
    }

    if (char === '"') {
      inString = !inString;
      continue;
    }

    if (inString) continue;

    if (char === "{") stack.push("}");
    else if (char === "[") stack.push("]");
    else if (char === "}" || char === "]") {
      stack.pop();
      if (stack.length === 0) {
        lastValidEnd = i;
      }
    }
  }

  // Strategy 1: Use last complete top-level structure
  if (lastValidEnd > 0) {
    try {
      return JSON.parse(text.substring(0, lastValidEnd + 1));
    } catch {
      // Fall through
    }
  }

  // Strategy 2: Close open structures
  let attempt = text;

  if (inString) {
    attempt += '"';
  }

  attempt = attempt.replace(/,?\s*"[^"]*":\s*$/, "");
  attempt = attempt.replace(/,\s*$/, "");

  // Re-walk for accurate stack
  const closeStack: string[] = [];
  let inStr2 = false;
  let esc2 = false;

  for (const ch of attempt) {
    if (esc2) { esc2 = false; continue; }
    if (ch === "\\") { if (inStr2) esc2 = true; continue; }
    if (ch === '"') { inStr2 = !inStr2; continue; }
    if (inStr2) continue;
    if (ch === "{") closeStack.push("}");
    else if (ch === "[") closeStack.push("]");
    else if (ch === "}" || ch === "]") closeStack.pop();
  }

  while (closeStack.length > 0) {
    attempt += closeStack.pop();
  }

  try {
    return JSON.parse(attempt);
  } catch {
    return undefined;
  }
}
