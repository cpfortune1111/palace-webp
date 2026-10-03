# 0.23.47 — Round camera and announcement buffers

- Surviving fighters execute their source animation/state exits after KO, without dispatching another command or new HitDef.
- Round reset restores source player positions, camera position and start zoom.
- StageTraining.def camera/player/bound fields are exported to stage_camera.json. Camera zoom is constrained to 0.75–1 and shared by GLB, fighters, reflections, world effects and collision display. Screen portraits/HUD stay unscaled.
- KO result updates camera and screen bounds each simulation tick, preventing the fallen fighter from dragging the view away from the survivor.
- Source voice durations are exported from WAV files. Intro waits for character speech plus start.waittime; Round/Fight announcements do not overlap; KO announcer finishes before the 45-tick over.wintime buffer and winner pose. Next round waits for winner speech to finish.
- Knockback is not reduced: attacker HitDef supplies initial velocity, IKEMEN KO adjustments modify it, and Common HitVelSet applies it. State 200 grounded lethal hit: -16 × 0.66 - 10 = -20.56 local X velocity (world +20.56 when defender faces left).

References: original local StageTraining.def and fight.def; IKEMEN develop src/camera.go and src/char.go. Camera framing is a compatible subset, not a complete port of IKEMEN smoothing.

Validation: 44 round-flow checks, 5 KO/camera regression checks, and camera/HUD clipping checks pass.
