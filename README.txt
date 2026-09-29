Prototype 0.17.1 — CNS/ZSS Parser Milestone 1 (Corrected Package)

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

Build ID: parser-m1-20260929-01
Correction: index.html title/HUD now identifies 0.17.1; runtime asset URLs use ?v=0171 for cache busting.

0.17.3 SOURCE-FIDELITY FIX
- State 52 follows venus_Common.cns: ctrl=0 on entry; CtrlSet value=1 at Time=3 (or PrevStateNo=5040); ChangeState 0 only at AnimTime=0.
- Held holdup may re-enter State 40 as soon as control is restored. No Web-only release/re-press jump latch.
- State 52 VelSet/PosSet Time=0 and horizontal friction-threshold VelSet are represented in IR.
- BUILD state52-corrected-20260929-01 / cache bust v=0172.

0.17.3 correction: initialize prevState/runtimeCtrl before first simulation tick; runtime loop now surfaces exceptions as RUNTIME ERROR instead of silently freezing to a black screen.
