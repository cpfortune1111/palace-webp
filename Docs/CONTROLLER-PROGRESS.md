# Controller implementation progress

Reference: Ikemen GO `cb56d73badb322f3725257c2e8cfd157b2c3989d`; MUGEN 1.1b1 documentation. The registry inventory is not a complete parameter certification.

## 0.24.14 — Root scheduling

P1/P2 generic dispatch now uses independent actor/state-entry schedules before trigger evaluation. Successful triggers reset each controller's counter; re-entering the same state resets counters via the entry serial. Source locations preserve identity across normalized controller copies; explicit lifecycle identity preserves controllers without source metadata. Ordinary hitpause skips do not consume persistence counters. Lifecycle -3/-2 forwarding marks the negative-state MUGEN persistence exception. Helper dispatch keeps its own scheduling rather than double-consuming root counters.

Tests exercise independent actor counters, source-copy identity, state re-entry, negative-state exceptions, root execution intervals and the existing combat/variable/helper regression suite.

Pending: -1 command-path origin tagging, positive lifecycle pre-trigger handling, specialized reaction controller paths, custom-state hitpause transition suppression and Ikemen nested blocks/RunState. Common parameter support is therefore not yet fully certified.

## 0.24.13 — Parent/root variable owners

The four parent/root variable controllers now delegate to shared type/index/value conversion, including native `v`/`fv` and normalized target forms. Redirection selects the receiver first; parent/root selection then chooses the variable owner while expressions remain in caller context. ParentVar on nested helpers selects their direct parent. Missing/destroyed parents and non-helper receivers produce no write. RootVar selects the helper's owning root. Float and system-variable target forms use their corresponding storage.

Module tests cover all four controller families, float values, redirected nested helpers and missing parents. Browser assertions verify distinct child/parent/root storage during a real runtime helper tree. Existing Saturn simultaneous-super regression remains included.

Remaining compatibility work includes native assignment-expression syntax, redirected expression edge cases, Ikemen sparse storage integration, parent trigger redirection consistency and common root scheduling. These implementations are not a blanket certification of all variable controller parameters.

## 0.24.12 — Unified variable controllers

VarSet/VarAdd/VarRangeSet/VarRandom use one dispatcher for roots and helper fallback, with lifecycle range/random handling delegated to it. Range defaults, integer/float distinction, signed 32-bit integer wrapping, float32 rounding, caller-context expression indices, redirected variable storage and invalid/empty ranges have tests. Random ranges support one upper bound, a pair or reversed bounds; runtime expression splitting preserves nested function commas.

The module also provides Ikemen extended-index sparse storage, zero-range deletion and the pinned native 2500-iteration limit. These are module-tested, not yet engine-certified: selecting Ikemen mode and fully sparse storage for future Ikemen character imports remain pending. Current imported characters use bounded MUGEN storage. Parent/root controller families and complete persistence semantics remain pending.

Tests: `Tools/check-variables.mjs`, `Tools/check-lifecycle-random.mjs` and root redirected-range assertions in `Tools/check-saturn-priority.cjs`.

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
