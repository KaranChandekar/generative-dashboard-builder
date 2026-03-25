import { z } from "zod";

const GridPositionSchema = z.object({
  x: z.number().min(0).max(11),
  y: z.number().min(0),
  w: z.number().min(1).max(12),
  h: z.number().min(1).max(4),
});

const ChartConfigSchema = z.object({
  xAxis: z.string().optional(),
  yAxis: z.string().optional(),
  colorScheme: z.array(z.string()).optional(),
  showLegend: z.boolean().default(true),
  showGrid: z.boolean().default(true),
  dataKey: z.string().optional(),
  nameKey: z.string().optional(),
  valueKey: z.string().optional(),
  secondaryYAxis: z.string().optional(),
});

const KpiConfigSchema = z.object({
  value: z.string(),
  previousValue: z.string().optional(),
  changePercent: z.number().optional(),
  changeDirection: z.enum(["up", "down", "neutral"]).optional(),
  prefix: z.string().optional(),
  suffix: z.string().optional(),
  icon: z.string().optional(),
});

// Explicit data row schema - each row has a label and up to 4 numeric values
const DataRowSchema = z.object({
  label: z.string(),
  value: z.number().optional(),
  value2: z.number().optional(),
  value3: z.number().optional(),
  value4: z.number().optional(),
});

const ChartComponentSchema = z.object({
  id: z.string(),
  type: z.enum(["bar", "line", "pie", "area", "scatter", "kpi"]),
  title: z.string(),
  description: z.string().optional(),
  gridPosition: GridPositionSchema,
  config: ChartConfigSchema.optional(),
  kpiConfig: KpiConfigSchema.optional(),
  data: z.array(DataRowSchema),
});

const FilterSchema = z.object({
  id: z.string(),
  type: z.enum(["date-range", "category", "search"]),
  label: z.string(),
  options: z.array(z.string()).optional(),
  targetComponents: z.array(z.string()),
});

export const DashboardSchema = z.object({
  title: z.string(),
  description: z.string(),
  components: z.array(ChartComponentSchema),
  filters: z.array(FilterSchema).optional(),
});

export type DashboardConfig = z.infer<typeof DashboardSchema>;
export type ChartComponent = z.infer<typeof ChartComponentSchema>;
export type FilterConfig = z.infer<typeof FilterSchema>;
export type KpiConfig = z.infer<typeof KpiConfigSchema>;
export type DataRow = z.infer<typeof DataRowSchema>;
