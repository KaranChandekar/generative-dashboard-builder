"use client";

import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import type { ChartComponent } from "@/types/dashboard";

const DEFAULT_COLORS = ["#6366f1", "#8b5cf6", "#ec4899", "#f43f5e", "#f97316"];

export function DashboardLineChart({ component }: { component: ChartComponent }) {
  const { title, description, data, config } = component;
  const colors = config?.colorScheme ?? DEFAULT_COLORS;

  const valueKeys = ["value", "value2", "value3", "value4"].filter(
    (k) => data.some((row) => row[k as keyof typeof row] != null)
  );

  return (
    <Card className="h-full">
      <CardHeader className="pb-2">
        <CardTitle className="text-base">{title}</CardTitle>
        {description && <CardDescription>{description}</CardDescription>}
      </CardHeader>
      <CardContent className="h-[calc(100%-4rem)]">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={data} margin={{ top: 5, right: 20, left: 0, bottom: 5 }}>
            {config?.showGrid !== false && <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />}
            <XAxis dataKey="label" className="text-xs" tick={{ fill: "currentColor", fontSize: 12 }} />
            <YAxis className="text-xs" tick={{ fill: "currentColor", fontSize: 12 }} />
            <Tooltip
              contentStyle={{
                backgroundColor: "hsl(var(--popover))",
                border: "1px solid hsl(var(--border))",
                borderRadius: "8px",
                fontSize: "12px",
              }}
            />
            {config?.showLegend !== false && valueKeys.length > 1 && <Legend />}
            {valueKeys.map((key, i) => (
              <Line
                key={key}
                type="monotone"
                dataKey={key}
                stroke={colors[i % colors.length]}
                strokeWidth={2}
                dot={{ r: 3 }}
                activeDot={{ r: 5 }}
              />
            ))}
          </LineChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}
