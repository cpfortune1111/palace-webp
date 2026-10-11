## 0.24.36 — NoWalk / NoAutoTurn execution

NoWalk and NoAutoTurn now join the actor assertion dispatcher and can mix with the five damage flags in flag/flag2–flag8. NoWalk prevents default P1/P2 input from entering walk state, without suppressing explicit ChangeState or scripted AI transitions. NoAutoTurn suppresses actual root auto-turning; AI's additional orientation adjustment also honors current/prior flags. Helpers store/read these flags but, matching native root-only autoTurn, do not receive invented automatic turning behavior.

Auto-turn checks now read prior assertions before active-tick clearing; a prior snapshot prevents the later AI orientation path from bypassing the flag. Round reset clears both current/prior sets. IsAsserted supports these two additional actual flags. Unit checks verify mixing with damage assertions. Browser checks verify both roots hold facing, cannot enter default walking, resume when disabled, retain explicit state changes and carry prior assertions through reset. Existing combat regressions remain required.

Partial support: native hardcoded-key ordering versus current post-controller command dispatch, StateDef/changeState auto-facing interactions, full AI/input parity, WinMugen/Ikemen version selection, exact pause/round ordering and other actor/global assertions remain pending. Mixed combinations outside these seven known flags still fail explicitly; no complete AssertSpecial certification is claimed.

## 0.24.35 — AssertSpecial damage suppression

Five actor-local assertions now execute: NoHitDamage, NoGuardDamage, NoRedLifeDamage, NoDizzyPointsDamage and NoGuardPointsDamage. Their flags are case-insensitive literals; flag/flag2–flag8, enabled and caller-context redirectid follow pinned compiler-functions.go/bytecode.go. Root/helper storage is actor-owned. Actual HitDef resolution suppresses only the selected HP/red-life/dizzy/guard resource, while red-life GetHitVar absolute amounts remain calculated. IsAsserted reads these five real flags.

Flags clear on active root simulation ticks and helper steps, including helper hitpause, matching the pinned MUGEN 1+/Ikemen reset rule. Unit tests cover multi-flags, redirects, explicit disabling, missing targets and unsupported mixtures. Browser tests verify redirected root immunity, HP re-enabling, guard/resource isolation, helper-local hitpause execution/reset and expression reads. Existing Saturn simultaneous-super regression remains required.

Partial AssertSpecial support only: other actor/global flags, mixed damage/non-damage flag combinations, WinMugen reset exceptions, exact pause/round/global ordering, complete IsAsserted semantics and legacy flag behavior remain pending. Unsupported mixed families fail explicitly rather than silently dropping flags. Damage/resource timing and defaults remain pending as documented above. No complete assertion/controller certification is claimed.

## 0.24.34 — Explicit HitDef dizzy/guard point consumption

HitDef now consumes explicit dizzypoints on hit and guardpoints on guard through the actual WEB contact resolver. Independent AttackMulSet slots, target defense, half-away rounding, minimum positive damage and no remaining-life cap follow the pinned computeDamage path. Point consumption clamps to resource bounds and respects internal enabled/round gates. Explicit red-life/dizzy/guard point expressions evaluate in caller context at HitDef/Projectile creation using native integer conversion.

Unit checks cover resource selection, depletion, negative/healing input and gates. Browser tests exercise actual resolver writes, hit/guard isolation, var expressions, 2x/3x point factors, low-life unbounded damage and actual projectile spawn snapshots despite later root changes. Saturn simultaneous-super regressions pass. HitDef inventory and its reproducible generator now classify these four resource parameters as Partial, not fully implemented.

Remaining: omitted-value native constants, attack-base composition, native queued end-of-update consumption/keepstate gating, no-point-damage assertions, suppression while already dizzy, GetHitVar pending-damage lifetime, automatic recovery/stun/guard-break, native bar configuration, aerial guards and helper collision parity. The complete controller/parameter goal remains unfinished.

## 0.24.33 — Dizzy/guard point resource controllers

DizzyPointsAdd/Set and GuardPointsAdd/Set now dispatch through Engine/point-controllers.js into root/helper-owned resources. Caller-context value/absolute/redirectid, signed integer inputs, half-away rounding, target defense, zero-Add behavior, resource bounds and enabled/round gates follow pinned bytecode.go and char.go. Root resources reset each round; optional imported data.dizzypoints/data.guardpoints are read from battle constants, otherwise native CharData's 1000 defaults apply. Helper resources currently initialize lazily using their root maximum.

