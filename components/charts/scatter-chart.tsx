"use client";

import {
  ScatterChart,
  Scatter,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import type { ChartComponent } from "@/types/dashboard";

export function DashboardScatterChart({ component }: { component: ChartComponent }) {
  const { title, description, data, config } = component;
  const color = config?.colorScheme?.[0] ?? "#6366f1";

  return (
    <Card className="h-full">
      <CardHeader className="pb-2">
        <CardTitle className="text-base">{title}</CardTitle>
        {description && <CardDescription>{description}</CardDescription>}
      </CardHeader>
      <CardContent className="h-[calc(100%-4rem)]">
        <ResponsiveContainer width="100%" height="100%">
          <ScatterChart margin={{ top: 5, right: 20, left: 0, bottom: 5 }}>
            {config?.showGrid !== false && <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />}
            <XAxis
              dataKey="value"
              name="X"
              className="text-xs"
              tick={{ fill: "currentColor", fontSize: 12 }}
            />
            <YAxis
              dataKey="value2"
              name="Y"
              className="text-xs"
              tick={{ fill: "currentColor", fontSize: 12 }}
            />
            <Tooltip
              contentStyle={{
                backgroundColor: "hsl(var(--popover))",
                border: "1px solid hsl(var(--border))",
                borderRadius: "8px",
                fontSize: "12px",
              }}
            />
            <Scatter data={data} fill={color} />
          </ScatterChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}
