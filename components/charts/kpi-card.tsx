"use client";

import { TrendingUp, TrendingDown, Minus } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import type { ChartComponent } from "@/types/dashboard";

export function KPICard({ component }: { component: ChartComponent }) {
  const { title, description, kpiConfig } = component;
  const value = kpiConfig?.value ?? "—";
  const changePercent = kpiConfig?.changePercent;
  const direction = kpiConfig?.changeDirection ?? "neutral";
  const prefix = kpiConfig?.prefix ?? "";
  const suffix = kpiConfig?.suffix ?? "";

  const DirectionIcon =
    direction === "up" ? TrendingUp : direction === "down" ? TrendingDown : Minus;

  return (
    <Card className="h-full border-border/60 shadow-sm hover:shadow-md transition-shadow">
      <CardContent className="flex h-full flex-col justify-center gap-1 p-5">
        <span className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
          {title}
        </span>
        <div className="text-2xl font-bold tracking-tight">
          {prefix}{value}{suffix}
        </div>
        {(changePercent !== undefined || description) && (
          <div className="flex items-center gap-2 text-xs">
            {changePercent !== undefined && (
              <span
                className={cn(
                  "inline-flex items-center gap-1 rounded-full px-2 py-0.5 font-medium",
                  direction === "up" && "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400",
                  direction === "down" && "bg-red-500/10 text-red-600 dark:text-red-400",
                  direction === "neutral" && "bg-muted text-muted-foreground"
                )}
              >
                <DirectionIcon className="h-3 w-3" />
                {changePercent > 0 ? "+" : ""}
                {changePercent.toFixed(1)}%
              </span>
            )}
            {description && (
              <span className="text-muted-foreground">{description}</span>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
