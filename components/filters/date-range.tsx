"use client";

import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import type { FilterConfig } from "@/types/dashboard";

export function DateRangeFilter({ filter }: { filter: FilterConfig }) {
  return (
    <div className="flex flex-wrap items-center gap-2">
      <Badge variant="outline" className="whitespace-nowrap text-xs">
        {filter.label}
      </Badge>
      <div className="flex items-center gap-2">
        <Input type="date" className="h-8 w-32 sm:w-36 text-xs" defaultValue="2024-01-01" />
        <span className="text-xs text-muted-foreground">to</span>
        <Input type="date" className="h-8 w-32 sm:w-36 text-xs" defaultValue="2024-12-31" />
      </div>
    </div>
  );
}
