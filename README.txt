Prototype 0.17 — CNS/ZSS Parser Milestone 1

What changed:
- compile_runtime.py now reads the actual source files:
  venus.cns
  venus_Common.cns
  common1.cns.zss
- Parses [Velocity] / [Movement] constants from venus.cns.
- Parses CNS StateDef metadata and controller blocks.
- Parses ZSS StateDef metadata.
- Generates venus_runtime_states.json automatically.
- Generates parser_report.json with CNS/ZSS parity and controller inventory.
- Browser runtime consumes the generated IR; movement regression behavior remains the 0.16.1 baseline.

Current parser/lowering scope:
States 0, 11, 20, 40, 50, 51, 52 only.
This is NOT full CNS/ZSS compatibility yet. Unsupported controllers are inventoried rather than silently claimed as implemented.

For GitHub Pages testing upload all files in this package. Python is build-time only; GitHub Pages does not execute it.
