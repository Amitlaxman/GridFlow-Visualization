
"use client";

import type { Bus } from "@/lib/grid-data";
import { Zap, Factory, Cog } from "lucide-react";

type BusNodeProps = {
  bus: Bus;
  voltage: number;
};

const iconMap = {
  generator: Zap,
  load: Factory,
  bus: Cog,
};

export function BusNode({ bus, voltage }: BusNodeProps) {
  const Icon = iconMap[bus.type];
  const animationDuration = 2 / Math.max(0.1, voltage); // Faster pulse for higher voltage

  const renderBusInfo = () => {
    switch (bus.type) {
      case "generator":
        return (
          <>
            <text x={0} y={62} textAnchor="middle" fill="hsl(var(--accent-foreground))" className="text-xs font-semibold">
              Supply
            </text>
            <text x={0} y={76} textAnchor="middle" fill="hsl(var(--muted-foreground))" className="text-xs font-mono">
              {bus.power?.toFixed(1)} MW
            </text>
          </>
        );
      case "load":
        return (
          <>
            <text x={0} y={62} textAnchor="middle" fill="hsl(var(--destructive))" className="text-xs font-semibold">
              Demand
            </text>
            <text x={0} y={76} textAnchor="middle" fill="hsl(var(--muted-foreground))" className="text-xs font-mono">
              {Math.abs(bus.power ?? 0).toFixed(1)} MW
            </text>
          </>
        );
      case "bus":
      default:
        return (
          <text x={0} y={62} textAnchor="middle" fill="hsl(var(--muted-foreground))" className="text-xs font-mono">
            {voltage.toFixed(3)} p.u.
          </text>
        );
    }
  };

  return (
    <g
      transform={`translate(${bus.x}, ${bus.y})`}
    >
      <style>
          {`
            @keyframes pulse {
              0%, 100% {
                transform: scale(1);
                opacity: 0.7;
              }
              50% {
                transform: scale(1.05);
                opacity: 1;
              }
            }
          `}
        </style>
      <g className="bus-group">
        <circle
            className="bus-circle"
            r={30}
            fill="hsl(var(--card))"
            stroke="hsl(var(--primary))"
            strokeWidth={2}
            style={{
                animation: `pulse ${animationDuration.toFixed(2)}s ease-in-out infinite`,
                transformOrigin: 'center',
                transformBox: 'fill-box',
                transition: 'transform 0.2s ease-in-out'
            }}
        />
        <Icon
            className="text-foreground"
            x={-12}
            y={-12}
            size={24}
            strokeWidth={1.5}
            style={{ pointerEvents: 'none' }}
        />
        <text
            x={0}
            y={45}
            textAnchor="middle"
            fill="hsl(var(--foreground))"
            className="text-sm font-bold"
            style={{ pointerEvents: 'none' }}
        >
            {bus.id}
        </text>
        {renderBusInfo()}
      </g>
    </g>
  );
}