Expression queries dizzypoints/dizzypointsmax/guardpoints/guardpointsmax read actual actor storage. Unit checks cover all four controllers, limits, redirects, absolute, defense and gates. Browser checks verify both roots, helper-ID redirect, helper-local hitpause dispatch, helper defense rounding, expression reads and gated writes. Existing combat regressions remain required.

Partial support only: actual HitDef point consumption/AttackMulSet point factors, automatic recovery, stun/guard-break states, HUD/fight.def bar configuration, native helper spawn-time inheritance, character constant import completeness, exact roundNoDamage semantics and nonfinite conversion remain pending. Neither full resource systems nor complete controller/common-parameter compatibility are certified.

## 0.24.32 — Life/red-life synchronization

LifeAdd/Set now invoke the native lifeSet red-life rules through shared synchronizeLifeRedLife: death clears red life, disabled red life mirrors HP, and enabled red life is unchanged by healing (even when its current value is below HP). WEB hit resolution also synchronizes death/disabled resources independently of explicit HitDef redlife damage. Caller redirects apply these rules to the target root/helper.

Unit checks verify healing preservation, death, disabled LifeSet/LifeAdd, redirects and suppressed writes. Browser tests verify actual root healing/death, disabled P2 storage and helper death. Pixel-readback fixtures explicitly request a read-friendly canvas backend and establish camera coordinates; semantic pixel assertions are unchanged.

Remaining: exact native roundNoDamage integration (the LifeAdd/Set engine adapter has not yet supplied that gate), immortal helper rules, queued HitDef timing, team sharing, native redlifebar config, recovery/HUD, nonfinite conversions and complete compatibility. No blanket controller certification is claimed.

## 0.24.31 — Explicit HitDef red-life damage

Explicit HitDef hitredlife/guardredlife now calculate independent red-life damage using the actor-owned AttackMulSet redlife slot (including projectile snapshots), target defense, half-away rounding, minimum positive damage and remaining-life bounds. Actual WEB contact resolution consumes the selected hit/guard amount and clamps red life against post-hit life. GetHitVar hitredlife/guardredlife expose unbounded computed amounts. Zero or omitted explicit values do not change existing imported characters.

Unit checks verify multiplier, defense, rounding, bounds, healing, feature gates and death clearing. Browser resolver assertions verify actual resource changes for 1x/2x multipliers and guard metadata. The existing simultaneous Saturn super regression remains required.

Partial implementation only: native omitted-value constants import, attack-base composition, queued end-of-update consumption timing, accumulated GetHitVar metadata, noredlifedamage assertions, keepstate gating and helper-target collision routing remain pending. Existing LifeSet synchronization, recovery, HUD, native configuration and team sharing gaps remain. This does not certify full HitDef or AttackMulSet support.

## 0.24.30 — RedLife resource controllers

RedLifeAdd/Set now execute through Engine/redlife-controllers.js with actual root/helper storage and redlife expression reads. Caller-context value/absolute/redirectid, integer conversion, defense scaling, native half-away rounding, alive lower bound=current life and upper bound=lifeMax follow pinned bytecode.go/char.go. Dead actors clear redlife even when round writes are gated. Root round reset initializes resources at lifeMax.

Unit checks cover resource bounds, absolute, defense rounding, missing targets, enabled/no-damage gating and death clearing. Browser checks verify both root/helper writes, actual helper-local RedLifeAdd, expression reads and current WEB round gating.

Not complete: HitDef redlife/guardredlife and AttackMulSet redlife consumption, automatic recovery, red-life HUD, native fight.def redlifebar configuration import (WEB currently has an internal enabled flag), exact roundNoDamage rules, LifeSet/LifeAdd synchronization, team life sharing, nonfinite conversion and save-state parity. These controller paths do not certify the full red-life system or all parameters.

## 0.24.29 — AttackMulSet damage execution

AttackMulSet now evaluates value and per-field overrides in caller context and writes actor-owned root/helper attack state. value sets four native multiplier slots before explicit damage/redlife/dizzypoints/guardpoints overrides, following pinned compiler-functions.go/bytecode.go. Actual root/helper HitDef damage uses the attack damage factor. Projectiles copy spawning actor state at creation, matching char.go parentAttackMul snapshots, rather than reading later root changes. Root round reset restores defaults.

Unit tests cover defaults, precedence, missing targets and snapshot independence. Browser tests verify root/helper redirects, actual projectile creation with an immutable multiplier snapshot, and 1x/2x/3x actual HitDef damage. Existing combat regressions remain required.

Not fully implemented/certified: redlife/dizzypoints/guardpoints slots are evaluated/stored but their resource systems and HitDef consumption are still missing; they are not counted as complete parameter support. Also pending native TargetLifeAdd/fall damage/attack-base composition, projectile edge cases, helper hit routing details, negative/nonfinite damage and save-state parity. The complete controller objective remains incomplete.

