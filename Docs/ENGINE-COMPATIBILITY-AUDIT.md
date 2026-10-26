# Full engine compatibility: initial audit and proposed milestones

This audit responds to the user-provided `goal-objective.md`. The objective now covers the complete documented engine, not only controller integration. This is an initial source/evidence audit of all ten required subsystems, not a completed item-by-item certification. The machine-readable companion is [ENGINE-COMPATIBILITY-COVERAGE.json](ENGINE-COMPATIBILITY-COVERAGE.json).

## Audited baseline to preserve

- Verified game-runtime checkpoint: **0.26.21**, commit `fae96af0f47fc634a21869f8da26df22927fe6e4`; its private receipt records successful exact-head Pages deployment and ten live text comparisons. Subsequent M0 audit commits preserve that runtime.
- Existing engine directory: 268 JavaScript modules. There are 301 `check-*.mjs` scripts; the latest existing controller-work log reports PASS 301. Counts indicate substantial reusable work, not engine completeness.
- The existing real-character/browser/battle fixtures and converted sprite/audio pipeline remain the integration baseline. Do not restart the engine or duplicate these consumers.
- The last controller release passed 96 additional own-state/HitOverride/binding/TargetDrop/destruction browser cases, related browser gates, 301 Node checks and final full battle regression. This verifies the described subset; it does not certify the full engine.

## References and inventory quality

IKEMEN GO is pinned to `cb56d73badb322f3725257c2e8cfd157b2c3989d`. `CONTROLLER-AUDIT.json` enumerates 163 compiler-registry controller candidates. That inventory has parameter candidates and source-function inspection; it is **not** 163 completed controllers and does not provide a complete separate MUGEN/extension classification.

The repository audit tool names the MUGEN 1.1 beta1 controller reference at `https://www.elecbyte.com/mugendocs-11b1/sctrls.html`. The private cached controller page has SHA-256 `16e143ce3f7b61be0de8a3056d03495c916dd83c76d7ef339a6c70e54877b332`. M0 subsequently pinned 31 original text documents preserved in a community mirror at commit `5ed02054fe5e80c24259b9da1f7d129b995676c9`. The mirrored controller page matches that official-site snapshot after CRLF normalization. [ENGINE-REFERENCE-BASELINE.json](ENGINE-REFERENCE-BASELINE.json) records per-file Git blob/SHA-256 hashes, exact source commits and provenance qualifications without redistributing original documents. Binary documentation diagrams are not included; per-item semantic verification remains incomplete.

The pinned trigger reference yields 127 sections and 132 independently tracked names/variants, all found in the 279-name Ikemen registry. Nine format references and five suffix variants are retained. Compiler comments do not define the official MUGEN boundary: eleven names in its Mugen group are outside this trigger reference and remain to be classified. Selector lists for Const/GetHitVar/StageVar and inconsistencies between document formats, argument lists and details remain visible. CNS syntax inventories now include operators, intervals, redirection forms, StateDef fields and special State numbers; none of these inventory counts certify execution.

Existing ledgers use incompatible status vocabularies. For example, the legacy HitDef JSON contains 53 `Not implemented`, 46 `Partial` and 32 `Implemented` labels, while later modules and regression logs evidence additional work. These counts must be reconciled before use as present-day progress figures. The state-controller and animation parameter inventories explicitly retain Partial statuses. No whole-engine percentage is justified by the current evidence.

The new inventory records **Parsed**, **Executable**, **Source-verified**, **Semantically tested** separately, plus **Partial / Unsupported** gaps. Current subsystem assessments are Partial: a passing selected consumer never certifies every field or interaction in its subsystem.

## Subsystem audit

| Required subsystem | Existing executable foundation | Material gap / next verification | Assessment |
|---|---|---|---|
| Controllers and parameters | Registry audit; modular consumers; state/animation parameter ledgers; root/Helper and battle fixtures | Separate MUGEN/Ikemen item inventory; stale-label reconciliation; every default, side effect, warning, evaluation order and runtime dependency | Partial |
| Triggers and expressions | `index.html` tokenizer/AST/evaluator; numeric-type, bitwise, exponent, redirect and selected query tests | Complete trigger/function/operator inventory; generic compiler/type/short-circuit/conversion/redirect matrices and native comparisons | Partial |
| State machine | StateDef modules, schedule counters, pending-state buffer, negative bodies, provider identity and pause tests | Capacity/reallocation/nested aliases; all common/current/negative/global/disabled phases; source-defined behavior without character-specific branches | Partial |
| CMD | Runtime command matcher with signed hold/release history, facing, timing, buffers and simultaneous step structures; AssertCommand/SOCD support | Complete grammar/default/input interaction inventory and generic source reader; full matcher/native timing traces. The Saturn builder still rejects unsupported command tokens | Partial |
| AIR | Converted actions and collisions; frame/loop/prefix/provider/transparency consumers and browser rendering tests | Generic browser AIR parsing; every flag, duration, offset, box and animation-trigger interaction across versions | Partial |
| Physics, stage and camera | Motion, friction, collision geometry, player push, depth/camera and stage-background modules | Uniform native coordinate/float/order behavior and generic stage definitions. `prepareStage` explicitly accepts only the current training/moon stages | Partial |
| Combat and rounds | HitDef/Reversal/GetHit/juggle/resource/throw/KO/round modules and extensive actual battle regression | Complete reconciled parameter/default and guard/fall/juggle/throw/KO/round interaction matrices, including native executable traces | Partial |
| Entities and effects | Helper/projectile runtime, Explod modules, ownership, targets, collision and destruction consumers | Full generic effects and spawning; all recursive/destruction/retention/pause/redirect interactions. Exact accepted-pattern Explod guards remain in the runtime | Partial |
| DEF/CNS/ST/ZSS/CMD/AIR/SFF/SND assets | Python source inspection/import/build tools; converted JSON/atlas/audio manifests; real decoded sound loader and native playback modules | Generic browser source-package/VFS loader and complete original format readers. Offline inspected SFF v2 and decoded PCM support do not equal general SFF/SND container runtime support. Complete ZSS ingestion is not evidenced | Partial; major unsupported paths |
| Runtime and determinism | Live tick loop, pauses, actor clocks, seeded native-random module, combat traces and regression infrastructure | One specified phase order, deterministic replay/snapshots and pinned native oracle. Gameplay `Math.random` calls remain; a seeded helper alone does not make the whole engine deterministic | Partial |

