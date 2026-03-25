"use client";

import { DashboardBarChart } from "./bar-chart";
import { DashboardLineChart } from "./line-chart";
import { DashboardPieChart } from "./pie-chart";
import { DashboardAreaChart } from "./area-chart";
import { DashboardScatterChart } from "./scatter-chart";
import { KPICard } from "./kpi-card";
import type { ChartComponent } from "@/types/dashboard";

export function ChartRenderer({ component }: { component: ChartComponent }) {
  if (!component?.type || !component?.data) {
    return null;
  }

  switch (component.type) {
    case "bar":
      return <DashboardBarChart component={component} />;
    case "line":
      return <DashboardLineChart component={component} />;
    case "pie":
      return <DashboardPieChart component={component} />;
    case "area":
      return <DashboardAreaChart component={component} />;
    case "scatter":
      return <DashboardScatterChart component={component} />;
    case "kpi":
      return <KPICard component={component} />;
    default:
      return null;
  }
}
