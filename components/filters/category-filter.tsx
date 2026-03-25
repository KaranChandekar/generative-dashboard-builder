"use client";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import type { FilterConfig } from "@/types/dashboard";

export function CategoryFilter({ filter }: { filter: FilterConfig }) {
  const options = filter.options ?? ["All"];

  return (
    <div className="flex items-center gap-3">
      <Badge variant="outline" className="whitespace-nowrap">
        {filter.label}
      </Badge>
      <Select defaultValue="all">
        <SelectTrigger className="h-8 w-44 text-xs">
          <SelectValue placeholder={`Select ${filter.label}`} />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">All</SelectItem>
          {options.map((opt) => (
            <SelectItem key={opt} value={opt.toLowerCase().replace(/\s+/g, "-")}>
              {opt}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
}
