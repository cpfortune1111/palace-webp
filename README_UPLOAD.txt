0.19.8d AIR Tick Order Fix
Upload/replace ONLY index.html.

Source verification:
Action 10 = 40,0 (1 tick) -> 40,1 (2 ticks)
Action 11 = crouch idle
Action 12 = 40,1 (1 tick) -> 40,0 (2 ticks)
Runtime atlas mappings for 40,0 / 40,1 are correct.

Root cause was NOT swapped SFF sprites:
draw() advanced fi BEFORE drawing. A 1-tick AIR element could therefore be skipped.
Also the visual animation could wrap one frame before the AnimTime=0 ChangeState.

Fix:
- render current AIR element first, advance its clock afterwards
- align animDone/AnimTime=0 with the final visible tick
- no AIR order or atlas sprite mapping changed

Expected crouch: 40,0 -> 40,1 -> Action11 crouch.
Expected stand: Action11 -> 40,1 -> 40,0 -> State0.