## 0.24.28 — Actor-owned defense multiplier

DefenceMulSet now uses Engine/defense-controllers.js and real root/helper storage. value, onhit and redirectid evaluate in caller context; literal multype 0/1 selects reciprocal damage multiplier versus direct defense multiplier. MUGEN defaults onhit=true/multype=0 and Ikemen defaults false/1 follow pinned bytecode.go. Current imported characters use MUGEN mode. Effective custom defense activates only in MoveType H when delayed, matching char.go's final-defense calculation. Damage now divides by effective defense; LifeAdd uses the same custom defense factor. Round reset restores root defaults; helpers retain independent state.

Unit tests verify both version defaults, delay, reciprocal/direct values and missing targets. Browser LifeAdd checks verify root redirects, delayed activation and actual helper-local defense without changing root storage. Existing combat regressions remain required.

Not fully certified: Ikemen import/version selection, native final-defense update tick timing, complete base/fall/super/team defense composition, zero/negative/nonfinite defense damage behavior, helper attack damage routing, fall damage and save-state parity. Module semantics and current root damage paths are not a claim of full defense certification.

## 0.24.27 — HitVelSet target velocity

HitVelSet joins the shared velocity dispatcher rather than reading caller context hitVelocity in a separate switch. Flags and redirectid evaluate in caller context, but selected axes copy the target's own GetHit xvel/yvel. Relative X is target GetHit xvel*facing; mutable world adapters then retain correct world motion. Omitted/zero flags preserve velocity. No MoveType H gate is applied, matching pinned bytecode.go. Root, reaction and ground-reaction bindings expose actual GetHit storage.

Unit tests distinguish caller and target data, disabled axes and missing targets. Browser fixtures verify both roots at different facings, a nested-helper redirect and actual helper-local HitVelSet during hitpause. Existing reaction, drawing and simultaneous Saturn super regressions remain required.

Pending certification: Z physics/GetHit zvel, full native GetHit lifecycle/reset/version differences, coordinate import and save-state parity. Z is explicitly rejected rather than ignored. All-controller/parameter completeness remains unproven.

## 0.24.26 — Sprite priority ownership and redirection

SprPriority now uses Engine/state-properties.js instead of a player-number-only write. Root/reaction/helper bindings expose actual priority setters; helper-local generic execution changes the helper rather than its root. Native signed integer conversion and omitted value=0 follow pinned bytecode.go. redirectid expressions select existing roots/helpers; missing IDs do not write.

Unit checks verify defaults, truncation and missing targets. Browser checks verify P1/P2 redirects, nested-helper redirects, actual helper-local execution during hitpause and resulting root canvas z-order. Existing drawing, movement, reaction and Saturn simultaneous-super regressions passed.

Not certified complete: nonzero Ikemen layerno (explicitly rejected, not ignored), unified helper/root/effect ordering between both root canvases, native equal-priority insertion order, stage layers and save-state parity. Default layer 0 is the current renderer path. Full controller/parameter compatibility remains incomplete.

## 0.24.25 — Turn ownership and velocity

Turn now shares Engine/state-properties.js, resolves redirectid in caller context and reverses target facing plus relative X velocity. Mutable facing bindings were added to both roots, reaction fighters and helper generic forwarding. Helper-local Turn no longer changes its root; specialized reaction Turn no longer bypasses the unified dispatcher. Pinned bytecode.go Turn invokes char.go setFacing, which flips both facing and native relative velocity, preserving world motion.

Unit tests verify redirected/local target reversal and missing targets. Actual browser fixtures verify P1/P2 redirect writes, helper redirect writes and helper-controller execution during hitpause without changing root facing or world velocity. Existing reaction interval/hitpause tests and Saturn simultaneous-super regressions remain required.

Pending certification: all native binding/autoturn/round interactions, zero-facing edge behavior, alternate Ikemen nested controller forms and save-state parity. The full controller/parameter objective remains incomplete.

## 0.24.24 — Control and state-type redirection

CtrlSet/StateTypeSet share Engine/state-properties.js before specialized dispatch and write real binding/redirected actor properties. CtrlSet normalizes evaluated numeric values to 0/1. StateTypeSet accepts value as the native statetype alias, gives statetype precedence, supports imported moveType and native movetype spellings, validates state/move/physics categories and preserves omitted fields. Missing redirected IDs have no effect.

