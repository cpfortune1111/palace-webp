# Engine inventory reconciliation — M0

## 0.26.26 existing-runtime trace prerequisite for M1

`Tools/check-runtime-trace-repeatability.cjs` runs the actual Moon/Venus source paths in three fresh browser contexts. It resets the existing native RNG, intercepts legacy Math.random only during fixture-driven simulation, scripts S1000/S3000 entries and held inputs, then captures 360 real ticks per context with one actual camera update per tick. Root/GetHit/entity/effect/round/pause fields and observed function phases are canonicalized with explicit undefined/nonfinite/negative-zero tokens. Failed comparisons retain the first chronological difference. Requested code/JSON/HTML inputs are fingerprinted and must stay unchanged across the trials.

The first complete simulation exposed a real Venus player-push schema error: body dimensions are in legacy sizeConstants, but the lookup indexed absent constants. The owning-character fallback now accepts either existing table without changing width math or source-State ownership. With the repair, seed 17/17 traces match exactly and seed 29 differs; five entities spawn, P2 reaches 880 HP, 1,823 legacy random samples are exercised and 332 source inputs remain stable. [RUNTIME-TRACE-EVIDENCE.json](RUNTIME-TRACE-EVIDENCE.json) records digests, environment, phase examples and scope.

This is a real-consumer verification prerequisite within the continuing audit, not a completed M1 kernel: production Math.random calls, full native phase ordering, full-state save/load, physical input replay, all actors/versions and GPU presentation remain incomplete. The native component reference and current Web call markers remain distinct. No large scheduler replacement is claimed.

```text
node Tools/check-runtime-trace-repeatability.cjs ../outputs/release-02626-repeatability-results.json
```

Each tick now gets an independent deep plain-data snapshot before later updates can mutate nested pause/GetHit values. Unsupported object prototypes/types and cycles fail explicitly; in-page alias/rejection assertions protect this contract. The frozen driver SHA joins the loaded-source fingerprints, and a failed/unfinished run cannot leave a stale passed report. All 301 Node checks, complete battle regression and the final immutable-snapshot three-context trace gate passed. Raw detailed traces/source fingerprints remain private. The initial bad fixture setup was corrected to use specialRoot(2) storage initialization before filling variables; the subsequent player-push failure was a production data-binding bug and was fixed in the actual runtime.

## AIR original-frame metadata and explicit export gaps

[AIR-FRAME-EVIDENCE.json](AIR-FRAME-EVIDENCE.json) records 29 synthetic frame probes and all 10,501 frame rows from five private original AIR files against the pinned compiled ReadAnimFrame component. Required fields, H/V offset handling, repeated flips and float32 scale/angle metadata match independent fixtures. Ignored starts and malformed metadata diagnostics remain distinct from full-file parser policy. No raw AIR text is published.

The private five-file baseline contains no per-element scale/angle fields and no interpolation directives. Current runtime-facing exporters only emit seven fields; both now explicitly reject nonidentity per-frame transforms and interpolation for selected actions. This prevents silent data loss while real native renderer/animation support remains unfinished. Omitted/identity fields retain the current renderer contract. The four policy checks and all 10,501 existing frame records pass unchanged through both exporters. This is a temporary explicit Unsupported policy, not a substitute for required AIR implementation.

The new private oracle adds a frame metadata mode without changing the 13 extracted native declarations. Alpha's 8,707 cases, synthetic SFF's 2,460 cases, scanner's four checks and pinned AIR/CMD inventory pass against the expanded tooling. The earlier original-SFF sample receipt remains separate; no new physical sprite sample claim is made by this frame follow-up.

```text
python Tools/build-native-component-oracle.py --image ../outputs/ikemen-image.go --anim ../outputs/ikemen-anim.go --common ../outputs/ikemen-common-pinned.go --go ../outputs/toolchains/go1.27.3/go/bin/go.exe --output ../outputs/native-frame-component-oracle
python Tools/check-air-frame-native.py --receipt ../outputs/native-frame-component-oracle/build-receipt.json --output ../outputs/air-frame-native-results.json --character-air ../outputs/moon/original/moon.air --character-air ../outputs/venus/original/venus.air --character-air ../outputs/jupiter/original/jupiter.air --character-air ../outputs/neptune/original/neptune.air --character-air ../outputs/saturn/original/saturn.air
python Tools/check-air-export-policy.py --character-air ../outputs/moon/original/moon.air --character-air ../outputs/venus/original/venus.air --character-air ../outputs/jupiter/original/jupiter.air --character-air ../outputs/neptune/original/neptune.air --character-air ../outputs/saturn/original/saturn.air --output ../outputs/air-export-policy-results.json
```

