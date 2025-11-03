"use client";

import type { AlgorithmData } from "@/lib/grid-data";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Timer, Repeat, AreaChart, GitCommitHorizontal } from "lucide-react";

type MetricsDisplayProps = {
  metrics: AlgorithmData["metrics"];
};

const metricItems = [
    { key: 'convergenceTime', label: 'Convergence Time', icon: Timer },
    { key: 'iterations', label: 'Iterations', icon: Repeat },
    { key: 'totalPowerLoss', label: 'Total Power Loss', icon: AreaChart },
    { key: 'voltageDeviation', label: 'Voltage Deviation', icon: GitCommitHorizontal },
] as const;

export function MetricsDisplay({ metrics }: MetricsDisplayProps) {
  return (
    <Card className="bg-transparent border-none shadow-none">
      <CardHeader className="p-2">
        <CardTitle className="text-lg">Performance Metrics</CardTitle>
      </CardHeader>
      <CardContent className="p-2">
        <div className="grid grid-cols-2 gap-4">
          {metricItems.map(item => {
            const value = metrics[item.key];
            const Icon = item.icon;
            return (
                <div key={item.key} className="flex items-start space-x-3 p-2 rounded-lg bg-background/50">
                    <Icon className="h-5 w-5 text-primary mt-1" />
                    <div className="flex flex-col">
                    <span className="text-sm text-muted-foreground">{item.label}</span>
                    <span className="text-lg font-bold font-mono text-accent-foreground">{value}</span>
                    </div>
                </div>
            )
          })}
        </div>
      </CardContent>
    </Card>
  );
}