Pinned compiler-functions.go establishes statetype/value precedence and accepted literal types; bytecode.go resolves redirects and evaluates CtrlSet in caller context. Unit checks verify boolean conversion, aliases, omitted fields and invalid inputs. Browser assertions verify P1/P2 and nested-helper properties while preserving caller state, alongside existing Saturn simultaneous-super regressions.

Not full certification: native previous state/move-type history and downstream change detection, native control flags across all pause/round modes, alternate Ikemen syntax/compiler forms and save-state parity remain pending. All-controller certification remains incomplete.

## 0.24.23 — Position controller redirection and origins

PosSet/Add now execute through Engine/position-controllers.js before specialized dispatch. Caller-context input is converted to float32; missing redirect IDs do not write, omitted axes remain unchanged. PosSet X starts at camera X in target coordinates rather than absolute world zero; Y starts at target ground/platform origin. PosAdd X uses target facing, not caller facing. Position and velocity redirected adapters share mutable root/reaction/helper accessors.

Checks: check-position-controllers.mjs verifies local-scale ratio, camera/ground origins, target facing, float32 and missing targets. Actual browser tests set nonzero camera X and assert coordinates for both roots and a facing=-1 nested helper. Existing movement, reaction scheduling/hitpause, drawing and Saturn simultaneous-super regressions remain required.

Not fully certified: Z-axis stage physics, real native localScale/ground/platform import and stage integration, bound-position offsets, native interpolation/history updates and save-state parity. Z parameters fail explicitly instead of being ignored. Full controller inventory remains incomplete.

## 0.24.22 — Velocity controller redirection

VelSet/Add/Mul share Engine/velocity-controllers.js before specialized dispatch. Caller expressions evaluate before writing the redirected target's relative velocity; missing IDs do not write. Root and helper world velocity adapters convert X using target facing. Inputs/results use native float32 rounding; omitted axes retain their values. VelSet/Add scale redirected values; VelMul does not scale multipliers, matching pinned bytecode.go.

Tests: check-velocity-controllers.mjs covers caller context, omitted axes, missing IDs, local-scale ratio, multiplication and float32. Real browser assertions verify both root directions and nested-helper writes at facing -1, plus existing combat/scheduler regressions.

Not full certification: Z-axis stage physics, native localScale metadata import/wiring (current imported actors use one shared WEB coordinate system), native clamp/platform/binding behavior and save-state parity remain pending. Z parameters fail explicitly rather than being ignored. Position controller redirection and camera-relative PosSet remain separate gaps.

## 0.24.21 — Reaction ignorehitpause execution

Source reaction dispatch now gates controller scheduling with the actual hitpause state instead of returning before controllers. Opted-in persistent counters continue; ordinary counters are not consumed. Controllers-only forwarding allows the outer simulation pause to execute P1/P2 reaction controllers while retaining one timer decrement and frozen state time, AIR advancement, hit time and physics. Entity-defender pause forwards paused source reactions directly rather than decrementing hitshake once inside and again outside.

Executable browser checks cover specialized one-shot Turn, interval VarAdd during three paused visits, unchanged position/time/AIR/hittime, resume behavior and P1/P2 outer simulation forwarding with entityDefenderPause both false and true. Existing scheduler, drawing, Map/resource/helper and Saturn simultaneous-super regressions are retained.

Remaining common-parameter gaps include entry-time ChangeAnim shortcuts, native custom-state hitpause ChangeState suppression, non-source legacy reaction paths, pause-blocked helpers, debug/clipboard and Ikemen nested blocks/RunState. This is not certification of all common parameters.

## 0.24.20 — Reaction persistence and PosAdd facing

Specialized fall/reaction dispatch now uses independent actor/state-entry schedules before trigger evaluation instead of only a persistent=0 executed set. Generic fallback controllers mark scheduling already applied, avoiding a second counter decrement. Reaction entry serials reset schedules even when re-entering the same state; round reset clears both root and reaction schedules.

The actual reaction fixture verifies VarAdd persistent=2 with a false intervening trigger, specialized Turn persistent=3, PosAdd persistent=0 and same-state re-entry. This revealed and corrected generic PosAdd X to add x*facing, matching pinned char.go addX. Native local-coordinate redirection, Z movement and bound offsets remain unimplemented in that generic branch.

Still pending common-parameter certification: reaction ignorehitpause execution (the outer hitshake path currently skips controllers), entry-time ChangeAnim shortcuts, custom-state hitpause transition suppression, debug/clipboard and Ikemen nested blocks/RunState. No full movement or scheduling certification is claimed.

## 0.24.19 — Lifecycle scheduling and command origins