## Proposed dependency-aware implementation order

Complexity is relative engineering scope, not a calendar estimate. XL means several interacting engine layers. Risk refers to regressions in the existing game. Each milestone must reuse current modules and adapters; source-specific branches are removed only after a generic consumer proves the same source-defined behavior.

| Milestone | Dependencies | Scope and exit condition | Complexity | Regression risk |
|---|---|---|---|---|
| **M0 — References and evidence inventory** | None | Pin complete official documentation sets; separate MUGEN vs Ikemen extensions; enumerate triggers/CMD/AIR/formats/runtime items; reconcile stale labels; attach stage-specific evidence and preserve the current release baseline | L | Low runtime risk |
| **M1 — Deterministic kernel and native trace harness** | M0 | Specify phase order and seeded input/RNG clocks; replay/snapshot hashes; validate a pinned native executable/harness or explicitly retain its evidence gap. Existing game and source fixtures remain green | XL | Very high |
| **M2 — Generic source frontend and expression VM** | M0, M1 | DEF/CNS/ST/ZSS frontend and normalized IR; full expression typing/conversion/redirect/evaluation semantics; feed existing consumers rather than create another character engine | XL | Very high |
| **M3 — State machine and CMD** | M1, M2 | Complete StateDef/common/negative transitions and native counter/pause ordering; complete command syntax, held/released/simultaneous/facing/buffering behavior with trace comparisons | XL | Very high |
| **M4 — Asset readers and animation** | M2; may proceed alongside M3 | Local/private source packages resolve DEF dependencies and real CMD/AIR/SFF/SND resources; complete frame/collision/flag/audio tests. Preserve converted assets as a supported cache/presentation adapter | XL | High |
| **M5 — Physics, stage and camera** | M1, M3, M4 | Versioned float/coordinate/facing/gravity/friction/collision/push/stage/camera conformance, retaining the current presentation and controls | XL | Very high |
| **M6 — Combat, entities and remaining controllers** | M3, M4, M5 | Close the existing inventories and runtime dependencies; complete guard/hit/fall/juggle/throw/KO/round and Helper/projectile/Explod/target/destruction interactions | XL | Very high |
| **M7 — Full conformance and verified release** | M0–M6 | Every documented item has executable, source and semantic evidence; unsupported/no-op paths prevent certification. Verify original-character integration, CI, deployed build and live source matches | L–XL | High |

M0 starts with the existing controller/state work, not a blank project. M1 establishes the cross-subsystem oracle before broad replacements. M4 can run alongside M3 after the frontend contract is stable. M5 precedes final combat certification because collision, timing and stage coordinates affect damage/guard/throws. M6 closes existing gaps rather than treating newly parsed syntax as implemented.

## Test and certification contract

1. Every item gets separate parsing, executable-consumer, pinned-source and semantic-test evidence, with compatibility version and known gaps.
2. Use synthetic/publicly distributable fixtures for published tests and existing original character sources privately for integration. Do not upload original ROM/SFF/SND or other source assets.
3. Native differential tests compare tick snapshots, state/animation/input/velocity/contact/resource/event order and appropriate float behavior. Screenshots and structural inventories are complementary evidence, not substitutes.
4. Keep the current browser/battle regression gates. Broaden after changed behavior or failures; do not repeat passed expensive gates without cause.
5. A complete subsystem must satisfy its whole documented item list and cross-subsystem dependencies. No ignored parameter, empty controller or hardcoded character workaround counts as completion.
6. The earlier Moon Palace character-recoloring exclusion must remain explicit in the scope ledger. Required asset palette decoding is separate; resolve any generic-engine controller exception before a full-compatibility claim rather than silently omitting it.

## Approval boundary

The objective file explicitly states: **“Before starting large new subsystems, report the audit results and proposed implementation order for approval.”**

The human user approved the M0–M7 order on 2026-10-26: begin M0 then M1 and continue through the approved order without restarting existing work. The approval boundary is satisfied. M0 input-inventory reconciliation has started; see `ENGINE-M0-PROGRESS.md`. No new parser, asset loader, VM or kernel replacement has yet been started. Existing controller fixes were published and live-verified in 0.26.21; the overall compatibility objective remains unfinished.