Full AIR field execution, original package/frontend handling, interpolation, collision/timing/render/native scheduling and M0/full-engine conformance remain incomplete. Game runtime stays 0.26.25; this follow-up changes offline tooling/diagnostics and evidence only.

## 0.26.25 StateDef full header reconciliation and persistence/cost correction

[STATEDEF-COVERAGE.json](STATEDEF-COVERAGE.json) records all 13 MUGEN CNS header fields and all 13 pinned compiler fields, including the internal moveType spelling. The checker verifies pinned compiler/bytecode/CNS bytes, compiler parameter order, header bytecode case order and every listed consumer/test. Entry type/move/physics defaults, U retention, native outer initialization and CNS-ignore/ZSS-reject negative-header behavior are explicit source observations, with generic frontend execution still pending.

Further review found Number coercion in hitcountpersist/movehitpersist/hitdefpersist/juggle. Shared typed converters now map evaluated strings and undefined/NaN to false/zero. The new flag assertion reproduced all three incorrectly retained flags before the fix. Focused tests preserve evaluation/reset order and actual Helper entry behavior; real root/reaction reset fixtures now use quoted numeric-string flags. All 301 Node checks, the complete battle regression and pinned StateDef inventory check passed. All 13 fields remain Partial, none Certified. Full StateDef transition/provider/negative/global/pause/default/version behavior remains unfinished.

```text
python Tools/check-statedef-coverage.py --compiler ../outputs/ikemen-compiler.go --bytecode ../outputs/ikemen-bytecode.go --cns ../outputs/mugen-reference-11b1/docs/cns.html
```

## 0.26.24 StateDef existing-consumer type correction

StateDef source review verified compiler Boolean/integer types and BytecodeValue.ToB/ToI string/undefined handling against the pinned upstream bytecode blob. The existing scalar/facing consumers used Number coercion and incorrectly enabled ctrl from NaN/undefined or consumed numeric strings as numbers. Shared typed converters now handle ctrl/facep2/sprpriority/poweradd. The new assertion failed before the fix; all 301 Node checks pass. Actual P1/P2/Helper entry fixtures evaluate quoted string expressions through the real source path and verify ctrl/priority zero, unchanged Power and unchanged facing. [STATEDEF-TYPED-VALUES.md](STATEDEF-TYPED-VALUES.md) records Partial evidence and remaining generic frontend/phase work. Full M0/engine compatibility remains unfinished.

## 0.26.23 existing-consumer correction during combat review

The remaining combat review found a signed-addition bug in ReversalDef pause consumption: 2147483647 plus the native version fix was kept as a JavaScript positive number, instead of int32 wrapping before the minimum-one clamp. The new assertion failed against the old implementation, then the fixed consumer passed 36 independent BigInt boundary/version combinations and all 301 Node checks. Actual browser fixtures exercise legacy/MUGEN/Ikemen profiles through `applyReversalHitPauseM1` and both Helper counters. [REVERSAL-HITPAUSE-OVERFLOW.md](REVERSAL-HITPAUSE-OVERFLOW.md) records Partial evidence and remaining scope. The HitDef name/evidence snapshot remains unchanged; this correction belongs to the independent ReversalDef consumer.

## HitDef legacy/current evidence reconciliation

[HITDEF-COVERAGE.json](HITDEF-COVERAGE.json) reconciles the 131-name HitDef union (81 MUGEN document names, 131 pinned compiler candidates) with current reviewed groups and the incremental parameter ledger. Every item has separate Parsed/Executable/Source-verified/Semantically tested records. **38 are Partial, 93 Unassessed, zero Certified**. Unassessed means that complete current evidence reconciliation is pending, not that the engine has no execution path. Old Implemented labels are not promoted to certification.

