# Engine inventory reconciliation — M0

The user approved the M0–M7 implementation order on 2026-10-26. The original approval boundary in the initial audit has now been satisfied. Character costume recoloring remains excluded; gameplay PalFX behavior remains in scope.

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
