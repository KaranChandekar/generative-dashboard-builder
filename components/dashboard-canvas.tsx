"use client";

import { useStreamedObject } from "@/lib/use-streamed-object";
import type { DashboardConfig } from "@/lib/schema";
import { motion, AnimatePresence } from "framer-motion";
import { ChartRenderer } from "@/components/charts/chart-renderer";
import { StreamingIndicator } from "@/components/streaming-indicator";
import { DateRangeFilter } from "@/components/filters/date-range";
import { CategoryFilter } from "@/components/filters/category-filter";
import { Skeleton } from "@/components/ui/skeleton";

const GRID_HEIGHT_MAP: Record<number, string> = {
  1: "h-[140px]",
  2: "h-[300px]",
  3: "h-[440px]",
  4: "h-[560px]",
};

// On mobile, all components go full width. On md+, use the 12-col grid.
function getColClass(w: number): string {
  const mdMap: Record<number, string> = {
    1: "md:col-span-1",
    2: "md:col-span-2",
    3: "md:col-span-3",
    4: "md:col-span-4",
    5: "md:col-span-5",
    6: "md:col-span-6",
    7: "md:col-span-7",
    8: "md:col-span-8",
    9: "md:col-span-9",
    10: "md:col-span-10",
    11: "md:col-span-11",
    12: "md:col-span-12",
  };
  // KPI-width (3-4) → half on sm, proper width on md+
  if (w <= 4) return `col-span-6 ${mdMap[w] ?? "md:col-span-3"}`;
  // Half-width (5-6) → full on sm, half on md+
  if (w <= 6) return `col-span-12 ${mdMap[w] ?? "md:col-span-6"}`;
  // Full-width
  return `col-span-12 ${mdMap[w] ?? "md:col-span-12"}`;
}

export function DashboardCanvas({ prompt }: { prompt: string }) {
  const { object, isLoading, error } = useStreamedObject<DashboardConfig>({
    api: "/api/generate",
    body: { prompt },
  });

  if (error) {
    return (
      <div className="flex items-center justify-center rounded-2xl border border-dashed border-destructive/30 bg-destructive/5 p-8 sm:p-12">
        <div className="text-center space-y-2">
          <p className="text-destructive font-medium">Failed to generate dashboard</p>
          <p className="text-sm text-muted-foreground max-w-md">{error.message}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-5">
      {/* Dashboard Header */}
      {object?.title && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-1"
        >
          <h1 className="text-xl sm:text-2xl font-bold tracking-tight">{object.title}</h1>
          {object.description && (
            <p className="text-xs sm:text-sm text-muted-foreground">{object.description}</p>
          )}
        </motion.div>
      )}

      {/* Filters */}
      {object?.filters && object.filters.length > 0 && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="flex flex-wrap items-center gap-3 rounded-xl bg-muted/40 px-3 py-2.5 sm:px-4 sm:py-3"
        >
          {object.filters.map((filter, i) => {
            if (!filter?.type) return null;
            if (filter.type === "date-range") {
              return <DateRangeFilter key={filter.id ?? i} filter={filter} />;
            }
            return <CategoryFilter key={filter.id ?? i} filter={filter} />;
          })}
        </motion.div>
      )}

      {/* Dashboard Grid */}
      <div className="grid grid-cols-12 gap-3 sm:gap-4">
        <AnimatePresence mode="popLayout">
          {object?.components?.map((component, i) => {
            if (!component?.type) return null;
            if (component.type !== "kpi" && (!component?.data || component.data.length === 0)) return null;
            const w = component.gridPosition?.w ?? 6;
            const h = component.gridPosition?.h ?? 2;

            return (
              <motion.div
                key={component.id ?? `comp-${i}`}
                initial={{ opacity: 0, y: 20, scale: 0.97 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                transition={{
                  duration: 0.5,
                  delay: i * 0.1,
                  ease: [0.25, 0.46, 0.45, 0.94],
                }}
                className={`${getColClass(w)} ${GRID_HEIGHT_MAP[h] ?? "h-[300px]"}`}
              >
                <ChartRenderer component={component} />
              </motion.div>
            );
          })}
        </AnimatePresence>

        {/* Loading skeletons */}
        {isLoading && (!object?.components || object.components.length === 0) && (
          <>
            {[0, 1, 2, 3].map((i) => (
              <div key={`sk-kpi-${i}`} className="col-span-6 md:col-span-3 h-[140px]">
                <Skeleton className="h-full w-full rounded-xl" />
              </div>
            ))}
            {[0, 1].map((i) => (
              <div key={`sk-chart-${i}`} className="col-span-12 md:col-span-6 h-[300px]">
                <Skeleton className="h-full w-full rounded-xl" />
              </div>
            ))}
          </>
        )}

        {isLoading && <StreamingIndicator />}
      </div>
    </div>
  );
}
