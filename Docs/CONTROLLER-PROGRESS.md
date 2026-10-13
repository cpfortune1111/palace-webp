## 0.24.74 — ScreenBound real camera/bounds flags

Caller value/movecamera/stagebound/redirectid now mutate root/helper flags. Controller default value/camera axes are false; omitted stagebound preserves its flag, while ordinary actor defaults restore player-type screen/camera and stage bounds. Signed Width edge offsets affect screen clamping independently from stage limits. Per-axis camera participant filtering reads established root coordinates and live helpers. Actual tests cover stage-only/full-unbounded/screen-only redirection, independent X/Y camera axes, root/normal-helper hitpause retention and reset. Complete native camera/zoom/standby/team/localcoord and player-helper matrix remain uncertified; partial integration only.

## 0.24.73 — Width controller execution

Caller edge/player/value/redirectid now write root/helper modifiers. Explicit edge/player use native compiler precedence over value; scalar second component defaults zero, and float32 scaling follows localcoord ratio. Root push/compensation consumes additive facing-aware player extents and normalizes reversed boxes; screen clamp consumes signed unnormalized edge offsets. Unpaused ordinary actor ticks reset modifiers, hitpause retains them. Actual root separation, redirected P2 margins, reset, helper redirection and hitpause/resume fixtures pass. Existing base push sizes are preserved; full native character boxes/helper collision/localcoord and reset timing/compiler/version certification remain pending.

## 0.24.72 — Family binding controllers

BindToRoot/BindToParent share caller time/facing/XYZ/redirectid evaluation and float32 redirection scaling. Root characters have no parent/root. Live nested-helper ownership distinguishes parent from root; facing zero/omission retains the binding direction, while clear/expiry resets it. Ordinary binds retain velocity, use their own actor's pause clock rather than binder pause and clear immediately at zero. Actual fixtures verify nested positions, facing, root-to-child redirection, hitpause/resume and expiry; unit tests cover native evaluation order. Complete native shared-bind identity/scales/physics/persistence timing and compiler/version certification remain pending.

## 0.24.71 — BindToTarget execution

Caller integer target/time parameters and float32 position/depth expressions are evaluated before target selection. Default index 0/time 1/X 0 and NaN Y/Z preserve unspecified axes. Head/mid/foot selectors use target constants; reciprocal native scaled TargetBind offsets share live binding lifecycle. Actual default/head/mid/redirection/mutual-reset and spawned helper target/isbound fixtures pass; helper target lists are manually registered, not collision acceptance tests. Unit tests cover redirected scales, posz, missing targets and localcoord correction. WEB still uses normalized localcoord 320 without complete native metadata; full scale/depth/helper trajectory and already-bound distance/compiler/version certification remain pending.

## 0.24.70 — TargetBind real-target execution

Caller ID/index/time/pos/redirectid now drive live target bindings, including native float32 redirected/cumulative target scaling. A separate map follows live owner IDs, synchronizes P1 reactions and world velocity, clears on round reset, supports zero/negative time and binder pause, prevents mutual binding and releases on TargetDrop. Finite missing/hit-binder root/helper release enters own 5050; helper state lookup can fall back to its own complete state definitions. GetHitVar(isbound) checks current incoming identity and preserves deferred-zero binding until update. Source throws now retain attacker ID/contact tick. Unit and actual root/helper/query/release/source-throw plumbing fixtures are present. Complete native timing/scales, buffered hit-ID parity and full character/helper trajectories remain uncertified; this is partial integration.

## 0.24.69 — ScoreAdd corrected execution

The legacy direct ScoreAdd branch ignored redirectid/NoScore and native accumulation precision; it has been replaced by shared controller dispatch using caller float32 value and integer redirection. Native ScoreAdd allows normal helpers, unlike target-controller player-type filtering. Actual P1/P2 redirected expression fixtures and spawned normal-helper root-score/NoScore fixtures are present. Unit tests verify precision, missing actors/value, exclusion and zero-addition. Full native teamside/lifecycle/queries and compiler/version certification remain pending.

## 0.24.68 — Target score execution

TargetScoreAdd evaluates caller float32 value and integer ID/index/redirectid against live target lists. Normal/projectile helpers are excluded; player helpers route to their root's score, with NoScore suppression. Native additions round current-round accumulations to float32 and transfer effective changes into existing match totals, preserving other game scoring. Unit tests cover precision, negative values, round/match resets and invalid/ineligible targets. Actual root fixtures verify redirected caller variables and NoScore; spawned helper fixtures manually register targets to verify eligibility/ownership, not collision acceptance. Full team ownership/score queries/lifecycle, invalid teamside and compiler/version certification remain pending.

## 0.24.67 — Target red-life resource execution

TargetRedLifeAdd evaluates caller value/absolute/id/index/redirectid against live target lists. Positive MUGEN-caller additions force absolute. Signed native computeDamage uses multiplier 1, victim defence and nonlethal/version bounds before red-life setter gates. Actual root writes, redirected P1 and NoRedLifeDamage fixtures pass; feature-disabled and round-protected paths have dedicated assertions. Unit tests cover missing/zero/unmatched owners, native signed additions, dead victim version rules and caller/victim compatibility distinction. Full helper/team life sharing, alive/final-defence/version ownership and compiler certification remain pending; no complete-controller claim.

