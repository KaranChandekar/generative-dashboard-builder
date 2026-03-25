import { PromptInput } from "@/components/prompt-input";

export default function Home() {
  return (
    <div className="flex flex-1 flex-col items-center justify-center px-4 py-12 sm:px-6 sm:py-16 lg:py-20">
      <div className="mb-8 space-y-4 text-center sm:mb-12">
        <div className="mx-auto mb-4 inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/5 px-4 py-1.5 text-xs sm:text-sm text-primary">
          <span className="relative flex h-2 w-2">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-primary opacity-75" />
            <span className="relative inline-flex h-2 w-2 rounded-full bg-primary" />
          </span>
          Powered by Gemini AI
        </div>
        <h1 className="text-3xl font-bold tracking-tight sm:text-5xl lg:text-6xl">
          Build dashboards
          <br />
          <span className="bg-gradient-to-r from-primary via-chart-2 to-chart-3 bg-clip-text text-transparent">
            with AI
          </span>
        </h1>
        <p className="mx-auto max-w-md text-sm sm:text-lg text-muted-foreground">
          Describe what you want to see and watch as interactive charts, KPIs,
          and visualizations stream in real-time.
        </p>
      </div>
      <PromptInput />
    </div>
  );
}
