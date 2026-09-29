0.19.7a State IR Shape Fix
Upload/replace index.html + venus_runtime_states.json. venus_cmd_runtime.json is unchanged and included only for convenience.

Root cause of blank stage/character/X button:
State 200 was emitted in the wrong nested schema:
  {"stateDef": {...}}
but the runtime's normalized state IR expects flat fields:
  {"type":"S","physics":"S","anim":200,"ctrl":0,...}
Runtime validation therefore failed during startup and the page stayed in the pre-runtime fallback HUD ("Action 0 · Idle").

Fixed State 200 to the same normalized schema as states 0/10/11/etc.
Added explicit State 200 validation so this cannot fail silently again.

Expected after deploy:
- stage + Venus + Mars + X button visible
- X -> State 200 / AIR 200 -> temporary return State 0
- movement regression unchanged