## 0.24.66 — Target point resource execution

TargetDizzyPointsAdd/TargetGuardPointsAdd evaluate value, absolute, ID/index and redirectid in caller context, then mutate actual target resources. Native attack multiplier 1, defence scaling, positive minimum one, nonlethal life limits and integer saturation are retained. Dizzy and respective damage assertions exclude writes; feature switches and round no-damage gate protect point setters. Tests cover zero/missing/unmatched targets, fractional integer inputs and negative-zero normalization. Actual fixtures cover both root resources, exclusions, gates and redirected P1 variable evaluation. Full helper-victim/version/final-defence/compiler certification remains pending; no complete-controller certification is claimed.

## 0.24.65 — TargetPowerAdd resource execution

Caller-evaluated ID/index/value/redirectid select real target lists. Normal/projectile helpers are excluded; player helpers share their root power. Saturation, limits, zero-addition and post-round lock tests pass. PowerMax now retains original character ownership in custom states. Actual browser regression exited 0 on 2026-10-13. Team sharing/global maximum-power integration, native timing, helper collisions and compiler/version certification remain pending; no complete-controller claim.

## 0.24.64 — Persistent dizzy / guard-break flag controllers

DizzySet/GuardBreakSet execute caller value/redirectid through the shared dispatcher. Live root flag storage and helper fields back Dizzy/GuardBreak queries; changing source states preserves flags, independent resource feature switches do not suppress flag writes, and round initialization clears root flags. TargetLifeAdd reads live root dizzy rather than stale reaction data and skips dizzy-point damage accordingly. Pinned compiler mandatory-value validation now rejects omission without changing flags.

Policy and actual browser fixtures cover fractional/negative values, clear, root redirection, source-state persistence, feature independence, TargetLifeAdd exclusion and a spawned real helper's independent flags/query/clearing. Whole-file compiler validation, common dizzy/guard-break state transitions, full reset/system-flag lifecycle and version parity remain pending; no complete-controller certification is claimed.

## 0.24.63 — TargetLifeAdd actual resource writes

The shared dispatcher evaluates caller target/value/absolute/kill/dizzy/redlife/redirect parameters against real targets. Damage calculation ignores attack multipliers, adjusts defence unless absolute, rounds like native computeDamage, bounds to current life and applies nonlethal/version/overflow rules. Actual life and received-damage adapters are written, getHit.kill is retained, and enabled red-life/dizzy conversions use owner constants and incoming normal/hyper attributes. Positive-life round-damage gating and NoDizzyPointsDamage are respected. Hyper aggregate attributes mirror the pinned compiler's accepted masks.

Unit execution tests and actual-root browser fixtures verify damage/healing, high defence/absolute/nonlethal limits, defaults/overrides, normal/hyper resource reductions, disabled flags, attack multiplier 9 exclusion, and P1 life/reaction/received-damage synchronization. Existing complete combat/pixel/simultaneous-super regressions pass. Native alive/finalDefense/version ownership, dizzy lifecycle, helper victims, target buffers/IDs and full conversion parity remain pending; TargetLifeAdd is not fully certified.

## 0.24.62 — TargetState real-target and source-owner execution

The shared dispatcher evaluates caller integer id/index/value/redirectid, selects the redirected owner's target list, skips negative state numbers and removes control before switching source states. Current custom-state ownership determines root state owner; minus -2/-4 select its own character. Hit data and initial victim animation ownership are preserved. P1 reaction-state transfers synchronize root globals; general-state transfers release reaction storage and retain getHit data. The obsolete deduplicated legacy TargetState branch was removed.

Policy tests and actual browser fixtures cover ID/index selection, redirection, both roots entering 5050, control removal, hit-object and animation-owner retention, plus P1 returning through general source state 0. Complete existing combat/pixel/simultaneous-super regressions pass. Native queued per-actor timing, full helper/custom ownership and helper victims, validation and version parity remain pending; TargetState is not fully certified.

## 0.24.61 — Target velocity controller execution

TargetVelSet/Add run through the shared root/helper dispatcher with caller id/index/redirectid and float32 X/Y/Z values. Target selection uses the real registry; scaling preserves the pinned implementation's cumulative per-target conversion. Runtime X converts target-relative velocity into P2/helper/P1-reaction world velocity, while the non-reaction P1 root keeps relative storage; P1 reaction writes synchronize globals. Missing redirect actors exit before evaluating axis expressions. Unsupported actor depth is explicit, not silently ignored.

Policy tests cover axes omitted/empty, filtered index, caller expression order/redirection, differing target scales and Z arithmetic. Actual-root browser fixtures cover P2 set, redirected P1 add, and a facing -1 non-reaction P1 set/add ending at relative X -3, Y -4, world X +3. Full browser regressions pass. Live local-coordinate metadata, root depth simulation, helper-victim collision/ownership and full native version parity remain pending; these controllers are not fully certified.

## 0.24.60 — TargetFacing / indexed target selection

