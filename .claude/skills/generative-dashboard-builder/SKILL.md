---
name: generative-dashboard-builder
description: "Build an AI-powered generative dashboard builder where users describe dashboards in natural language and the AI streams fully interactive charts, KPIs, and layouts in real-time. Use this skill whenever the user wants to work on the dashboard builder project, mentions generative UI, AI-generated dashboards, natural language to dashboard, streaming UI components, or wants to build/extend/debug any part of this application. Also trigger when the user mentions chart generation, KPI cards, dashboard layout, or Recharts/D3 in the context of this project."
---

# Generative Dashboard Builder

## What You're Building

A Next.js application where users type a natural language description like "show me monthly revenue vs expenses with a trend line and top 5 products by sales" and the AI generates a fully interactive dashboard with charts, filters, KPI cards, and data visualizations — streamed progressively as the AI reasons about layout and data.

This is a **Generative UI** project — the AI doesn't just return text, it returns rendered React components.

## Architecture Overview

```
app/
├── layout.tsx                    # Root layout with ThemeProvider
├── page.tsx                      # Landing page with prompt input
├── dashboard/
│   └── [id]/page.tsx            # Generated dashboard view
├── api/
│   └── generate/route.ts        # AI streaming endpoint
├── components/
│   ├── prompt-input.tsx          # Natural language input with suggestions
│   ├── dashboard-canvas.tsx      # Grid layout renderer
│   ├── streaming-indicator.tsx   # Shows AI reasoning in real-time
│   ├── charts/
│   │   ├── bar-chart.tsx
│   │   ├── line-chart.tsx
│   │   ├── pie-chart.tsx
│   │   ├── area-chart.tsx
│   │   ├── scatter-chart.tsx
│   │   └── kpi-card.tsx
│   ├── filters/
│   │   ├── date-range.tsx
│   │   └── category-filter.tsx
│   └── theme-toggle.tsx
├── lib/
│   ├── ai.ts                    # Vercel AI SDK config
│   ├── schema.ts                # Zod schemas for dashboard structure
│   ├── mock-data.ts             # Sample datasets
│   └── utils.ts
└── types/
    └── dashboard.ts             # TypeScript interfaces
```

## Tech Stack & Setup

### Initialize the Project

```bash
npx create-next-app@latest dashboard-builder --typescript --tailwind --eslint --app --src-dir=false
cd dashboard-builder

# Core dependencies
npm install ai @ai-sdk/google zod recharts framer-motion
npm install @radix-ui/react-slot @radix-ui/react-dialog class-variance-authority clsx tailwind-merge lucide-react

# shadcn/ui setup
npx shadcn@latest init
npx shadcn@latest add button card input dialog tabs select badge separator skeleton
```

### Environment Variables

```env
# .env.local
GOOGLE_GENERATIVE_AI_API_KEY=your_gemini_key   # Free: ~1M tokens/day at ai.google.dev
```

## Core Implementation Strategy

### 1. Define the Dashboard Schema with Zod

This is the heart of the project. The AI must return structured data that maps directly to React components. Use Vercel AI SDK's `generateObject()` with a Zod schema so the AI output is always valid and type-safe.

```typescript
// lib/schema.ts
import { z } from "zod";

const ChartComponentSchema = z.object({
  id: z.string(),
  type: z.enum(["bar", "line", "pie", "area", "scatter", "kpi"]),
  title: z.string(),
  description: z.string().optional(),
  gridPosition: z.object({
    x: z.number().min(0).max(11),
    y: z.number().min(0),
    w: z.number().min(1).max(12),
    h: z.number().min(1).max(4),
  }),
  config: z.object({
    xAxis: z.string().optional(),
    yAxis: z.string().optional(),
    colorScheme: z.array(z.string()).optional(),
    showLegend: z.boolean().default(true),
    showGrid: z.boolean().default(true),
  }),
  data: z.array(z.record(z.unknown())),
});

export const DashboardSchema = z.object({
  title: z.string(),
  description: z.string(),
  theme: z.enum(["light", "dark"]).default("light"),
  components: z.array(ChartComponentSchema),
  filters: z.array(z.object({
    id: z.string(),
    type: z.enum(["date-range", "category", "search"]),
    label: z.string(),
    targetComponents: z.array(z.string()),
  })).optional(),
});
```

### 2. Streaming AI Generation with Server Actions

Use Vercel AI SDK's `streamObject()` for progressive rendering — components appear one by one as the AI generates them.

