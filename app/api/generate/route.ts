import { streamObject } from "ai";
import { google } from "@ai-sdk/google";
import { DashboardSchema } from "@/lib/schema";

export const maxDuration = 60;

export async function POST(req: Request) {
  try {
    const { prompt } = await req.json();

    if (!prompt || typeof prompt !== "string") {
      return Response.json({ error: "Missing prompt" }, { status: 400 });
    }

    if (!process.env.GOOGLE_GENERATIVE_AI_API_KEY) {
      return Response.json(
        { error: "GOOGLE_GENERATIVE_AI_API_KEY is not set" },
        { status: 500 }
      );
    }

    const result = streamObject({
      model: google("gemini-2.5-flash"),
      schema: DashboardSchema,
      maxOutputTokens: 8192,
      onError({ error }) {
        // Suppress stream controller errors from client disconnects
        if (
          error instanceof Error &&
          error.message?.includes("Controller is already closed")
        ) {
          return;
        }
        console.error("Stream error:", error);
      },
      prompt: `You are a dashboard generator. Create a dashboard for: "${prompt}"

Each data row has these fields: label (string), value (number), value2 (number, optional), value3 (number, optional), value4 (number, optional).

For chart components (bar, line, area, scatter, pie):
- config.xAxis should always be "label"
- config.yAxis should always be "value"
- If showing multiple series, use value2, value3, value4 as additional yAxis fields
- Generate 10-15 data rows with realistic numbers
- label should be a short category name (e.g. "Jan", "Feb", "Product A", "Region 1")

For KPI components:
- Use kpiConfig with value (display string like "$1.2M"), changePercent (number), changeDirection ("up"/"down"/"neutral")
- Set data to [{"label": "kpi", "value": 0}]

For pie charts:
- config.nameKey = "label", config.valueKey = "value"
- Use 5-7 data rows

Layout: 12-column grid. KPIs: w=3, h=1. Charts: w=6 or w=12, h=2 or h=3.
Generate 5-8 components. Add 1-2 filters. Use colors from: ["#6366f1","#8b5cf6","#ec4899","#f43f5e","#f97316","#eab308","#22c55e","#06b6d4"]
Keep ALL string fields concise (under 30 chars).`,
    });

    return result.toTextStreamResponse();
  } catch (error) {
    console.error("Dashboard generation error:", error);
    return Response.json(
      { error: error instanceof Error ? error.message : "Unknown error" },
      { status: 500 }
    );
  }
}
