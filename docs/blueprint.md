# **App Name**: Interactive Electricity Grid Algorithm Visualizer (Frontend Only)

## Core Features:

- Interactive Grid Display: Draw a power grid with 5–10 buses (nodes) connected by transmission lines, representing buses, transmission lines, generators and loads, and showing direction of power flow with animated arrows.
- Algorithm Selector: Dropdown or tabs for Newton-Raphson, Gauss-Seidel, DC Power Flow, Fast Decoupled Flow. Each algorithm, when selected, triggers different voltage/flow distributions, different convergence behavior (iterations, time), and different visuals (speed, smoothness of arrows, etc.).
- Simulation Animation: Animate current flow through lines using moving particles or gradient color. Use color intensity or line width to represent magnitude of power flow. Nodes slightly pulse to show voltage magnitude. Include an Iterate button to step through algorithm iterations visually.
- Metrics Panel: Display mock or computed values: Convergence Time (e.g., 0.32s), Iterations (e.g., 5), Total Power Loss (e.g., 2.3%), Voltage Deviation (%). Update values per algorithm.
- Comparison View: Shows a small chart (bar or radar) comparing all algorithms by Speed, Accuracy, Convergence Stability, and Power Loss.
- Educational Info: Small info boxes explain what the algorithm does, why the flow pattern looks different, and trade-offs (speed vs accuracy).
- No Backend / No Database: All calculations and animations run client-side. Store simulation data only in browser memory (variables, not Firestore). No authentication or API calls.
- Smart Algorithm Recommender: Gemini analyzes grid size, line impedance patterns, and node count, then recommends the most efficient algorithm (Newton-Raphson for high precision, DC Power Flow for real-time needs). Output: algorithm choice + reasoning summary. The AI is used as a tool to make decisions about which algorithm is most appropriate.

## Style Guidelines:

- Primary color: Electric Blue (#7DF9FF) — evokes the essence of energy, movement, and electricity; used for active nodes, power lines, and highlights across the grid.
- Background color: Dark Gray (#2E2E2E) — provides depth and contrast, allowing vibrant elements and animations to stand out clearly.
- Accent color: Yellow-Green (#BFFF00) — emphasizes interactivity and direction of energy flow, bringing visual energy and guiding user attention.
- Secondary color: Cool Cyan (#00E7FF) — supports the primary tone for gradients, secondary lines, and hover effects.
- Text color: Off-White (#F5F5F5) — ensures high readability on the dark background.
- Panel / UI background: Charcoal Gray (#1F1F1F) — used for control panels, sidebars, and metric displays to create clear visual separation.
- Error / Alert color: Magenta Pulse (#FF007C) — reserved for grid instability, faults, or voltage warnings, adding a strong visual contrast.
- Body and headline font: 'Inter', a sans-serif font for a modern and neutral appearance that ensures legibility.
- Use minimalist, geometric icons to represent generators, loads, and other grid elements. The icons should be easily distinguishable and align with the clean UI.
- Employ a centered grid layout with controls on the right or bottom, ensuring an intuitive and responsive experience for both desktop and tablet.
- Use smooth animation transitions and subtle effects for the power flow and node interactions to enhance user engagement without causing distraction.