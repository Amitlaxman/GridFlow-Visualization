"use client";

import type { Bus } from "@/lib/grid-data";
import { Zap, Factory, Cog } from "lucide-react";
import { cn } from "@/lib/utils";

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

  return (
    <g
      transform={`translate(${bus.x}, ${bus.y})`}
      className="transition-transform duration-500 ease-in-out hover:scale-110"
    >
      <defs>
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
      </defs>
      <circle
        r={30}
        fill="hsl(var(--card))"
        stroke="hsl(var(--primary))"
        strokeWidth={2}
        className="animate-pulse-slow"
        style={{
          animation: `pulse ${animationDuration.toFixed(2)}s ease-in-out infinite`,
          transformOrigin: 'center',
          transformBox: 'fill-box'
        }}
      />
      <Icon
        className="text-foreground transition-colors duration-300"
        x={-12}
        y={-12}
        size={24}
        strokeWidth={1.5}
      />
      <text
        x={0}
        y={45}
        textAnchor="middle"
        fill="hsl(var(--foreground))"
        className="text-sm font-bold"
      >
        {bus.id}
      </text>
      <text
        x={0}
        y={62}
        textAnchor="middle"
        fill="hsl(var(--muted-foreground))"
        className="text-xs font-mono"
      >
        {voltage.toFixed(3)} p.u.
      </text>
    </g>
  );
}
