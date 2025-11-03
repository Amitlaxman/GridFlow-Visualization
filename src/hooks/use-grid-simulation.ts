"use client";

import { useState, useEffect, useCallback } from 'react';
import type { AlgorithmState } from '@/lib/grid-data';
import { algorithms, grid } from '@/lib/grid-data';

function getInitialState(gridData: typeof grid): AlgorithmState {
  const busVoltages: { [busId: string]: number } = {};
  gridData.buses.forEach(bus => {
    busVoltages[bus.id] = bus.type === 'generator' ? bus.voltage ?? 1.0 : 1.0;
  });

  const lineFlows: AlgorithmState['lineFlows'] = {};
  gridData.lines.forEach(line => {
    lineFlows[line.id] = { flow: 0, direction: 'from-to' };
  });

  return {
    busVoltages,
    lineFlows,
    isConverged: false,
    iteration: 0,
  };
}


export function useGridSimulation() {
  const [selectedAlgorithm, setSelectedAlgorithm] = useState(Object.keys(algorithms)[0]);
  const [simulationHistory, setSimulationHistory] = useState<AlgorithmState[]>([getInitialState(grid)]);
  const [iteration, setIteration] = useState(0);
  const [isRunning, setIsRunning] = useState(false);

  const algorithm = algorithms[selectedAlgorithm];
  const maxIterations = algorithm.maxIterations;

  const resetSimulation = useCallback((algoKey: string) => {
    setSelectedAlgorithm(algoKey);
    setSimulationHistory([getInitialState(grid)]);
    setIteration(0);
  }, []);

  const handleAlgorithmChange = useCallback((algoKey: string) => {
    if (algoKey !== selectedAlgorithm) {
      resetSimulation(algoKey);
    }
  }, [selectedAlgorithm, resetSimulation]);
  
  const handleIterate = useCallback(() => {
    if (iteration >= maxIterations || isRunning) return;

    setIsRunning(true);
    // Use a timeout to simulate calculation time and allow UI to update
    setTimeout(() => {
      const currentAlgorithm = algorithms[selectedAlgorithm];
      const currentState = simulationHistory[iteration] || getInitialState(grid);

      const nextState = currentAlgorithm.run(grid, currentState);

      setSimulationHistory(prev => [...prev, nextState]);
      setIteration(prev => prev + 1);
      setIsRunning(false);
    }, 200); // 200ms delay

  }, [iteration, maxIterations, selectedAlgorithm, simulationHistory, isRunning]);

  // Effect to run the first iteration automatically
  useEffect(() => {
    if (iteration === 0) {
      handleIterate();
    }
  }, [iteration, selectedAlgorithm, handleIterate]);
  
  const currentSimState = simulationHistory[iteration] || getInitialIState(grid);

  return {
    selectedAlgorithm,
    currentSimState,
    iteration,
    maxIterations,
    handleAlgorithmChange,
    handleIterate,
    resetSimulation,
    isRunning,
  };
}

// A version of initial state that doesn't cause a circular dependency
// by trying to import grid. It's a bit of a hack.
function getInitialIState(gridData?: any): AlgorithmState {
    const busVoltages: { [busId: string]: number } = {
        "B1": 1.05, "B2": 1.0, "B3": 1.0, "B4": 1.0, "B5": 1.0, "B6": 1.0
    };
    const lineFlows: AlgorithmState['lineFlows'] = {
        "L1": { flow: 0, direction: 'from-to' }, "L2": { flow: 0, direction: 'from-to' },
        "L3": { flow: 0, direction: 'from-to' }, "L4": { flow: 0, direction: 'from-to' },
        "L5": { flow: 0, direction: 'from-to' }, "L6": { flow: 0, direction: 'from-to' },
        "L7": { flow: 0, direction: 'from-to' }, "L8": { flow: 0, direction: 'from-to' },
    };
  
    return {
      busVoltages,
      lineFlows,
      isConverged: false,
      iteration: 0,
    };
}