The shared root/helper dispatcher executes TargetFacing caller-context integer parameters id/index/value/redirectid. Native target selection filters current hit IDs, resolves the requested filtered index and stops once it is found. Zero values preserve facing; positive follows the redirected owner's facing and negative opposes it. Target updates preserve world horizontal velocity for helpers/P2 and both P1 reaction and non-reaction representations.

Policy tests cover selection/no-match/index bounds/early-stop, signs/zero and caller redirection. Actual browser fixtures force both victim roots to flip with world velocities 7/-9, then verify non-reaction P1 retains world speed 3. Existing counter/contact/pixel/simultaneous-super regressions remain required. Helper-victim collision/ownership, native target buffers, per-actor timing and full version parity remain pending; no complete-controller semantic certification is claimed.

## Controller inventory integrity repair — after 0.24.59

The saved controller JSON contained a truncated tool-output header and was not parseable. It was regenerated from the pinned native compiler without changing scope or certification. All 163 controller rows and their extracted/delegated parameter candidates are preserved. A saved-artifact test now requires valid JSON, matching pinned reference, 163 rows and 163 distinct controller names. All three inventory tests pass; semantic certification remains Pending for every controller.

## 0.24.59 — Target registry / NumTarget / TargetDrop execution

Unique per-root/helper target lists are written by real accepted root/helper/projectile-owner contacts and paired throws. NumTarget and NumTarget(hitID) query live victim IDs. Native swap-removal ordering drops recovered non-H targets with a current-contact exemption, round reset clears all lists and destroyed helper owners are removed. TargetDrop evaluates caller excludeid/keepone/redirectid, selects the actual redirected list, drops matching Snap/legacy throw bindings and supports the selection-drop newly-hit-owner SelfState path.

Tests cover actual root counts/ID filtering/pruning, matching/mismatching TargetDrop IDs, root redirection, helper target isolation and legacy throw-field release, plus existing simultaneous-super/combat regressions. Native CSF/stateChangeTmp/reversal tracking, target buffers, incoming GetHitVar ownership, multi-target random/release semantics and exact version parity remain incomplete. This controller has execution coverage, not complete semantic certification.

## 0.24.58 — Queued hit positions / temporal Snap

Caller float coordinates and integer snap time feed actual contact position plans. Root post-contact updates consume and clear xoff/yoff/zoff; queries expose queued offsets. Temporal binding follows live root/helper owner position and facing, handles pause/expiry, prevents mutual bindings and releases positive-time targets to their own 5050 when the binder disappears or is hit in the current frame. Dedicated root position, binding and both-direction release fixtures accompany existing regression tests. Native target buffers/CSF_gethit timing, local-coordinate scales, version layouts, helper/custom victims and full binding ownership remain pending; all three position parameters stay Partial.

## 0.24.57 — HitOnce root/helper activation lifecycle

Caller boolean hitonce values and throw defaults drive spent activation marking for accepted hits and guards. Root P1/P2 reject a spent activation independently of legacy per-target keys. Helper contacts do the same independently of hitSpent, and trigger/persistence execution creates fresh activations. Explicit-zero and projectile-budget contrast tests pass. Full browser regressions including simultaneous supers pass. Native target-drop/buffering, override/reversal and multi-target semantics remain pending; HitOnce remains Partial.

## 0.24.56 — Attacker contact facing / inherited-facing precedence

Root/helper hit paths now execute caller integer p1facing and p1getp2facing, with native precedence and projectile/guard exclusions. Effective facing feeds victim facing and horizontal received velocity; attacker world velocity remains unchanged. Browser fixtures cover both roots, inherited facing, helper and projectile contacts. Full guarded regression and publication are gated separately. Native deferred post-position timing, reversal/type-None and throw/custom owner interactions remain pending. No complete-controller certification is claimed.

## 0.24.55 — p2facing victim contact application

Contact results select p2facing sign behavior from pinned char.go: negative follows attack direction, positive faces the opposite direction, zero leaves facing unchanged and guarding excludes the change. Root P1/P2 plus entity-to-root victim paths apply the result after reaction entry while preserving world velocity.

Browser tests found and fixed a previously unwired P1 path. Both actual root contacts now verify caller-var signs and resulting facing; guarded fixtures verify negative p2facing does not turn either victim. Unit sign/guard/world-velocity cases and existing counter/combat regression remain required. Assertions were retained during the fix.

Still partial: native queued post-position timing, combined p1facing/p1getp2facing, reversal/type-None behavior, custom/throw/override owner semantics, helper victims and full version parity. p2facing remains audited Partial, not fully certified.

## HitDef p2facing contact application — local

Contact results now select defender facing from p2facing: positive faces opposite the attack direction, negative follows it, zero preserves current facing, and guarding does not apply this change. Actual root/entity victim state-entry paths apply it while preserving world X velocity. Native char.go queues facing until post-position update; WEB currently applies after reaction entry, so exact deferred timing, p1-facing combinations, throws/custom/override ownership and helper victims remain pending. Unit sign/guard/velocity cases pass; browser regression and publication remain pending. No complete facing certification is claimed.

## 0.24.54 — Fall recovery flags / eligibility / source clock

