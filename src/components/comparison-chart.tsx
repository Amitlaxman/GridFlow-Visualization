"use client";

import { Bar, BarChart, CartesianGrid, XAxis, YAxis, Tooltip, Legend, ResponsiveContainer } from "recharts";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { comparisonData } from "@/lib/grid-data";
import { ChartTooltip, ChartTooltipContent, ChartContainer, ChartLegend, ChartLegendContent } from "@/components/ui/chart";

const chartConfig = {
  "Newton-Raphson": { label: "Newton-Raphson", color: "hsl(210 80% 60%)" },
  "Gauss-Seidel": { label: "Gauss-Seidel", color: "hsl(200 90% 55%)" },
  "DCPowerFlow": { label: "DC Power Flow", color: "hsl(190 100% 75%)" },
  "FastDecoupled": { label: "Fast Decoupled", color: "hsl(180 95% 85%)" },
};

export function ComparisonChart() {
  const adjustedComparisonData = comparisonData.map(d => ({
    ...d,
    "DCPowerFlow": d["DC Power Flow"],
    "FastDecoupled": d["Fast Decoupled"]
  }));

  return (
    <Card className="bg-transparent border-none shadow-none">
      <CardHeader className="p-2">
        <CardTitle className="text-lg">Algorithm Comparison</CardTitle>
      </CardHeader>
      <CardContent className="p-2">
        <ChartContainer config={chartConfig} className="min-h-[200px] w-full">
            <BarChart accessibilityLayer data={adjustedComparisonData} margin={{ top: 20, right: 0, left: -20, bottom: 5 }}>
                <CartesianGrid vertical={false} />
                <XAxis
                    dataKey="metric"
                    tickLine={false}
                    tickMargin={10}
                    axisLine={false}
                    tick={{ fill: "hsl(var(--muted-foreground))", fontSize: 12 }}
                />
                <YAxis
                    tickLine={false}
                    axisLine={false}
                    tick={{ fill: "hsl(var(--muted-foreground))", fontSize: 12 }}
                    domain={[0, 10]}
                 />
                <ChartTooltip
                    cursor={false}
                    content={<ChartTooltipContent indicator="dot" />}
                />
                <ChartLegend content={<ChartLegendContent />} />
                <Bar dataKey="Newton-Raphson" fill="var(--color-Newton-Raphson)" radius={4} />
                <Bar dataKey="Gauss-Seidel" fill="var(--color-Gauss-Seidel)" radius={4} />
                <Bar dataKey="DCPowerFlow" fill="var(--color-DCPowerFlow)" radius={4} />
                <Bar dataKey="FastDecoupled" fill="var(--color-FastDecoupled)" radius={4} />
            </BarChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}