Thirteen historical Not implemented labels have current evidence, including affectteam/teamside, chain/depth filters, down cornerpush, X/Z acceleration, friction and independent keepstate. Current velocity-default/depth support also supersedes the old 2D-only limitation wording. The old audit JSON remains a hashed historical input; its Markdown is clearly marked historical. Its legacy generator now defaults to private output instead of overwriting public current evidence.

Reviewed evidence groups retain consumer/test/document paths, observations and pending work. ReversalDef rows remain separate: ReversalDef.missonoverride evidence does not imply HitDef.missonoverride coverage. The fresh seven focused checks pass (velocity defaults, guard contact, acceleration, friction, teams, keepstate and incremental evidence integrity). These do not replace native full-contact/actor/version certification or the earlier browser evidence.

```text
python Tools/reconcile-hitdef-coverage.py --mugen-document ../outputs/mugen-sctrls.html --registry ../outputs/ikemen-compiler.go --compiler ../outputs/ikemen-compiler-functions.go --output ../outputs/hitdef-coverage-reconciled.json
python Tools/check-hitdef-coverage.py --mugen-document ../outputs/mugen-sctrls.html --registry ../outputs/ikemen-compiler.go --compiler ../outputs/ikemen-compiler-functions.go
```

The published record is reproducible from pinned inputs and authored evidence. Runtime remains 0.26.22; complete combat/engine compatibility and M0 item reconciliation remain unfinished.

## Runtime/RNG/order component follow-up

[RUNTIME-COVERAGE.json](RUNTIME-COVERAGE.json) pins the examined System/Char sources and records native frame boundaries, priority sorting, action phases, negative/+1 states, global collision/tick and current Web gaps. It explicitly separates source-only observations from compiled component evidence and actual Web consumers. Both source caches match the previously pinned upstream Git blobs exactly.

A second private Go executable contains 13 unchanged native declarations: Random/Srand/Rand/RandF32/RandI/RandF/Btoi/Clamp, three tick gates and two character-list ordering/action functions. Primitive System fields and trace callbacks replace the surrounding engine. **10,960 actual Web RNG operations** match signed native state and exact float32 result bits. **672 tick-boundary probes and 321 ordering/action-loop probes** match independent fixture models; they do not certify the current Web tick/actor dispatcher. The ordering fixtures include every root/helper × idle/attack/hit × first/last flag combination, ID ties in priority, assertion reset and helpers appended during the run loop.

The native action list sorts once, updates commands, prepares the initial list, runs by a growing index and finishes the resulting list. Appended helpers run and finish that call without the earlier prepare; sorting/assertion reset happen afresh next call. Full native spawn/allocator/state/combat behavior is not represented by trace facades. Current fixed P1/P2 paths, distributed entity loops and Math.random call sites remain explicit gaps. The existing seeded RNG consumer is validated; full gameplay determinism/replay is not.

```text
python Tools/build-native-runtime-oracle.py --common ../outputs/ikemen-common-pinned.go --system ../outputs/ikemen-system.go --char ../outputs/ikemen-char.go --go ../outputs/toolchains/go1.27.3/go/bin/go.exe --output ../outputs/native-runtime-oracle
node Tools/check-native-runtime-components.cjs ../outputs/native-runtime-oracle/build-receipt.json ../outputs/native-runtime-component-results.json
python Tools/check-runtime-inventory.py --source-root ../outputs
```

All probes passed. Runtime remains 0.26.22; M0/full engine/M1 scheduling remain unfinished. Generated upstream code, toolchain, executable and raw fixtures stay private.

## Compiled component evidence and stage/assets (follow-up)

The existing indexed preprocessing helper now supports raw/RLE8/RLE5 alongside LZ5/indexed PNG. A private Go 1.27.3 executable contains 13 unchanged declarations extracted from pinned Ikemen sources, with byte-capture/error/log facades. Source pins and generated/executable hashes are recorded during each build. It passes 8,707 ASCII AIR alpha state/diagnostic cases, 2,460 synthetic SFF pixel cases and 80 physical sprite samples across five original characters. The public stage/asset ledger records original source hashes and sample indices, never original image/audio bytes.