HitDef preparation evaluates fall.recover as a boolean and fall.recovertime as an integer; resolver stores native true/4 defaults. Actual CanRecover and GetHitVar fall fields read these values. Source falling hit reactions advance the clock outside their paused path.

Browser tests use a temporary source reaction controller to verify caller vars, paused clock, three-tick eligibility, actual ChangeState5200 and disabled recovery remaining in its source state. GetHitVar fall.time/recovertime reads are verified through expressions. Original commented Saturn recovery commands are not enabled. Unit and existing combat regressions remain required.

Still partial: separate native hitshake/hitpause flags and tick order, exact fall-time reset/preservation, legacy/helper lifecycle clocks, override/custom ownership, recovery-input semantics and all original-state transitions. Fields are audited Partial; the clock currently follows WEB source-reaction pause semantics rather than full native scheduling.

## Fall recovery metadata / source reaction clock — local

HitDef preparation now evaluates fall.recover and fall.recovertime; resolver stores native true/4 defaults and exposes CanRecover/GetHitVar fall fields. Source reaction stepping advances the fall clock during falling hit states outside its paused path. Unit cases cover threshold and pause predicates. WEB currently conflates some hitshake/hitpause clocks; exact native timer/reset/owner scheduling, all legacy/helper states, actual recovery-entry transitions, browser regression and publication remain pending. Original Saturn recovery triggers are commented out and are not silently enabled. This is partial recover eligibility execution, not complete recovery behavior.

## 0.24.53 — Down HitDef contact / source reaction execution

Down-state contacts select grounded down.velocity (air.velocity fallback), aerial down-state air velocity, down.hittime (20 fallback) and the corresponding control time. Grounded lying victims enter S5080 before trip routing; airborne lying victims enter S5020. down.bounce=false with nonzero grounded Y suppresses stored fall velocities, and lying actors are excluded from guard stance and additional KO velocity.

Browser tests execute S5080 followed by original S5081/S5030 controllers, observing actual X/Y movement and explicit hit/control metadata. They verify grounded versus airborne routing and bounce suppression metadata. Unit/default, guard and entity-contact checks pass; existing combat regression remains required.

Still partial: full down-hit offset/bounce animation/recovery, MUGEN extra-hit-time/version rules, Z/localcoord scale, custom/override/helper victim eligibility and native queued/reset semantics. Parameters remain audited Partial; prior local notes below describe staging.

## Down HitDef velocity/time/state routing — local

Down-state contact resolution now uses down.velocity with air.velocity fallback when grounded, air velocity when a lying actor is above ground, down.hittime default 20 for hit/control time, and S5080/S5020 routing before trip handling. Explicit down.bounce=false suppresses subsequent fall velocity when launched, following pinned char.go. Preparation evaluates caller expressions; nonzero Z fails explicitly. Lying actors no longer enter guard eligibility, and KO extra velocity skips L stance. Unit cases pass. Browser regression, native down offsets/recovery/default/ownership and publication remain pending; no complete down-hit certification is claimed.

## 0.24.52 — HitDef force-stance ordinary reaction execution

HitDef preparation evaluates forcestand/forcecrouch as caller booleans (including fractional nonzero values). Omitted forcestand defaults to ground Y velocity !=0; forcecrouch defaults false. Ordinary crouching/standing hit reaction selection uses the native initial-stance precedence while guarded, trip, aerial and custom-state branches retain their own priorities. Hit metadata stores flags.

Unit tests cover defaults, explicit flags, both flags, A/L stance preservation and boolean evaluation. Browser tests run actual contact resolution plus source reaction state entry, check S5000/S5010 and resulting S/C types, and verify guard/trip/air priority. Existing combat regression remains required.

Still partial: native pre-state mutation/CSF ordering, custom-state and override ownership, down-hit routing, helper victim paths, complete per-version defaults and source state/reset behavior. Both parameters are audited Partial, not fully certified; earlier local notes below are historical staging.

## HitDef force stance routing — local

HitDef forcestand/forcecrouch now evaluate in caller context at preparation; omitted forcestand follows native ground Y velocity !=0 default. Actual normal root reaction selection uses forced S/C stance while guard, aerial, trip and custom-state branches retain their existing precedence. GetHit metadata records the flags. Unit tests cover explicit/default flags, conflicting flags by initial stance and A/L exclusion. Browser regression, true pre-state type mutation, all custom/override/helper paths and publication remain pending; these parameters are not fully certified.

## 0.24.51 — Defender GetHitVar physical contact counts

Hit resolution records defender gethit hitcount and guardcount, and GetHitVar now exposes those actual stored values. Pinned char.go increments physical contacts once, distinct from source HitCount/GuardCount and numhits-based report totals. New hit chains restart after guarding; guard contact preserves prior gethit hitcount.

Unit tests cover hit/guard chains and transitions. Browser fixtures execute both actual root contact paths and read GetHitVar through expression evaluation: defender count 1 versus source/report numhits 3/4. Existing unguarded/guarded counter regressions are retained. Full combat regression remains required.

