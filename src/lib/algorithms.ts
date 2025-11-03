import type { GridData, AlgorithmState, AlgorithmImplementation } from './grid-data';

const CONVERGENCE_THRESHOLD = 0.0001;

// --- Helper Functions ---
function getInitialState(grid: GridData): AlgorithmState {
  const busVoltages: { [busId: string]: number } = {};
  grid.buses.forEach(bus => {
    // Start with 1.0 p.u. for unknown voltages, but use known generator voltages
    busVoltages[bus.id] = bus.type === 'generator' ? bus.voltage ?? 1.0 : 1.0;
  });

  const lineFlows: AlgorithmState['lineFlows'] = {};
  grid.lines.forEach(line => {
    lineFlows[line.id] = { flow: 0, direction: 'from-to' };
  });

  return {
    busVoltages,
    lineFlows,
    isConverged: false,
    iteration: 0,
  };
}

function calculateLineFlows(grid: GridData, voltages: { [key: string]: number }): AlgorithmState['lineFlows'] {
    const lineFlows: AlgorithmState['lineFlows'] = {};
    grid.lines.forEach(line => {
        const vFrom = voltages[line.from] || 1.0;
        const vTo = voltages[line.to] || 1.0;
        const voltageDiff = vFrom - vTo;
        
        // Simplified flow calculation (Ohm's law)
        const flow = Math.abs(voltageDiff / line.impedance);
        
        lineFlows[line.id] = {
            flow: isNaN(flow) ? 0 : flow,
            direction: voltageDiff > 0 ? 'from-to' : 'to-from',
        };
    });
    return lineFlows;
}

// --- Algorithm Implementations ---

/**
 * A simplified Newton-Raphson implementation.
 * This version uses a pseudo-Jacobian to simulate the fast convergence.
 */
export const runNewtonRaphson: AlgorithmImplementation = (grid, currentState) => {
  const state = currentState ? JSON.parse(JSON.stringify(currentState)) : getInitialState(grid);
  if (state.isConverged) return state;

  const newVoltages = { ...state.busVoltages };
  let maxChange = 0;

  grid.buses.forEach(bus => {
    if (bus.type === 'generator') return; // Skip slack/PV buses

    let powerMismatch = bus.power ?? 0;
    
    // Calculate injected power based on current voltages
    grid.lines.forEach(line => {
        const admittance = 1 / line.impedance;
        if (line.from === bus.id) {
            powerMismatch += (state.busVoltages[bus.id] - state.busVoltages[line.to]) * admittance * state.busVoltages[bus.id];
        }
        if (line.to === bus.id) {
            powerMismatch += (state.busVoltages[bus.id] - state.busVoltages[line.from]) * admittance * state.busVoltages[bus.id];
        }
    });

    // Simplified Jacobian diagonal element (derivative approximation)
    const jacobianDiagonal = 2 * (bus.power ?? 0) / (state.busVoltages[bus.id] || 1.0);
    const voltageChange = -powerMismatch / (jacobianDiagonal || 1.0);

    const newVoltage = state.busVoltages[bus.id] + voltageChange * 0.5; // Apply with damping
    const finalVoltage = Math.max(0.9, Math.min(1.1, newVoltage || 1.0));

    const change = Math.abs(finalVoltage - state.busVoltages[bus.id]);
    if (change > maxChange) {
      maxChange = change;
    }
    newVoltages[bus.id] = finalVoltage;
  });

  const isConverged = maxChange < CONVERGENCE_THRESHOLD;

  return {
    busVoltages: newVoltages,
    lineFlows: calculateLineFlows(grid, newVoltages),
    isConverged: isConverged,
    iteration: state.iteration + 1,
  };
};


/**
 * A simplified Gauss-Seidel implementation.
 * It iteratively solves for bus voltages.
 */
export const runGaussSeidel: AlgorithmImplementation = (grid, currentState) => {
  const state = currentState ? JSON.parse(JSON.stringify(currentState)) : getInitialState(grid);

  if (state.isConverged) return state;

  const newVoltages = { ...state.busVoltages };
  let maxChange = 0;

  grid.buses.forEach(bus => {
    // Skip generator buses as their voltage is considered fixed (slack/PV bus simplification)
    if (bus.type === 'generator') {
      return;
    }

    let sumYV = 0;
    let sumY = 0;

    // Find connected lines and buses
    grid.lines.forEach(line => {
      let connectedBusId: string | null = null;
      if (line.from === bus.id) connectedBusId = line.to;
      if (line.to === bus.id) connectedBusId = line.from;

      if (connectedBusId) {
        const admittance = 1 / line.impedance;
        sumYV += (state.busVoltages[connectedBusId] ?? 1.0) * admittance;
        sumY += admittance;
      }
    });

    const busPower = bus.power ?? 0; // Negative for loads
    let newVoltage = state.busVoltages[bus.id];

    if (sumY > 0) {
      // Simplified voltage calculation from the power flow equation
      const estimatedCurrent = busPower / (state.busVoltages[bus.id] || 1.0);
      newVoltage = (sumYV - estimatedCurrent) / sumY;
    }
    
    // Clamp voltage to realistic values
    newVoltage = Math.max(0.9, Math.min(1.1, newVoltage || 1.0));

    const change = Math.abs((newVoltage) - state.busVoltages[bus.id]);
    if (change > maxChange) {
      maxChange = change;
    }
    newVoltages[bus.id] = newVoltage;
  });

  const isConverged = maxChange < CONVERGENCE_THRESHOLD;

  return {
    busVoltages: newVoltages,
    lineFlows: calculateLineFlows(grid, newVoltages),
    isConverged: isConverged,
    iteration: state.iteration + 1,
  };
};