This is scoped evidence for existing consumers, not completion of M1 scheduling, complete native-engine execution, browser raw SFF/SND loading, palette/link/GPU behavior or malformed-input conformance. A terminal zero-run RLE8 input that would stall native code is explicitly rejected offline. Character costume recoloring remains excluded.

[STAGE-ASSET-COVERAGE.json](STAGE-ASSET-COVERAGE.json) records stage/asset gaps. BGCtrl is a separate namespace: ten MUGEN document headings versus twelve pinned native reader types. The document's Enabled and native enable spelling disagreement is retained. Current GLB/JSON stage paths and static asset layout do not certify generic stage DEF/BGCtrl/original-package execution. Full stage parameter and semantic reconciliation remains unfinished.

Reproduce the component checks with private pinned sources/toolchain:

```text
python Tools/build-native-component-oracle.py --image ../outputs/ikemen-image.go --anim ../outputs/ikemen-anim.go --common ../outputs/ikemen-common-pinned.go --go ../outputs/toolchains/go1.27.3/go/bin/go.exe --output ../outputs/native-component-oracle
node Tools/check-air-trans-native.cjs ../outputs/native-component-oracle/build-receipt.json ../outputs/air-trans-native-results.json
python Tools/check-sff-pixels-native.py --receipt ../outputs/native-component-oracle/build-receipt.json --output ../outputs/sff-pixels-native-results.json --character-sff ../outputs/moon/original/moon.sff --character-sff ../outputs/venus/original/venus.sff --character-sff ../outputs/jupiter/original/jupiter.sff --character-sff ../outputs/neptune/original/neptune.sff --character-sff ../outputs/saturn/original/saturn.sff
```

The exact common.go pin uses the upstream physical bytes; an older private cache differs only by a trailing blank line and is not accepted for this build. No upstream Go implementation, toolchain, executable or original SFF/SND is published. Existing runtime stays 0.26.22.

The user approved the M0–M7 implementation order on 2026-10-26. The original approval boundary in the initial audit has now been satisfied. Character costume recoloring remains excluded; gameplay PalFX behavior remains in scope.

## AIR/CMD audit and 0.26.22 existing-consumer correction

[AIR-CMD-COVERAGE.json](AIR-CMD-COVERAGE.json) now records the examined 10-field AIR element path, headers/loops/collision directives, four interpolation directives and CMD parameter/default/remap/key/timing gaps. Native animation/input files and the original KFM CMD reference comments/example are pinned privately; only authored metadata, tools and implementation are published. The sample's documented buffer limit and pinned Ikemen loader behavior remain distinct, as do internal constructor defaults and file-level defaults.

The current converted-character path omits interpolation and per-element scale/angle. The command exporter/matcher lacks full OR, absolute/neutral-direction, step-time, buffering/versioned behavior and generic source ingestion. These are explicit Partial/Unsupported records, not certified executable support. `check-air-cmd-inventory.py` cross-checks five actual pinned inputs, accepted native parameter/default/key facts, documentation interpolation names and stage-record integrity.

Inspection also found a concrete existing alpha-consumer error and an incorrect matching test expectation: AS with no digits used source 255, while pinned native ReadAnimFrame uses 0. The 0.26.22 helper corrects AS/SS/SAS and accepted tails, exposes diagnostics separately, and preserves native-selected fallback states. All 301 Node checks, 72 actual root draw cases and full battle regression passed. This is continued existing-consumer work; no large parser/kernel replacement was started, and the full goal remains unfinished.

```text
python Tools/check-air-cmd-inventory.py --anim ../outputs/ikemen-anim.go --input ../outputs/ikemen-input.go --compiler ../outputs/ikemen-compiler.go --air ../outputs/mugen-reference-11b1/docs/air.html --mugen-cmd ../outputs/mugen-reference-11b1-kfm.cmd
node Tools/check-air-trans.mjs
node Tools/check-air-trans-browser.cjs
```

## Current work