Still partial: native CSF_gethit/override/reversal eligibility, exact gethit clear timing, reaction/helper state reset paths, defender receivedHits, projectile-owner attribution and full counter certification. MoveType is an explicit approximation for native in-combo/reset flags, not a claim of complete parity.

## Defender GetHitVar contact counts — local

Contact resolution now records defender gethit hitcount/guardcount separately from attacker HitCount/GuardCount and numhits-based report totals. Pinned char.go increments physical gethit contacts once, starts a fresh hit chain after guarding, and preserves the prior hitcount on guard contacts. The resolver exposes both via GetHitVar. Unit cases cover idle, hit chains, guard chains and guard-to-hit transitions. The WEB idle approximation uses MoveType instead of native CSF_gethit/full reset scheduling; browser regression, receivedHits and publication remain pending. This is partial GetHitVar support, not complete native count certification.

## 0.24.50 — GuardCount guarded contact / query execution

Guarded P1/P2/helper/entity contacts now add evaluated numhits to source GuardCount, while ordinary hits retain HitCount behavior. Root expression context and helper query expose actor-local GuardCount. Ordinary root/helper state entry clears the new counter along the existing reset path.

Browser tests execute both actual root guarded contacts with caller counts 3/4, read GuardCount through expressions and verify HitCount/report totals remain zero. Original unguarded numhits tests remain in the same suite. Entity-runtime tests cover guarded-only counters and helper query reads; existing combat regression remains required.

Still partial: complete StateDef MoveHitPersist and reaction-entry reset behavior, defender receivedHits and GetHitVar guardcount, queued contact updates, projectile-owner attribution and full native count certification. Prior local notes below are historical staging descriptions.

## GuardCount contact writes / expression storage — local

Guarded root/helper/entity contacts now add evaluated numhits to actor GuardCount without incrementing HitCount. Root expression context and helper runtime query expose the stored count; ordinary root/helper state entry resets it along the existing counter path. Entity-runtime tests verify guarded-only accumulation and helper query reads. Actual root browser checks, MoveHitPersist/full reset rules, GetHitVar guardcount, receivedHits, projectile owner attribution and publication remain pending; no complete count semantic certification is claimed.

## 0.24.49 — Explicit numhits contact / report execution

HitDef/Projectile numeric preparation evaluates numhits in caller context as an integer. Actual P1/P2 hit paths, helper/projectile entity contact writers and report hit/combo totals consume that value, with native default 1 and zero/signed values preserved. The P2 frame-based writer uses its actual frame HitDef params.

Browser fixtures execute both root hit applications using caller vars 3/4 and verify root HitCount plus report totals [3,4]. Entity-runtime unit tests exercise helper/projectile contact writers with deterministic collision callbacks and guarded exclusion; report/count conversion tests pass. Existing combat/controller regression passes.

Still partial: native guardCount and defender receivedHits, queued contact timing, projectile-owner attribution, full combo/HUD/reset semantics and native integer overflow conversion. numhits is audited Partial, not fully certified. Historical local staging notes below are superseded by this batch upon verified publication.

## HitDef numhits contact execution — local

Explicit numhits now evaluates in caller context when creating HitDef/Projectile data, and actual root/helper/entity hit-count writes plus match-report hit/combo totals use that count rather than fixed +1. Native omitted value defaults to 1; zero and signed integer values are retained. Unit count conversion tests pass. Native guardCount/receivedHits counters, queued contact timing, projectile-owner counting, browser regression, score regression and publication remain pending; numhits is not certified complete.

## 0.24.48 — Projectile guard-distance snapshots / actual proximity

Projectile spawn creates independent guard vectors from imported size.proj.attack.dist front width (native 90 fallback), native Y/Z defaults and explicit guard.dist fields evaluated in the spawning caller context. Actual InGuardDist now includes active enemy projectile ranges. Owner AttackDist mutations and later variable changes do not overwrite the spawn snapshot.

Browser tests create actual projectiles, verify caller-var width, strict boundary rejection, preservation after owner AttackDist/var changes and imported default width. Temporary projectiles are removed to preserve later regression fixtures. Pure range and helper scheduling checks pass; existing combat regression remains required.

Still partial: platform/attribute eligibility, all projectile size pairs and localcoord scale imports, depth gameplay, current-animation ownership, complete projectile contact/pause/reset semantics and full controller certification. Earlier local notes below describe staging rather than complete support.

## Projectile guard-distance snapshot / proximity — local

Projectile creation now initializes independent guard-distance vectors using imported size.proj.attack.dist front width (native 90 fallback), native default height/depth and explicit guard.dist overrides evaluated in its spawning caller context. Vectors are not shared with later owner AttackDist mutations. Actual InGuardDist now includes active enemy projectiles. Unit tests verify native defaults, override rules and independent storage. Browser regression, complete projectile size/localscl/platform/attribute eligibility and publication remain pending; no complete projectile/guard certification is claimed.

## 0.24.47 — Helper shared guard-distance / proximity execution

Helper HitDef creation now evaluates guard.dist fields in helper context and stores the same vectors mutated by helper AttackDist. Ordinary helper entry clears guard storage unless hitdefpersist is set. Actual InGuardDist checks opposing root plus enemy helpers, and expression queries use the actual requesting actor rather than replacing helper/P1 reaction context with a root.

