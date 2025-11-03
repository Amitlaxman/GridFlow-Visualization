"use client";
import { useState } from "react";
import { algorithms, grid, comparisonData } from "@/lib/grid-data";
import { GridDisplay } from "@/components/grid-display";
import { ControlPanel } from "@/components/control-panel";
import { Card, CardContent } from "@/components/ui/card";
import { Github } from "lucide-react";

export default function Home() {
  const [selectedAlgorithm, setSelectedAlgorithm] = useState(Object.keys(algorithms)[0]);
  const [iteration, setIteration] = useState(0);

  const currentAlgorithmData = algorithms[selectedAlgorithm];
  const maxIterations = currentAlgorithmData.simulationSteps.length - 1;

  const handleIterate = () => {
    setIteration((prev) => Math.min(prev + 1, maxIterations));
  };

  const handleAlgorithmChange = (algoKey: string) => {
    setSelectedAlgorithm(algoKey);
    setIteration(0);
  };
  
  const currentSimState = currentAlgorithmData.simulationSteps[Math.min(iteration, maxIterations)];

  return (
    <div className="flex flex-col lg:flex-row min-h-screen bg-background text-foreground">
      <header className="absolute top-4 left-4 z-10">
        <h1 className="text-2xl font-bold font-headline text-primary-foreground bg-black/30 p-2 rounded-lg backdrop-blur-sm">
          Interactive Grid Visualizer
        </h1>
      </header>
       <a href="https://github.com/firebase/studio-extra-sauce/tree/main/apps/grid-visualizer" target="_blank" rel="noopener noreferrer" className="absolute top-4 right-4 z-10 p-2 rounded-full bg-black/30 text-primary-foreground hover:bg-primary hover:text-primary-foreground transition-colors">
        <Github />
      </a>
      <main className="flex-1 flex items-center justify-center p-4">
        <GridDisplay grid={grid} simState={currentSimState} />
      </main>
      <aside className="w-full lg:w-auto">
        <ControlPanel
          algorithms={algorithms}
          selectedAlgorithm={selectedAlgorithm}
          onAlgorithmChange={handleAlgorithmChange}
          onIterate={handleIterate}
          iteration={iteration}
          maxIterations={maxIterations}
        />
      </aside>
    </div>
  );
}