`Tools/audit-engine-controller-baseline.py` creates separate reference rows for the pinned MUGEN 1.1 beta1 controller document and the pinned Ikemen compiler registry. It checks both the document and compiler-source SHA-256 and compiler inventory commit before producing a report. The cached compiler source was read back from the exact upstream commit and matched character for character. It does not redistribute either original reference source.

The initial extraction finds 89 MUGEN controller headings and 163 Ikemen registry entries. These are reference inventory counts, not implementation percentages. Each extracted parameter has separate Parsed, Executable, Source-verified and Semantically tested fields, plus consumer, native-behavior and test evidence slots. They start Unassessed until existing evidence is reconciled; this does not mean existing functionality is absent.

Six document cross-references now inherit syntax candidates from PalFX, DisplayToClipboard, ChangeAnim, Explod or ChangeState. Eight parameterless definitions are explicitly recorded. Missing reference targets, cycles, unexpected empty definitions and mismatched pinned heading/registry counts fail inventory generation. ModifyExplod's per-field applicability remains a semantic follow-up; a shared syntax inventory does not imply identical defaults or behavior.

Nine old compiler warnings are now manually classified into unbounded parameter families: Dialogue's `text<N>` and eight Map controller variants' `map(KEY)` syntax. They retain the legacy warnings and native source locations. Dialogue's numeric sorting/canonical lookup and Map's one-key limit, alternate forms and validation differences are recorded as semantic test requirements; their runtime stages remain Unassessed.

Parameter-name differences are explicitly only candidate differences, not certified Ikemen extension semantics. Shared compiler parameters are included without double counting a repeated name within a controller.

Generate the private working report with:

```text
python Tools/audit-engine-controller-baseline.py --mugen-document ../outputs/mugen-sctrls.html --ikemen-inventory Docs/CONTROLLER-AUDIT.json --ikemen-compiler ../outputs/ikemen-compiler-functions.go --output ../outputs/engine-controller-baseline.json
```

Run its focused checks with `python Tools/check-engine-controller-baseline.py`. Six tests cover nested document markup/alternate syntax, rejection of unpinned input, independent evidence records, transitive parameter references, invalid reference graphs and unbounded key families. Generation against the actual pinned inputs also passed.

## Remaining M0 work

- Resolve aliases, alternate syntax and inherited-field applicability into a complete MUGEN parameter inventory.
- Verify the manually inventoried dynamic compiler syntax and distinguish documented Ikemen extensions from compiler-only names.
- Reconcile existing runtime consumers, defaults, source behavior and semantic tests per parameter; preserve older implementation evidence without accepting older summary labels as certification.
- Finish reference provenance/coverage review and create the remaining subsystem item inventories; the pinned mirrored text set and initial trigger/CNS inventories now exist.
- Complete dependency/evidence checks before calling M0 complete or presenting an overall completion percentage.

No new runtime behavior is introduced by this inventory tool. The full engine goal remains incomplete.

## Expression input inventory and first evidence reconciliation

`Tools/audit-engine-expression-baseline.py` checks the pinned `src/compiler.go` hash and inventories its 279 registry names: 13 redirects, 143 names under the compiler's Mugen comment and 123 under its Ikemen comment. Those comments are retained as compiler-declared groups; they are not accepted as the official MUGEN/Ikemen documentation boundary. The cached file was matched against the exact upstream commit.

The extractor rejects unknown groups, unparsed lines, duplicate names, unexpected flags, missing or unterminated registries. Each name has separate stage records and argument/property inventory gaps. Six focused checks passed, including evidence-reference validation. No registry count is an execution or completion percentage.

`Docs/ENGINE-EXPRESSION-EVIDENCE.json` begins reconciliation with `attack` and `defence`. Actual runtime context consumers, the numeric helper, existing tests and native source locations are recorded. The numeric snapping/float32 subset is Partial; parsing, native differential traces, state selection/lifecycle and wider expression behavior remain unverified. The existing numeric-helper test was rerun successfully. Initial evidence cannot silently promote an entry to Complete.

```text
python Tools/audit-engine-expression-baseline.py --compiler ../outputs/ikemen-compiler.go --evidence Docs/ENGINE-EXPRESSION-EVIDENCE.json --output ../outputs/engine-expression-baseline.json
python Tools/check-engine-expression-baseline.py
```