Browser tests run a real helper HitDef controller during permitted hitpause, verify caller-var width and shared reference, modify the helper via redirected AttackDist, and observe the actual defender's proximity result change at narrow/inside distances. Pure guard-distance and helper scheduling checks pass; existing combat regression remains required.

Still partial: projectile proximity/ownership, repeated helper HitDef activation, full helper size/scale and reset/persistence imports, team/platform/collision eligibility and actual Z gameplay. Earlier local notes below describe staging, not complete certification.

## Helper guard HitDef / proximity wiring — local

Helper HitDef creation now receives the same actor-owned guard vectors used by helper AttackDist, with guard.dist expressions evaluated in helper context. Ordinary helper state entry clears guard storage unless hitdefpersist applies. Actual InGuardDist queries now aggregate enemy helper proximity as well as the opposing root, and expression queries use the real querying actor instead of substituting its root. Unit mutation/query and helper scheduling checks pass. Actual helper/browser regression, repeated helper HitDef reactivation, all size/reset/ownership cases, projectile aggregation and publication remain pending; no complete helper/AttackDist certification is claimed.

## 0.24.46 — Shared root HitDef guard-distance execution

Root HitDef dispatch applies legacy guard.dist and guard.dist.width/height/depth into the actor's guard-distance vectors. New root HitDef objects retain the same reference AttackDist mutates, so live contact data and InGuardDist queries no longer diverge. Pinned compiler ordering and bytecode rules give width precedence, retain negative components and zero an omitted second component on supplied HitDef parameters.

Unit and browser tests verify reference identity, live AttackDist mutation, repeated HitDef preservation, negative retention, caller-var expressions, alias priority and actual strict query boundaries. Existing combat/controller regression remains required. Audit marks these fields Partial, not complete.

Still pending: helper/projectile equivalent shared ownership, imported custom sizes and localscl/defaults, all HitDef/state reset/persistence paths, native integer edge conversion and collision proximity aggregation. Prior local notes below describe staging and are superseded by this batch upon verified publication.

## HitDef guard-distance precedence / shared root storage — local

Root HitDef dispatch now applies guard.dist, guard.dist.width/height/depth into the same storage AttackDist modifies; created root HitDef objects share that vector reference. Pinned compiler ordering gives width precedence over the legacy alias. Negative values preserve old components, and a supplied scalar resets the omitted second component to zero, unlike AttackDist. Unit tests cover these distinctions and reference preservation. Real browser validation, helper/projectile paths, default/reset coverage and publication remain pending; no full guard-distance certification is claimed.

## 0.24.45 — AttackDist root query integration

AttackDist value/width/height/depth/redirectid now reach the real dispatcher and actor-owned guard HitDef storage. Root InGuardDist uses these vectors, strict comparisons and native same-plane Y/Z safeguards. Default height/depth use pinned CharSize defaults [1000,1000]/[4,4], replacing temporary infinite staging ranges. Ordinary root state entry clears storage unless its definition has hitdefpersist.

Unit tests verify mutation order, omitted components, redirected scale, nonnegative clamping and query boundaries. Browser fixtures verify actual root proximity changes, height boundaries, root redirects and helper-owned scaled writes. Existing controller/combat regression remains required.

Still partial: full live HitDef shared ownership, HitDef guard.dist precedence, imported/custom size defaults and localcoord scale, all reaction/helper state-entry/reset paths, hitdefpersist exporter coverage, helper/projectile proximity aggregation and Z gameplay. No complete AttackDist or parameter certification is claimed. Earlier local staging notes below remain historical and are superseded by this verified batch.

## AttackDist root guard-distance execution — local

The controller dispatcher now routes AttackDist into root/helper guard HitDef storage, and actual root InGuardDist queries read the modified vectors with native strict X/Y/Z comparisons and same-plane safeguards. Ordinary root state entry resets storage unless hitdefpersist is set. Unit tests cover query boundaries and facing. Full live-HitDef mutation/reset ownership, imported default Y/Z sizes, helper/projectile proximity aggregation, all state-entry paths, Z gameplay and browser regression remain pending; this is partial root execution, not complete AttackDist certification. Publication remains pending.

## AttackDist native mutation module — local staging

Pinned compiler/bytecode sources establish value then width ordering, optional second components, caller-context float evaluation, redirected local-scale ratio and nonnegative clamping into the target HitDef's guard-distance vectors. A new mutation module and tests cover these semantics for all three axes. This module is not yet wired into real root/helper HitDef ownership, reset/persistence and collision guard-distance queries, so AttackDist is NOT counted as runtime implemented. Browser regression and publication remain pending.

## 0.24.44 — StateTypeSet parameter validation

StateTypeSet now validates all requested type/movetype/physics literals before writing any fields. Previously an invalid later parameter could leave earlier state fields modified. Pinned compiler-functions.go rejects invalid literals before producing an executable controller. Unit tests verify invalid physics, movement type and empty physics preserve all original actor fields. Browser tests verify both root actors and a redirected helper retain every original field when a later parameter is invalid. Existing combat regression remains required. Native upfront whole-file validation remains pending; this does not certify complete controller behavior.

