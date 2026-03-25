# Generative Dashboard Builder

An AI-powered Next.js application where users describe dashboards in natural language and watch as interactive charts, KPIs, and data visualizations stream in real-time.

![Next.js](https://img.shields.io/badge/Next.js-16-black?logo=next.js)
![TypeScript](https://img.shields.io/badge/TypeScript-strict-blue?logo=typescript)
![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-v4-06B6D4?logo=tailwindcss)
![AI SDK](https://img.shields.io/badge/Vercel_AI_SDK-v6-000?logo=vercel)

## How It Works

1. **Describe** — Type a natural language prompt like _"monthly revenue vs expenses with trend lines and top products"_
2. **Stream** — The AI generates a structured dashboard config (Zod-validated) and streams it as partial JSON
3. **Render** — Components appear progressively with animations as the AI builds each chart, KPI card, and filter

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Framework | Next.js 16 (App Router, TypeScript strict) |
| AI | Vercel AI SDK v6 + Google Gemini (gemini-2.5-flash) |
| Schema Validation | Zod v4 (end-to-end type safety from AI output to React) |
| Charts | Recharts 3 (bar, line, pie, area, scatter, KPI cards) |
| UI Components | shadcn/ui + Radix UI primitives |
| Styling | Tailwind CSS v4 with custom indigo theme |
| Animations | Framer Motion (progressive reveal) |
| Icons | Lucide React |

## Features

- **Generative UI** — AI returns structured data that maps directly to React chart components, not plain text
- **Streaming progressive rendering** — Charts appear one by one via `streamObject` + custom partial JSON parser
- **6 chart types** — Bar, line, area, pie, scatter, and KPI cards with trend indicators
- **12-column responsive grid** — Same layout system used by Grafana and Metabase
- **Dark/light theme** — Toggle persisted to localStorage with smooth transitions
- **Interactive filters** — Date range and category filters rendered from AI output
- **Regenerate & refine** — Regenerate the full dashboard or refine with follow-up prompts
- **Fully responsive** — Optimized layouts for mobile, tablet, and desktop

## Getting Started

### Prerequisites

- Node.js 18+
- A Google Gemini API key (free at [aistudio.google.com/apikey](https://aistudio.google.com/apikey))

### Setup

```bash
# Install dependencies
npm install

# Create environment file
cp .env.example .env.local
# Then add your API key to .env.local:
# GOOGLE_GENERATIVE_AI_API_KEY=your_key_here

# Start development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) and describe a dashboard.

## Project Structure

```
app/
  layout.tsx                 — Root layout with theme toggle, Geist font
  page.tsx                   — Landing page with prompt input + suggestion cards
  dashboard/[id]/page.tsx    — Generated dashboard view with regenerate/refine
  api/generate/route.ts      — AI streaming endpoint (Gemini + Zod schema)
components/
  prompt-input.tsx           — Textarea with 6 categorized example suggestions
  dashboard-canvas.tsx       — 12-column responsive grid renderer
  streaming-indicator.tsx    — Animated "AI is building..." indicator
  theme-toggle.tsx           — Dark/light mode toggle
  charts/
    chart-renderer.tsx       — Routes component type → chart component
    bar-chart.tsx            — Recharts BarChart wrapper
    line-chart.tsx           — Recharts LineChart wrapper
    pie-chart.tsx            — Recharts PieChart (donut) wrapper
    area-chart.tsx           — Recharts AreaChart wrapper
    scatter-chart.tsx        — Recharts ScatterChart wrapper
    kpi-card.tsx             — KPI card with trend badge
  filters/
    date-range.tsx           — Date range picker filter
    category-filter.tsx      — Category dropdown filter
lib/
  schema.ts                  — Zod schema for DashboardConfig
  use-streamed-object.ts     — Custom hook: fetch + partial JSON streaming parser
  utils.ts                   — cn() utility
types/
  dashboard.ts               — Re-exported TypeScript interfaces
```

## Architecture

```
User prompt
    │
    ▼
┌─────────────────────────────────┐
│  POST /api/generate             │
│  streamObject() + Zod schema    │
│  → Gemini generates structured  │
│    dashboard JSON               │
└──────────┬──────────────────────┘
           │  text stream (partial JSON)
           ▼
┌─────────────────────────────────┐
│  useStreamedObject() hook       │
│  fetch → ReadableStream reader  │
│  → partial JSON repair/parse    │
│  → setState on each chunk       │
└──────────┬──────────────────────┘
           │  Partial<DashboardConfig>
           ▼
┌─────────────────────────────────┐
│  DashboardCanvas                │
│  → ChartRenderer per component  │
│  → Framer Motion animations     │
│  → 12-col responsive grid       │
└─────────────────────────────────┘
```

## Scripts

```bash
npm run dev       # Start dev server
npm run build     # Production build
npm run start     # Start production server
npm run lint      # Run ESLint
```

## License

MIT
