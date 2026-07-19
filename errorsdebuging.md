# Performance Optimization — Main Thread

Read PROJECT_CONTEXT.md.

Continue from the existing project.

Goal

Reduce main-thread work without changing the UI or functionality.

Optimize JavaScript execution.

Review

- DOM queries
- Event listeners
- Repeated loops
- Repeated selectors
- Layout thrashing
- Forced reflows
- Unnecessary calculations
- Timers
- Scroll events

Requirements

- Cache DOM elements.
- Use event delegation where possible.
- Debounce scroll and resize events.
- Batch DOM updates.
- Avoid repeated querySelector calls.
- Minimize layout recalculations.
- Replace expensive loops with efficient alternatives.
- Initialize components only when needed.

Preserve all existing functionality.

Do not redesign the website.

Provide a summary of all JavaScript optimizations.