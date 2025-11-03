"use client";

import type { Bus, Line } from "@/lib/grid-data";

type TransmissionLineProps = {
  line: Line;
  fromBus: Bus;
  toBus: Bus;
  flow: number;
  direction: "from-to" | "to-from";
};

export function TransmissionLine({ line, fromBus, toBus, flow, direction }: TransmissionLineProps) {
  const pathId = `path-${line.id}`;
  const isForward = direction === "from-to";
  const start = isForward ? fromBus : toBus;
  const end = isForward ? toBus : fromBus;

  // Slower duration for higher flow = slower particles
  const animationDuration = 5 / Math.max(0.1, flow);
  const particleCount = Math.min(5, Math.ceil(flow / 2));
  const strokeWidth = 1 + Math.log(1 + flow) * 1.5;

  return (
    <g>
      <path
        id={pathId}
        d={`M${start.x},${start.y} L${end.x},${end.y}`}
        fill="none"
      />
      <path
        d={`M${fromBus.x},${fromBus.y} L${toBus.x},${toBus.y}`}
        stroke="hsl(var(--secondary) / 0.5)"
        strokeWidth={strokeWidth}
        className="transition-all duration-500 ease-in-out"
      />
      {Array.from({ length: particleCount }).map((_, i) => (
        <circle key={i} r="3" fill="hsl(var(--accent))" className="opacity-80">
          <animateMotion
            dur={`${animationDuration.toFixed(2)}s`}
            begin={`${(i * animationDuration) / particleCount}s`}
            repeatCount="indefinite"
          >
            <mpath href={`#${pathId}`} />
          </animateMotion>
        </circle>
      ))}
    </g>
  );
}
