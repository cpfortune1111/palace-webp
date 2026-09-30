0.19.8c Multitouch Tick Debug Input
Upload/replace ONLY index.html.

Debugger-only improvements:
1. Joystick no longer captures its pointer, allowing a second finger to press HUD Play/Pause/Step while joystick is held.
2. HUD debug buttons use pointerdown for reliable mobile multitouch.
3. While paused, physical input state is intentionally NOT sampled into CMD history until a single-step tick is requested.
   Therefore you can set joystick/buttons while paused, then press ▸| to commit that input on exactly one simulation tick.
4. Each ▸| press = one normal input sample + one simStep, then remains paused.

This does NOT add artificial gameplay command buffering. It exposes the real tick-by-tick CMD input pipeline for debugging long commands.
