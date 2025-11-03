"use client";

import type { GridData, AlgorithmState } from "@/lib/grid-data";
import { BusNode } from "./bus-node";
import { TransmissionLine } from "./transmission-line";

type GridDisplayProps = {
  grid: GridData;
  simState: AlgorithmState;
};

export function GridDisplay({ grid, simState }: GridDisplayProps) {
  const busMap = new Map(grid.buses.map((bus) => [bus.id, bus]));

  return (
    <div className="flex-1 w-full h-full min-h-[600px] lg:min-h-0 bg-background rounded-lg shadow-inner-lg p-4">
      <svg viewBox="0 0 650 600" width="100%" height="100%" className="overflow-visible">
        <defs>
          <filter id="glow" x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur stdDeviation="3.5" result="coloredBlur" />
            <feMerge>
              <feMergeNode in="coloredBlur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>
        
        <g>
          {grid.lines.map((line) => {
            const fromBus = busMap.get(line.from);
            const toBus = busMap.get(line.to);
            const lineState = simState.lineFlows[line.id];
            if (!fromBus || !toBus || !lineState) return null;

            return (
              <TransmissionLine
                key={line.id}
                line={line}
                fromBus={fromBus}
                toBus={toBus}
                flow={lineState.flow}
                direction={lineState.direction}
              />
            );
          })}
        </g>
        
        <g style={{ filter: 'url(#glow)' }}>
          {grid.buses.map((bus) => {
            const voltage = simState.busVoltages[bus.id];
            if (voltage === undefined) return null;

            return <BusNode key={bus.id} bus={bus} voltage={voltage} />;
          })}
        </g>
      </svg>
    </div>
  );
}
