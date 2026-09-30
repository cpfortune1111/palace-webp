0.19.9 Deterministic AIR Clock
Upload/replace ONLY index.html.

Engine-level change:
- Venus AIR animation is advanced by simStep(), exactly one AIR tick per simulation tick.
- draw() is render-only and never advances Venus AIR animation.
- Pause freezes both state logic and AIR animation.
- Each Step commits current physical input, runs exactly one sim tick, advances AIR exactly one tick, then stays paused.
- A newly entered state stays on its first AIR element at Time=0 until the next simulation tick.
- Completed AIR actions do not visually wrap in the renderer; CNS controllers decide transitions.

No SFF, AIR sequence, atlas, CNS, CMD, camera or joystick data changed.
Mars remains a comparison dummy and still uses its old visual-only clock; it is not a fighter runtime yet.

Regression tests:
1 normal Play crouch/stand still looks normal.
2 Pause -> hold down -> Step repeatedly:
  State10 AIR10 must progress deterministically, then State11 AIR11.
3 release down -> Step: State12 AIR12 progresses deterministically -> State0.
4 X -> State200; each Step advances attack by exactly one simulation/AIR tick.
5 paused without Step: Venus frame must never change.