## 0.24.43 — DefenceMulSet compiler-literal parity

Pinned compiler-functions.go compiles multype using Atoi on literal text and accepts only 0/1. Its generated bytecode evaluates the already-compiled constant; this is not permission to evaluate source expressions or accept arbitrary integers. The earlier unpublished local experiment based only on bytecode.go was replaced before publication.

The WEB module now matches common.go's numeric-prefix parsing and signed overflow saturation, then applies compiler validation. Variable-looking text compiles as zero instead of reading actor vars; numeric-prefix text follows native Atoi behavior. Invalid values fail without modifying defense. Unit/browser tests cover prefix parsing, vars, positive/negative overflow, defaults and redirected root targets. Existing combat regression remains required.

Still partial: compile-time validation before target lookup, native state-owner version selection, complete finalDefense composition, expression conversion edge cases and controller certification remain pending.

## 0.24.42 — Version metadata execution and guard defaults

Four imported character bundles receive compatibility and engineVersions from their original definition snapshots. Existing bundle fields are verified semantically unchanged before writing the metadata-only patch; no raw original assets are included. The actual LifeAdd and DefenceMulSet adapters now select caller version metadata rather than hardcoded MUGEN, alongside the guard hit-time selection introduced locally. Current imported originals all specify MUGEN 1.0.

Tests cover pinned version parsing, invalid/partial versions, guard inherited depth rejection and actual browser default differences: MUGEN delayed reciprocal defense/healing absolute versus Ikemen immediate direct defense/defense-scaled healing, and guard ground.slidetime versus ground.hittime fallback. Existing combat regression remains required.

Still partial: legacy Venus metadata, all version-dependent behaviors, state-owner version in custom states/redirected execution, full expression/version queries, Z execution and native controller certification. Earlier local exporter/guard notes below describe their staging history; this batch supersedes their pending-bundle status once deployment is verified.

## Character compatibility metadata — exporter wiring

All four imported-character runtime builders now read original definition Info version fields and attach compatibility/engineVersions metadata. Parsing follows pinned common.go ParseMugenVersion/ParseIkemenVersion and compiler.go's Ikemen major/minor activation plus MUGEN 1.1 safeguard. Invalid/out-of-range components, partial Ikemen versions and patch-only versions are tested. Original definition paths are confined to the import snapshot.

The existing guard resolver reads this metadata. Updated runtime bundle regeneration, browser regression and publication of this local batch remain pending; current production remains 0.24.41. No native version-dependent controller certification is claimed.

## Guard defaults — version selection and inherited depth

Guard contact parameter defaults now distinguish pinned native MUGEN ground.slidetime versus Ikemen ground.hittime fallback. The actual resolver reads the attacker's optional battle.compatibility metadata, defaulting existing imports to MUGEN. Explicit guard.hittime still takes precedence. Inherited ground velocity Z is now rejected explicitly instead of being dropped when guard.velocity is omitted.

Unit tests verify both default branches, explicit precedence and inherited unsupported depth. Native version metadata extraction into all character exporters, Z execution and full browser/regression/publication verification of this local change remain pending. This is not full guard parameter certification.

## 0.24.41 — Red-life / point controller damage-window parity

Red-life and dizzy/guard point controller adapters now share roundFlow.noDamage with LifeAdd/LifeSet, following pinned char.go setters and system.go roundNoDamage. Their previous RoundState!=2 gate incorrectly rejected intro and late post-round writes. Explicit HitDef red-life and point consumption also use the real window instead of the broad state test.

Browser fixtures verify all three resources can be assigned during RoundState 1, remain unchanged for protected Add operations during state 3, and resume Add afterward while still in state 3. Existing root/helper tests now explicitly supply the damage-window gate rather than treating an arbitrary RoundState as protection. Unit round-window boundaries, resource controllers and full combat regression remain required.

Still partial: full native intro timer/freeze ordering, separate alive status, queued HitDef resource consumption, defaults, team sharing, automatic recovery and full controller certification remain pending. This fixes the resource gate adapters without claiming those missing semantics.

## 0.24.40 — Native post-round damage window / life controller adapter

Pinned system.go roundNoDamage checks a specific negative-intro interval: intro < 0, intro <= -over_hittime and intro >= -over_waittime. It does not simply reject all RoundState values outside 2. Round flow now keeps postRoundAge across result, resultBuffer and later presentation phases, resets it at new rounds, and exposes the inclusive native damage window. fight.def over.hittime=10 is imported into round configuration and its exporter.

LifeAdd/LifeSet actual root/helper resource dispatch now supplies this gate; prior module-only tests did not prove the adapter was wired. Living targets retain HP and red life during the protected interval, while dead-target writes remain allowed by the existing module contract. Tests cover exact entry/exit boundaries, uninterrupted clock through phase changes, new-round reset, pre-fight permission and actual root/helper adapter writes. Existing announcer and combat/resource regression remains required.

Still pending: native alive-state is separate from life>0, broader round intro timer/version modeling, score/win-type side effects, HitDef queued life consumption, and replacement of existing red-life/point-controller RoundState-based gates. This is an explicit adapter fix, not complete resource/round certification.

