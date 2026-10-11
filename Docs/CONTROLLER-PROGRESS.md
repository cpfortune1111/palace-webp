# Controller implementation progress

Reference: Ikemen GO `cb56d73badb322f3725257c2e8cfd157b2c3989d`; MUGEN 1.1b1 documentation. The registry inventory is not a complete parameter certification.

## 0.24.11 — Helper scheduling

Helper execution now uses per-state controller counters. Persistent defaults to 1; values 2–128 count eligible controller visits between successful executions; nonpositive values execute once per state; values above 128 fall back to 1 for MUGEN compatibility. False triggers do not reset the counter. State entry resets counters. Hitpause skips ordinary controllers without consuming counters, while ignorehitpause controllers remain eligible without advancing helper state time or animation.

Tests: `Tools/check-controller-schedule.mjs`, `Tools/check-helper-schedule.mjs`, and Saturn simultaneous-super browser regression.

Pending common scheduling parity: roots, lifecycle direct handlers, negative-state treatment, custom-state hitpause transitions, RunState and Ikemen nested blocks. This helper work does not certify engine-wide common parameter support.

## 0.24.10 — Life and power controllers

`LifeAdd`, `LifeSet`, `PowerAdd` and `PowerSet` now use one dispatcher for root states, lifecycle controllers and helper fallback controllers. Parameters evaluated in caller context include `value`, `redirectid`, and LifeAdd `kill`/`absolute`. Missing redirect targets have no effect. Helpers retain separate life; power belongs to their root.

Implemented paths include native integer input conversion, LifeAdd defense scaling and minimum negative damage, half-away-from-zero rounding, nonlethal life floor, life/power maximum limits, signed overflow handling, GetHitVar kill metadata and received-damage accumulation. Current imported characters use MUGEN compatibility. The reusable dispatcher also tests the Ikemen nonlethal/healing differences.

Executable checks: `Tools/check-resource-controllers.mjs` and resource assertions in `Tools/check-saturn-priority.cjs`.

Still not certified complete: round-no-damage assertions, team power sharing, maximum-power mode, native win-type metadata, fall/super defense composition, engine-version selection for future Ikemen-native imports, and common controller persistence/ignorehitpause. These require real engine integration, not just module-level optional hooks. Other controller groups and parameter candidates remain pending.

## 0.24.09 — Variables

Root floating/system-floating storage is shared across expression evaluation, state controller execution and initialization. Native `v`/`fv` variable targets, expression indices and integer truncation have focused tests. VarRandom lifecycle single/reversed bounds are tested.

Pending: complete parent/root redirection, helper VarRandom unification, variable persistence boundaries across rounds, redirectid, and native system-variable restrictions. No whole-controller certification is claimed yet.