```typescript
// app/api/generate/route.ts
import { streamObject } from "ai";
import { google } from "@ai-sdk/google";
import { DashboardSchema } from "@/lib/schema";

export async function POST(req: Request) {
  const { prompt } = await req.json();

  const result = streamObject({
    model: google("gemini-2.5-flash"),
    schema: DashboardSchema,
    prompt: `You are a dashboard designer. Given this request, generate a complete interactive dashboard layout with realistic sample data.

User request: ${prompt}

Guidelines:
- Use a 12-column grid system
- Include 4-8 components depending on complexity
- Generate realistic sample data (20-50 data points per chart)
- Add at least one KPI card showing a key metric
- Choose chart types that best represent the data relationships
- Use complementary color schemes`,
  });

  return result.toTextStreamResponse();
}
```

### 3. Progressive Dashboard Rendering

The dashboard canvas receives partial objects as the AI streams and renders components as they become available.

```typescript
// components/dashboard-canvas.tsx
"use client";
import { useObject } from "ai/react";
import { DashboardSchema } from "@/lib/schema";
import { motion, AnimatePresence } from "framer-motion";
// Import chart components...

export function DashboardCanvas({ prompt }: { prompt: string }) {
  const { object, isLoading } = useObject({
    api: "/api/generate",
    schema: DashboardSchema,
    input: { prompt },
  });

  return (
    <div className="grid grid-cols-12 gap-4 p-6">
      <AnimatePresence>
        {object?.components?.map((component, i) => (
          <motion.div
            key={component.id ?? i}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            className={`col-span-${component.gridPosition?.w ?? 6}`}
            style={{ gridRow: `span ${component.gridPosition?.h ?? 2}` }}
          >
            <ChartRenderer component={component} />
          </motion.div>
        ))}
      </AnimatePresence>
      {isLoading && <StreamingIndicator />}
    </div>
  );
}
```

### 4. Chart Component Renderer

Map the AI's structured output to actual Recharts components.

```typescript
// components/charts/chart-renderer.tsx
import { BarChart, Bar, LineChart, Line, PieChart, Pie, ... } from "recharts";

export function ChartRenderer({ component }) {
  switch (component.type) {
    case "bar": return <DashboardBarChart {...component} />;
    case "line": return <DashboardLineChart {...component} />;
    case "pie": return <DashboardPieChart {...component} />;
    case "kpi": return <KPICard {...component} />;
    // ... etc
  }
}
```

## Key Features to Implement

### Phase 1: Core Generation (Week 1)
- Prompt input with example suggestions
- AI streaming endpoint with Zod schema validation
- Basic chart rendering (bar, line, pie, KPI)
- 12-column responsive grid layout
- Loading skeleton states during generation

### Phase 2: Interactivity (Week 2)
- Date range and category filters that update charts
- Click-to-drill-down on chart elements
- Drag-and-drop to rearrange dashboard layout
- Dark/light theme toggle with smooth transitions
- Chart type switching (change a bar chart to line chart)

### Phase 3: Polish (Week 3)
- Export dashboard as PDF/PNG
- Shareable dashboard links (save to Supabase)
- Prompt history and favorites
- Responsive design for mobile/tablet
- Lighthouse optimization (target 90+ score)

## Free Resources

| Resource | Purpose | Free Tier |
|----------|---------|-----------|
| Google Gemini API | AI generation | ~1M tokens/day |
| Vercel | Hosting | 100GB bandwidth |
| Recharts | Charts | Open source |
| shadcn/ui | UI components | Open source |
| Framer Motion | Animations | Open source |
| Supabase | DB for saved dashboards | 500MB free |

## What Makes This Resume-Worthy

The key talking points for interviews:

- **Generative UI architecture**: You're not just calling an API and showing text. The AI generates structured data that maps to React components. This is the pattern Google, Vercel, and CopilotKit are investing in.
- **Streaming + progressive rendering**: Components appear one by one. Explain how `streamObject()` works with partial Zod validation.
- **Type safety end-to-end**: Zod schema ensures the AI always returns valid dashboard configs. No runtime surprises.
- **12-column grid system**: Same layout system used by professional dashboard tools like Grafana and Metabase.

## Common Pitfalls to Avoid

- Don't hardcode chart data — always generate it dynamically from the AI response
- Don't skip error boundaries — AI can sometimes produce partial/invalid components
- Don't forget loading states — streaming means components arrive at different times
- Always validate AI output against the Zod schema before rendering
- Use `React.Suspense` boundaries around chart components for graceful loading