Positive lifecycle forwarding no longer rejects false triggers before the shared scheduler. Native bytecode.go decrements persistent counters before trigger evaluation; the browser fixture verifies a persistent=2 controller with a false trigger on visit 1 executes on visits 0/2/4, not 0/3. P1 normal/reaction command and P2 command forwarding now annotate state -1 and preserve original scheduling identity, matching compiler.go's exclusion of all negative states from persistent handling.

Tests: lifecycle VarRandom regression, negative-state scheduler unit checks, real browser lifecycle conditional execution and existing simultaneous Saturn supers. Remaining scheduling gaps include specialized reaction controllers, custom-state hitpause transition suppression, clipboard/debug paths and Ikemen nested blocks/RunState. These changes do not certify all common parameters.

## 0.24.18 — Angle trails and reflections

Afterimage capture now clones actor angle state, including scale/pivot arrays, instead of retaining mutable references. Trail rendering applies the recorded matrix and animation-facing convention. Stage reflections apply actor angle drawing under the existing mirrored floor transform. Pinned native char.go records charSD for afterimages and defaults reflection data to char sprite data.

Checks: immutable snapshot unit tests, actual browser trail pixel bounds before/after root angle reset, and reflection renderer matrix interception. Existing Saturn simultaneous-super regression remains required. Not full certification: AfterImage palette/blending parameters, helper trails, alternative reflection overrides, projection modes, local-coordinate parity and paused/frozen drawing lifecycle remain pending.

## 0.24.17 — Angle X/Y orthographic

Pinned Ikemen render.go uses orthographic projection by default. WEB AngleDraw now applies X(-x) × Y(y) × Z(z) with Canvas coordinate conversion, rather than rejecting X/Y angles or inventing perspective. Independent transformed-point tests cover combined axes; real browser pixel bounds verify 60-degree X/Y tilt, 90-degree Z rotation and tick reset. Saturn simultaneous supers at offsets 0/1/5 still pass.

Not certified complete: perspective modes 1/2, native local-coordinate/aspect/pivot parity, reflections, afterimages and paused drawing lifecycle. The overall controller/parameter goal remains incomplete; no unsupported controller is counted as implemented.

# Controller implementation progress

Reference: Ikemen GO `cb56d73badb322f3725257c2e8cfd157b2c3989d`; MUGEN 1.1b1 documentation. The registry inventory is not a complete parameter certification.

## 0.24.16 — Angle state and 2D drawing

AngleSet/Add/Mul/Draw evaluate numeric expressions in caller context and support redirected roots/helpers. Defaults follow the pinned bytecode: AngleSet and AngleMul use zero for omitted axes; AngleAdd and AngleDraw preserve omitted axes. Float32 angle storage persists across ordinary ticks; enabled/scale/pivot draw modifiers reset each active tick. Repeated AngleDraw scales multiply. Pivot and per-actor facing are applied to actual root/helper sprite drawing.

Tests: `Tools/check-angle-controllers.mjs`; browser pixel-bound assertions verify a 90-degree root rotation exchanges width/height and reset restores the original image bounds, while P1/P2 angle storage stays independent. Existing helper, Map, variable, resource and Saturn simultaneous-super assertions pass.

Pending certification: nonzero xangle/yangle perspective rendering, native reflection/afterimage transforms, frozen-round reset timing, camera/local-coordinate pivot parity and custom hitpause rendering. X/Y angle state is evaluated and stored, but the 2D renderer explicitly throws on nonzero X/Y projection rather than claiming support. This is not full Angle family certification.

## 0.24.15 — Ikemen maps

Nine map controllers now have execution paths: MapSet/Add, ParentMapSet/Add, RootMapSet/Add, TeamMapSet/Add and MapReset. Actor-owned Maps support case-insensitive Map expression reads, string values, numeric addition, root/parent/redirect ownership and reset to defaults. MapReset supports exclude and exclude2–8 as case-insensitive substring exclusions. Native string addition rejection warns without overwriting storage. Helpers receive separate map storage; extendsmap copies the spawning actor's maps when enabled.

Tests cover all nine controller names, all eight exclusions, defaults, redirected reset, nested helper ownership, strings, integer wrapping and fractional addition. Browser assertions verify P1/P2 isolation, Map expression reads and actual nested helpers; Saturn simultaneous-super regressions pass.

Pending certification: native typed expression promotion (including integral float values), all raw CNS assignment spellings, DEF map-default import and overrides, dynamic map-name compiler parity, team/simul/tag/neutral-character selection beyond the current Single teams, and serialization/save-state integration. Module team tests include two root teammates, but current WEB battles still have one root per team. No full Map family certification is claimed.

Inventory extraction now flags variable-built parameter names and explicitly includes MapReset exclude2–8; other dynamic parameters still require manual review.

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
