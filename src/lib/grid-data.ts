
export type Bus = {
  id: string;
  x: number;
  y: number;
  type: "generator" | "load" | "bus";
};

export type Line = {
  id: string;
  from: string;
  to: string;
};

export type GridData = {
  buses: Bus[];
  lines: Line[];
};

export type AlgorithmState = {
  busVoltages: { [busId: string]: number };
  lineFlows: { [lineId: string]: { flow: number; direction: "from-to" | "to-from" } };
};

export type AlgorithmData = {
  name: string;
  description: string;
  tradeoffs: string;
  visualizationBehavior: string;
  metrics: {
    convergenceTime: string;
    iterations: number;
    totalPowerLoss: string;
    voltageDeviation: string;
  };
  comparison: {
    speed: number;
    accuracy: number;
    convergence: number;
    powerLoss: number;
  };
  simulationSteps: AlgorithmState[];
};

export const grid: GridData = {
  buses: [
    { id: "B1", x: 100, y: 200, type: "generator" },
    { id: "B2", x: 250, y: 100, type: "bus" },
    { id: "B3", x: 400, y: 200, type: "load" },
    { id: "B4", x: 550, y: 100, type: "generator" },
    { id: "B5", x: 400, y: 400, type: "load" },
    { id: "B6", x: 250, y: 500, type: "bus" },
  ],
  lines: [
    { id: "L1", from: "B1", to: "B2" },
    { id: "L2", from: "B2", to: "B3" },
    { id: "L3", from: "B2", to: "B4" },
    { id: "L4", from: "B4", to: "B5" },
    { id: "L5", from: "B5", to: "B6" },
    { id: "L6", from: "B1", to: "B6" },
    { id: "L7", from: "B2", to: "B6" },
    { id: "L8", from: "B2", to: "B5" },
  ],
};

const generateFlows = (multiplier: number) => ({
  L1: { flow: 5 * multiplier, direction: "from-to" }, // Gen B1 -> Bus B2
  L2: { flow: 3 * multiplier, direction: "from-to" }, // Bus B2 -> Load B3
  L3: { flow: 2 * multiplier, direction: "to-from" }, // Gen B4 -> Bus B2
  L4: { flow: 6 * multiplier, direction: "from-to" }, // Gen B4 -> Load B5
  L5: { flow: 4 * multiplier, direction: "to-from" }, // Bus B6 -> Load B5
  L6: { flow: 3 * multiplier, direction: "from-to" }, // Gen B1 -> Bus B6
  L7: { flow: 2 * multiplier, direction: "from-to" }, // Bus B2 -> Bus B6
  L8: { flow: 1 * multiplier, direction: "from-to" }, // Bus B2 -> Load B5
});


const generateVoltages = (base: number, variance: number) => ({
  B1: base + variance,
  B2: base - variance,
  B3: base,
  B4: base + variance * 2,
  B5: base - variance,
  B6: base,
});

export const algorithms: { [key: string]: AlgorithmData } = {
  "newton-raphson": {
    name: "Newton-Raphson",
    description: "A powerful and fast-converging iterative method for solving non-linear power flow equations.",
    tradeoffs: "Excellent accuracy and convergence speed for well-behaved systems, but can be computationally intensive and may struggle with poor initial guesses.",
    visualizationBehavior: "Notice the smooth and rapid stabilization of voltages and flows. The few iterations reflect its efficiency. The particle speed is high, and line widths change decisively as it quickly finds the solution.",
    metrics: { convergenceTime: "0.15s", iterations: 3, totalPowerLoss: "1.8%", voltageDeviation: "±1.5%" },
    comparison: { speed: 8, accuracy: 9, convergence: 7, powerLoss: 7 },
    simulationSteps: [
      { busVoltages: generateVoltages(1.0, 0.05), lineFlows: generateFlows(1) },
      { busVoltages: generateVoltages(1.02, 0.02), lineFlows: generateFlows(1.2) },
      { busVoltages: generateVoltages(1.01, 0.01), lineFlows: generateFlows(1.1) },
    ],
  },
  "gauss-seidel": {
    name: "Gauss-Seidel",
    description: "A simpler iterative method that is less memory-intensive than Newton-Raphson.",
    tradeoffs: "Simpler to implement and requires less memory. However, it has slower convergence, especially in large systems, and can be unstable.",
    visualizationBehavior: "This algorithm takes many more iterations to converge. You'll see the voltages and flows change more gradually with each step. The particles move slower, representing the slower computational process.",
    metrics: { convergenceTime: "0.78s", iterations: 12, totalPowerLoss: "2.1%", voltageDeviation: "±2.5%" },
    comparison: { speed: 4, accuracy: 6, convergence: 5, powerLoss: 5 },
    simulationSteps: Array.from({ length: 12 }, (_, i) => ({
      busVoltages: generateVoltages(1.05 - i * 0.005, 0.08 - i * 0.005),
      lineFlows: generateFlows(0.8 + i * 0.05),
    })),
  },
  "dc-power-flow": {
    name: "DC Power Flow",
    description: "A linearized, non-iterative model that provides a fast approximation of real power flows.",
    tradeoffs: "Extremely fast and always converges. It's ideal for contingency analysis and real-time markets. Ignores reactive power and losses, so it's less accurate.",
    visualizationBehavior: "This is a single-step, non-iterative approximation. The 'Iterate' button does nothing after the first click. It provides an instant but less accurate snapshot of power flows, ignoring voltage stability and losses, which is why the voltage is uniform and the 'p.u.' values are stable.",
    metrics: { convergenceTime: "0.01s", iterations: 1, totalPowerLoss: "N/A", voltageDeviation: "N/A" },
    comparison: { speed: 10, accuracy: 2, convergence: 10, powerLoss: 10 },
    simulationSteps: [
      { busVoltages: generateVoltages(1.0, 0), lineFlows: generateFlows(1.5) },
    ],
  },
  "fast-decoupled": {
    name: "Fast Decoupled",
    description: "A simplified version of Newton-Raphson that decouples real and reactive power calculations.",
    tradeoffs: "Faster per iteration and requires less memory than full Newton-Raphson. Very reliable for typical transmission systems, but less accurate for systems with high R/X ratios.",
    visualizationBehavior: "This is a compromise. It converges faster than Gauss-Seidel but not as quickly as Newton-Raphson. The flow animations are moderately fast, and the system stabilizes in a handful of iterations.",
    metrics: { convergenceTime: "0.25s", iterations: 5, totalPowerLoss: "1.9%", voltageDeviation: "±2.0%" },
    comparison: { speed: 7, accuracy: 7, convergence: 8, powerLoss: 6 },
    simulationSteps: Array.from({ length: 5 }, (_, i) => ({
      busVoltages: generateVoltages(1.03 - i * 0.004, 0.06 - i * 0.01),
      lineFlows: generateFlows(0.9 + i * 0.06),
    })),
  },
};

const metricToKeyMap: { [key: string]: keyof AlgorithmData['comparison'] } = {
  "Speed": "speed",
  "Accuracy": "accuracy",
  "Convergence": "convergence",
  "Power Loss": "powerLoss"
};

export const comparisonData = Object.keys(metricToKeyMap).map(metric => {
  const key = metricToKeyMap[metric];
  const item: { metric: string; [key: string]: string | number } = { metric };
  for (const algoKey in algorithms) {
    const algoName = algoKey.charAt(0).toUpperCase() + algoKey.slice(1).replace(/-/g, "");
    item[algoName] = algorithms[algoKey].comparison[key as keyof AlgorithmData['comparison']];
  }
  return item;
});