Reference: https://github.com/ikemen-engine/Ikemen-GO/blob/cb56d73badb322f3725257c2e8cfd157b2c3989d/src/system.go (roundNoDamage), pinned char.go lifeSet.

## 0.24.39 — KO reaction / cornerpush actor assertions

NoKOFall and NoKOVelocity join the actual actor assertion dispatcher, enabled/redirected multi-flag handling and IsAsserted. HitDef's lethal unguarded contact now respects each flag independently: NoKOFall skips forced KO fall/animation selection while preserving original fall; NoKOVelocity skips profile-added KO velocity. Neither flag suppresses HP damage or already-present HitDef velocity. This follows pinned char.go's separate checks at the KO reaction block.

NoCornerPush now gates actual P1 and P2 cornerpush displacement, not the stored MoveHitVar-like velocity. Friction/decay and storage persist while the flag is asserted, matching pinned char.go's explicit distinction. Disabling restores displacement using the decayed value.

Unit tests cover redirected/mixed flags and explicit disabling. Browser fixtures check baseline versus each KO flag, combined flags, aerial contact, HP remaining zero and restored KO additions; cornerpush fixtures check both actual roots, retained/decayed velocities and resumption. Existing combat/resource/drawing/guard regression remains required.

Still partial: NoKO/NoGuardKO/global flags require proper alive-state separation and are not substituted with a fake HP floor. Complete native hit/KO animation selection, per-character kovelocity/default import, tick/round assertion lifetime, helper cornerpush, system-triggered non-contact KO handling and full native corner conditions remain pending. No complete AssertSpecial or KO semantic certification is claimed. The guard.kill audit also corrects an earlier interpretation: pinned native code intentionally switches lethal chip to hit reaction when no survival assertion applies.

## 0.24.38 — Aerial guard contact / source reaction execution

Imported character guardflag A contacts now route to original state 154 and execute the character's original state 155 controllers, including HitVelSet, gravity, CtrlSet and grounded transitions. The reaction dispatcher and hitpause controller paths recognize these source states in both player slots. Explicit airguard.velocity/airguard.ctrltime expressions are evaluated at HitDef creation. XY velocities, native 1.5x/0.5x aerial fallback, guard hit/slide time and aerial control time feed GetHitVar; airguard cornerpush parameters reach actual contact results. NoAirGuard joins actor-local assertions and IsAsserted. Nonzero Z velocity fails explicitly.

Unit tests cover stance isolation, source UnGuardable, NoAirGuard and default/explicit parameters. Browser tests execute both player-slot reaction paths through shake completion, original A152/HitVelSet, CtrlSet recovery and S52 landing, checking independent cornerpush values. Existing Saturn simultaneous supers and controller/resource/drawing regressions remain required.

Still partial: legacy Venus lacks imported S154/S155 and A152, so its pre-existing hit behavior is preserved rather than inventing guard animation/state data. Full SCF_guard/default-key ordering, aerial proactive guard animation, command eligibility after CtrlSet, native MUGEN/Ikemen default selection, helper collisions and Z are pending. No complete guarding/AssertSpecial certification is claimed.

## Parameter inventory — delegated compiler contexts

The inventory now inspects compiler helpers from both pinned compiler source files, preserves each delegated prefix context, and expands literal prefix concatenations. Explod/Projectile palfx.* and afterimage.* parameters, standalone PalFX fields and delegated trans/alpha fields are no longer omitted by the extractor. Inspected function/prefix contexts are recorded in JSON. Unresolved arbitrary dynamic names remain explicitly pending.

Synthetic tests verify multiple prefixes, nested delegation and unresolved names; pinned-source tests verify 163 controllers and representative previously omitted fields. This changes the inventory only, not runtime support. All semantic certifications remain pending; complete MUGEN/Ikemen compatibility has not been achieved.

## 0.24.37 — Guard stance / UnGuardable assertions

NoStandGuard, NoCrouchGuard and UnGuardable now join the actor assertion dispatcher. Ground HitDef resolution checks the defender's current S/C stance assertion, including existing guard-state paths. It also rejects guarding when the attacker asserts UnGuardable. Helper attacks forward their own assertion set; projectile attacks resolve their live root/helper owner assertion set instead of copying spawn-time flags, matching pinned char.go's source-character check and projectile comment.

Unit checks verify these three additional mixed/redirected flags. Browser checks verify stand/crouch isolation, helper-local source ownership, root unguardable attacks, actual projectile creation with owner assertions changed after spawn, enabled=0 re-enabling guard, and IsAsserted on helper storage. Existing Saturn simultaneous-super regression remains required. The HitDef guardflag audit describes the expanded ground path without certifying full guarding.

Still partial: native SCF_guard/default-input scheduling, forced debug guard modes versus native stance transitions, aerial guarding/NoAirGuard, auto-guard, reversals/HitOverride guardflag interactions, destroyed projectile-owner lifetimes, full helper key-control/collision semantics and other assertions remain pending. Unknown mixtures outside the ten implemented flag names fail explicitly. No full AssertSpecial/guard certification is claimed.

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

