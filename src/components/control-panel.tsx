"use client";

import type { AlgorithmData } from "@/lib/grid-data";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";

import { MetricsDisplay } from "./metrics-display";
import { ComparisonChart } from "./comparison-chart";
import { Recommender } from "./recommender";
import { ExplanationGuide } from "./explanation-guide";

type ControlPanelProps = {
  algorithms: { [key: string]: AlgorithmData };
  selectedAlgorithm: string;
  onAlgorithmChange: (key: string) => void;
  onIterate: () => void;
  iteration: number;
  maxIterations: number;
};

export function ControlPanel({
  algorithms,
  selectedAlgorithm,
  onAlgorithmChange,
  onIterate,
  iteration,
  maxIterations,
}: ControlPanelProps) {
  const currentAlgorithm = algorithms[selectedAlgorithm];

  return (
    <Card className="w-full lg:w-[450px] lg:max-w-[450px] flex flex-col shadow-2xl lg:h-[calc(100vh-2rem)] m-0 lg:m-4 border-l">
      <CardHeader className="flex-shrink-0">
        <CardTitle className="text-2xl font-headline">Grid Controls</CardTitle>
        <CardDescription>Select an algorithm to visualize its behavior.</CardDescription>
      </CardHeader>

      <ScrollArea className="flex-grow">
        <CardContent className="h-full">
          <Tabs value={selectedAlgorithm} onValueChange={onAlgorithmChange}>
            <TabsList className="grid w-full grid-cols-2 h-auto">
              {Object.entries(algorithms).map(([key, { name }]) => (
                <TabsTrigger key={key} value={key} className="text-xs sm:text-sm">{name}</TabsTrigger>
              ))}
            </TabsList>
            
            <div className="mt-4 p-4 rounded-lg bg-card-foreground/5">
                <div className="flex justify-between items-center mb-4">
                    <div>
                        <h3 className="text-xl font-semibold text-primary">{currentAlgorithm.name}</h3>
                        <p className="text-sm text-muted-foreground">Iteration: {iteration} / {maxIterations}</p>
                    </div>
                    <Button onClick={onIterate} disabled={iteration >= maxIterations}>
                        Iterate
                    </Button>
                </div>

                <p className="text-sm mb-2">{currentAlgorithm.description}</p>
                <p className="text-xs italic text-muted-foreground p-2 bg-background/30 rounded-md">
                    <strong>Trade-offs:</strong> {currentAlgorithm.tradeoffs}
                </p>
            </div>
            
            <div className="mt-4 space-y-4">
                <MetricsDisplay metrics={currentAlgorithm.metrics} />
                <Separator />
                <ComparisonChart />
                <Separator />
                <ExplanationGuide selectedAlgorithm={currentAlgorithm} />
            </div>

          </Tabs>
        </CardContent>
      </ScrollArea>

      <div className="flex-shrink-0">
        <Recommender />
      </div>
    </Card>
  );
}
