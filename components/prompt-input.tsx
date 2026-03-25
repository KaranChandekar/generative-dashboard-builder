"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import {
  Sparkles,
  ArrowRight,
  TrendingUp,
  Users,
  ShoppingCart,
  Kanban,
  BarChart3,
  Cloud,
} from "lucide-react";

const SUGGESTIONS = [
  {
    icon: TrendingUp,
    title: "Revenue Analytics",
    prompt: "Monthly revenue vs expenses with trend lines and top products by sales",
  },
  {
    icon: Users,
    title: "Social Media",
    prompt: "Social media analytics: followers, engagement rate, and post performance over time",
  },
  {
    icon: ShoppingCart,
    title: "E-Commerce",
    prompt: "E-commerce dashboard with conversion funnel, top categories, and customer demographics",
  },
  {
    icon: Kanban,
    title: "Project Management",
    prompt: "Project management: task completion rates, team velocity, and sprint burndown chart",
  },
  {
    icon: BarChart3,
    title: "SaaS Metrics",
    prompt: "SaaS metrics: MRR growth, churn rate, customer lifetime value, and acquisition trends",
  },
  {
    icon: Cloud,
    title: "Weather Data",
    prompt: "Weather data dashboard with temperature trends, precipitation, and wind speed",
  },
];

export function PromptInput() {
  const [prompt, setPrompt] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);
  const router = useRouter();

  function handleSubmit() {
    if (!prompt.trim() || isGenerating) return;
    setIsGenerating(true);
    const encoded = encodeURIComponent(prompt.trim());
    router.push(`/dashboard/new?prompt=${encoded}`);
  }

  function handleSuggestion(suggestion: string) {
    setPrompt(suggestion);
  }

  return (
    <div className="w-full max-w-3xl space-y-8">
      <div className="relative rounded-2xl border border-border/60 bg-card shadow-lg shadow-primary/5 transition-shadow focus-within:shadow-xl focus-within:shadow-primary/10 focus-within:border-primary/30">
        <Textarea
          placeholder="Describe the dashboard you want to create..."
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter" && !e.shiftKey) {
              e.preventDefault();
              handleSubmit();
            }
          }}
          className="min-h-[120px] resize-none border-0 bg-transparent pr-14 text-base shadow-none focus-visible:ring-0"
          disabled={isGenerating}
        />
        <Button
          size="icon"
          className="absolute bottom-3 right-3 rounded-xl"
          onClick={handleSubmit}
          disabled={!prompt.trim() || isGenerating}
        >
          {isGenerating ? (
            <Sparkles className="h-4 w-4 animate-spin" />
          ) : (
            <ArrowRight className="h-4 w-4" />
          )}
        </Button>
      </div>

      <div className="space-y-3">
        <p className="text-sm font-medium text-muted-foreground">Or start with an example</p>
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {SUGGESTIONS.map((suggestion) => (
            <button
              key={suggestion.title}
              onClick={() => handleSuggestion(suggestion.prompt)}
              className="group flex items-start gap-3 rounded-xl border border-border/60 bg-card p-4 text-left transition-all hover:border-primary/30 hover:bg-primary/5 hover:shadow-md"
            >
              <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-muted text-muted-foreground transition-colors group-hover:bg-primary/10 group-hover:text-primary">
                <suggestion.icon className="h-4 w-4" />
              </div>
              <div className="min-w-0 space-y-1">
                <p className="text-sm font-medium leading-tight">{suggestion.title}</p>
                <p className="text-xs leading-snug text-muted-foreground line-clamp-2">
                  {suggestion.prompt}
                </p>
              </div>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
