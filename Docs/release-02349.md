# 0.23.49 — KO slowdown and intro continuity

- Original fight.def has slow.time=60. Omitted slow.speed and slow.fadetime use IKEMEN defaults: 0.25 and 45. The first 15 simulation ticks run at quarter speed, then speed recovers linearly over 45 simulation ticks. This stretches wall-clock duration, rather than treating slow.time as 60 rendered frames. Both character logic and stage animation use the slowed simulation clock; audio is unchanged. Debug step still advances exactly one simulation tick. KO slowdown applies to VS/Watch and lethal hits in Training, not Time Over.
- Opening black fade-out and final black fade-in now take 30 ticks each. Between-round transition stays 30 in + 30 out.
- Lifecycle animation-end ChangeState controllers run at the completion boundary before the AIR runner can wrap. A191 finishes at tick 227 directly into S1990/A1910, avoiding the unintended A191 E1 shown at tick 227. The source AIR durations and controllers remain unchanged.
- Previously approved disabled additional KO velocity remains disabled.

References: original local fight.def [Round]; IKEMEN src/system.go game-speed adjustment and official Lifebar-features wiki.

Validation: 950 intro/slowdown assertions; 348 lifecycle checks; 51 round-flow checks plus fade, KO velocity and camera regressions.