/**
 * A simplified, non-iterative DC Power Flow approximation.
 */
export const runDCPowerFlow: AlgorithmImplementation = (grid, currentState) => {
    if (currentState && currentState.iteration > 0) return currentState;

    const voltages: { [busId: string]: number } = {};
    grid.buses.forEach(bus => {
        // In DC-PF, voltage magnitude is assumed to be 1.0 p.u. everywhere
        voltages[bus.id] = 1.0;
    });

    // In a real DC-PF, you'd solve a linear system for voltage angles.
    // We'll fake it by creating small angle differences based on connectivity.
    const angles: { [busId: string]: number } = {};
    const genBuses = grid.buses.filter(b => b.type === 'generator');
    const loadBuses = grid.buses.filter(b => b.type === 'load');
    
    genBuses.forEach((b, i) => angles[b.id] = 0.05 * (i+1));
    loadBuses.forEach((b, i) => angles[b.id] = -0.05 * (i+1));
    grid.buses.filter(b => b.type === 'bus').forEach(b => angles[b.id] = 0);


    const lineFlows: AlgorithmState['lineFlows'] = {};
    grid.lines.forEach(line => {
        const angleFrom = angles[line.from] || 0;
        const angleTo = angles[line.to] || 0;
        // P = (theta_from - theta_to) / X
        const flow = (angleFrom - angleTo) / line.impedance;

        lineFlows[line.id] = {
            flow: Math.abs(flow) * 10, // Scale for better visualization
            direction: flow > 0 ? 'from-to' : 'to-from',
        };
    });


    return {
        busVoltages: voltages,
        lineFlows: lineFlows,
        isConverged: true,
        iteration: 1,
    };
}

/**
 * Simplified Fast Decoupled implementation.
 * Similar to Newton-Raphson but assumes a constant, simplified Jacobian.
 */
export const runFastDecoupled: AlgorithmImplementation = (grid, currentState) => {
    const state = currentState ? JSON.parse(JSON.stringify(currentState)) : getInitialState(grid);
    if (state.isConverged) return state;

    const newVoltages = { ...state.busVoltages };
    let maxChange = 0;

    grid.buses.forEach(bus => {
        if (bus.type === 'generator') return;

        let powerMismatch = bus.power ?? 0;
        
        grid.lines.forEach(line => {
            const admittance = 1 / line.impedance;
            if (line.from === bus.id) {
                powerMismatch += (state.busVoltages[bus.id] - state.busVoltages[line.to]) * admittance * state.busVoltages[bus.id];
            }
            if (line.to === bus.id) {
                powerMismatch += (state.busVoltages[bus.id] - state.busVoltages[line.from]) * admittance * state.busVoltages[bus.id];
            }
        });
        
        // The "fast decoupled" simplification: use a fixed, less sensitive value for the update
        const constantJacobianEffect = 2.0 * (bus.power ?? 0);
        const voltageChange = -powerMismatch / (constantJacobianEffect || 1.0);

        const newVoltage = state.busVoltages[bus.id] + voltageChange * 0.7; // Damping
        const finalVoltage = Math.max(0.9, Math.min(1.1, newVoltage || 1.0));
        
        const change = Math.abs(finalVoltage - state.busVoltages[bus.id]);
        if (change > maxChange) {
            maxChange = change;
        }
        newVoltages[bus.id] = finalVoltage;
    });

    const isConverged = maxChange < CONVERGENCE_THRESHOLD;

    return {
        busVoltages: newVoltages,
        lineFlows: calculateLineFlows(grid, newVoltages),
        isConverged: isConverged,
        iteration: state.iteration + 1,
    };
};


/**
 * A stub for algorithms that are not yet implemented.
 * Returns a static, converged state.
 */
export const runStub: AlgorithmImplementation = (grid, currentState) => {
    if (currentState) return {...currentState, isConverged: true};

    const state = getInitialState(grid);
    return {
        ...state,
        isConverged: true,
        iteration: 1,
    };
};
