"use client";

import { useSearchParams, useRouter } from "next/navigation";
import { Suspense, useState } from "react";
import { DashboardCanvas } from "@/components/dashboard-canvas";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { ArrowLeft, RefreshCw, Sparkles, ArrowRight } from "lucide-react";

function DashboardContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const prompt = searchParams.get("prompt") ?? "";
  const [newPrompt, setNewPrompt] = useState("");
  const [currentPrompt, setCurrentPrompt] = useState(prompt);
  const [generationKey, setGenerationKey] = useState(0);

  function handleRegenerate() {
    setGenerationKey((k) => k + 1);
  }

  function handleNewPrompt() {
    if (!newPrompt.trim()) return;
    setCurrentPrompt(newPrompt.trim());
    setNewPrompt("");
    setGenerationKey((k) => k + 1);
  }

  if (!currentPrompt) {
    router.push("/");
    return null;
  }

  return (
    <div className="mx-auto max-w-7xl space-y-4 px-4 py-4 sm:px-6 sm:py-6">
      {/* Toolbar */}
      <div className="flex items-center gap-2 sm:gap-3">
        <Button variant="ghost" size="sm" className="gap-1.5 shrink-0" onClick={() => router.push("/")}>
          <ArrowLeft className="h-4 w-4" />
          <span className="hidden sm:inline">New</span>
        </Button>

        <div className="flex-1 min-w-0 rounded-lg bg-muted/50 px-3 py-1.5">
          <p className="truncate text-xs sm:text-sm text-muted-foreground">
            <Sparkles className="mr-1.5 inline h-3 w-3 text-primary" />
            {currentPrompt}
          </p>
        </div>

        <Button variant="outline" size="sm" className="gap-1.5 shrink-0" onClick={handleRegenerate}>
          <RefreshCw className="h-3.5 w-3.5" />
          <span className="hidden sm:inline">Regenerate</span>
        </Button>
      </div>

      {/* Refine prompt */}
      <div className="flex gap-2">
        <div className="relative flex-1 rounded-xl border border-border/60 bg-card shadow-sm transition-shadow focus-within:shadow-md focus-within:border-primary/30">
          <Textarea
            placeholder="Refine your dashboard..."
            value={newPrompt}
            onChange={(e) => setNewPrompt(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter" && !e.shiftKey) {
                e.preventDefault();
                handleNewPrompt();
              }
            }}
            className="min-h-[44px] max-h-[88px] resize-none border-0 bg-transparent text-sm shadow-none focus-visible:ring-0"
            rows={1}
          />
        </div>
        <Button
          size="icon"
          onClick={handleNewPrompt}
          disabled={!newPrompt.trim()}
          className="shrink-0 rounded-xl"
        >
          <ArrowRight className="h-4 w-4" />
        </Button>
      </div>

      {/* Dashboard */}
      <DashboardCanvas key={`${currentPrompt}-${generationKey}`} prompt={currentPrompt} />
    </div>
  );
}

export default function DashboardPage() {
  return (
    <Suspense
      fallback={
        <div className="flex items-center justify-center p-12">
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary text-primary-foreground animate-pulse">
            <Sparkles className="h-5 w-5" />
          </div>
        </div>
      }
    >
      <DashboardContent />
    </Suspense>
  );
}