The working generated reports remain private audit outputs. Public tools and authored evidence records contain no original compiler implementation or original character assets. Runtime remains 0.26.21 for this audit-only follow-up.

## MUGEN trigger/CNS comparison

[ENGINE-REFERENCE-BASELINE.json](ENGINE-REFERENCE-BASELINE.json) pins 31 mirrored original text documents by Git blob/SHA-256 and records provenance qualifications. No original reference text or compiler implementation is published. The mirrored controller reference matches the older official-site cache after CRLF normalization. Binary documentation diagrams and complete per-item authentication/coverage remain outside this text-snapshot receipt.

The controller audit accepts either independently pinned physical copy (old CRLF cache or mirrored LF copy), records which SHA/variant was used, and rejects unpinned content. Both copies generated identical controller inventory rows against the same pinned compiler. Thus the new reference cache can reproduce the controller input inventory without relying on the earlier download's line endings.

The expression audit now accepts `--mugen-document ../outputs/mugen-reference-11b1/docs/trigger.html`. It records 127 document sections and **132 independent names/variants**, including LoseKO/LoseTime and WinKO/WinTime/WinPerfect; all 132 occur in the pinned compiler registry. Nine inherited format references retain both original and alias source locations. Individual variants retain independent Unassessed stage records; a shared document section does not certify equivalent behavior.

The inventory also preserves 74 Const, 36 GetHitVar and 4 StageVar selector candidates with individual stage records. GetHitVar argument/detail differences and StageVar's `info.authorname` versus `info.author` are explicit follow-ups. Five document format-name disagreements are retained (DrawGame, GameWidth, PrevStateNo, ProjGuardedTime and RightEdge). They require native verification and are not silently corrected or accepted as runtime aliases. Eleven compiler names under its Mugen comment do not occur in the trigger reference; other original documents/extension references must determine their classification.

`Tools/audit-engine-cns-baseline.py` inventories the pinned CNS document: 13 precedence groups, 22 operator entries (unary/binary minus remain distinct), 8 interval shapes, 12 redirect forms representing 8 names, 13 StateDef fields and 50 documented special State numbers. Assignment/unary right associativity and the document's left-associative exponent group are retained as syntax facts awaiting execution tests. Defaults, type conversions, bottom propagation, full arguments, negative/global phases, common-state bodies and version differences remain incomplete.

```text
python Tools/audit-engine-expression-baseline.py --compiler ../outputs/ikemen-compiler.go --mugen-document ../outputs/mugen-reference-11b1/docs/trigger.html --evidence Docs/ENGINE-EXPRESSION-EVIDENCE.json --output ../outputs/engine-expression-baseline.json
python Tools/audit-engine-cns-baseline.py --document ../outputs/mugen-reference-11b1/docs/cns.html --output ../outputs/engine-cns-baseline.json
python Tools/check-engine-expression-baseline.py
python Tools/check-engine-cns-baseline.py
```

The expression suite now has 14 focused checks; the CNS suite has 6. Actual pinned inputs were also processed successfully. These validate audit extraction and evidence integrity, not runtime compatibility. Game runtime remains 0.26.21.

`Tools/check-engine-pinned-audit.py` performs the joint actual-input check: all 31 text-file hashes; reproduction of the existing 163-controller inventory from the pinned compiler sources; identical controller rows from both line-ending variants; 132 distinct MUGEN trigger records; documented selector counts and retained document disagreements; and the 8 CNS redirect names against the compiler's 13. The other 5 redirects (`helperindex`, `p2`, `player`, `playerindex`, `stateowner`) remain outside this CNS list and require extension/other-reference classification.

```text
python Tools/check-engine-pinned-audit.py --reference-root ../outputs/mugen-reference-11b1 --registry-source ../outputs/ikemen-compiler.go --compiler-source ../outputs/ikemen-compiler-functions.go --official-controller-cache ../outputs/mugen-sctrls.html --output ../outputs/engine-pinned-audit-results.json
```

The joint check passed. The separate 6 controller, 14 expression and 6 CNS extraction checks passed; none are counted as runtime semantic cases. The M0 milestone and the complete engine goal remain unfinished.
