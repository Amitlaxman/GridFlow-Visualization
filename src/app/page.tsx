"use client";
import { useGridSimulation } from "@/hooks/use-grid-simulation";
import { algorithms, grid } from "@/lib/grid-data";
import { GridDisplay } from "@/components/grid-display";
import { ControlPanel } from "@/components/control-panel";
import { Github } from "lucide-react";

export default function Home() {
  const {
    currentSimState,
    selectedAlgorithm,
    iteration,
    maxIterations,
    handleAlgorithmChange,
    handleIterate,
    isRunning,
  } = useGridSimulation();

  return (
    <div className="flex flex-col lg:flex-row min-h-screen bg-background text-foreground">
      <header className="absolute top-4 left-4 z-10">
        <h1 className="text-2xl font-bold font-headline text-white bg-black/30 p-2 rounded-lg backdrop-blur-sm">
          Interactive Grid Visualizer
        </h1>
      </header>
      <a
        href="https://github.com/firebase/studio-extra-sauce/tree/main/apps/grid-visualizer"
        target="_blank"
        rel="noopener noreferrer"
        className="absolute top-4 right-4 z-10 p-2 rounded-full bg-black/30 text-primary-foreground hover:bg-primary hover:text-primary-foreground transition-colors"
      >
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
          isRunning={isRunning}
          isConverged={currentSimState.isConverged}
        />
      </aside>
    </div>
  );
}
