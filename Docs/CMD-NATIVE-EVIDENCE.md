# Native command reference prerequisite

Status: **Partial**. Runtime baseline: 0.26.28. The verified symbol/input/matcher/list components drive battle command sampling through `Engine/battle-command-list.js`. [Decoded CMD configuration](CMD-FILE-EVIDENCE.md) adds text input, Defaults/Remap and error/version policy. File I/O/encoding, State -1 compilation and complete native input scheduling remain unfinished.

The private reference compiles 25 unchanged declarations from Ikemen GO commit `cb56d73badb322f3725257c2e8cfd157b2c3989d`. Source SHA-256 pins:

- `src/input.go`: `c5f02ca16464c98a052fee9c453729638b3fab31c6d6ace6ba4e92a96985d94b`
- `src/common.go`: `d7a40673b3bfcd7f6b320747e37679431fefd1aad7040e2d1f60484e03148ac6`

`Tools/build-native-command-oracle.py` verifies these inputs before extracting the parser, command-step matcher, actual input counter update, State and StateCharge functions and their dependencies. Go 1.27.3 builds offline. The receipt records declaration hashes, compiler version and executable hash. Generated native code, executable, source files and detailed results remain private.

`Tools/check-native-command-oracle.py` passed **226 synthetic fixtures**. These cover 25 key tokens with eight modifier combinations, invalid forms, empty input, AND/OR truth tables, held/released OR, direction-to-button matching, buffering, hitpause buffering, AI/helper hold behavior, remapping and physical versus facing-relative direction counters. Fixture configuration and physical booleans are supplied by the wrapper; this does not verify hardware input or complete CMD file configuration.

The same reader inspected **247 original command definitions** from five private character files:

| Character | Definitions | Without native parser diagnostic |
| --- | ---: | ---: |
| Moon | 58 | 58 |
| Venus | 39 | 39 |
| Jupiter | 76 | 74 |
| Neptune | 35 | 35 |
| Saturn | 39 | 39 |

Jupiter definitions at original file lines 33 and 39 produce `Multiple keys found without '+' separator`. These diagnostics are retained; the 226 passing synthetic tests do **not** mean all 247 original definitions are accepted. No original character rules were rewritten to suppress the diagnostics.

Web gaps remain: existing command exporters split steps on AND only. The new battle matcher handles OR and native absolute-direction/neutral counters, but raw CMD ingestion, file defaults/remaps, hardware/SOCD handoff, complete timing and State -1 scheduling still require integration and semantic tests. OR is an Ikemen extension and is not certified as a MUGEN 1.1 feature. No full-engine completion claim is made.

## Web symbol parser differential evidence

`Engine/command-symbols.js` implements the symbol grammar used by the new battle adapter: all 25 keys, AND/OR, step-wide greater, hold/release/fourway, signed-int32 charge accumulation, button remapping, partial parsed steps and the final native diagnostic. Unicode whitespace follows Go White_Space, including U+0085 and excluding FEFF; invalid-symbol diagnostics use the first UTF-8 byte as the reference does. Existing exported steps are converted back to symbols where raw command text is unavailable; this is not a replacement for a complete CMD-file loader.

`Tools/check-command-symbols-native.mjs` passed **1,599 synthetic cases and all 247 original definitions**, comparing both exact diagnostics and complete symbol-step metadata against the private pinned executable. The two Jupiter diagnostics match too; they are not counted as accepted definitions. This comparison disables AutoGreater and excludes expansion, compatibility transforms, loop-order preparation, input matching/timing and complete CMD-file policy. Native command matcher tests above remain separate from Web symbol-parser tests.

| Layer | Evidence | Status |
| --- | --- | --- |
| Symbol grammar | Executed Web module versus pinned native parser, 1,846 cases | Semantically tested within the stated grammar scope |
| Production parser consumer | Battle command-list creation uses the verified modules | Partial; bundle adapter, not raw CMD loader |
| Production OR matching | Actual browser sampler and expression queries verified for both players / five characters | Partial integration; exporter/file ingestion remains |
| Full CMD engine | File policy, cross-player lists, scheduling and complete input handoff remain | Partial |

The optional `--symbols-corpus` argument to the native checker writes original command text to a **private local fixture** only. Never publish that generated corpus.

## Input buffer and individual-command matching

`Engine/command-input-buffer.js` now executes signed-int32 press/release counters, independent physical L/R and facing-relative B/F counters, neutral input, and State/StateCharge queries for all 25 keys. Native dollar-direction and dollar-neutral compatibility behavior is preserved, including the pinned UR/DR dollar-release conflict choice. Hardware mapping, SOCD and input injection occur upstream and are not certified by this component.

`Tools/check-command-input-native.mjs` passed **315,400 State/StateCharge comparisons over 1,577 ticks** against the same unmodified native functions. Fixtures cover every pair of four-direction combinations, simultaneous conflicting directions, held/released buttons, quiet periods, mixed inputs and facing changes. The tests begin from zero counters; int32 wraparound at billions of held ticks is not independently exercised by this gate.

`Engine/command-matcher.js` now executes individual-command timing, step timers, charge gates, AND/OR, greater-step rejection, same-frame direction-to-button evaluation, duplicate-direction expansion, hitpause/pause-end buffer controls, AI/helper hold restrictions and completion/buffer transitions. Configuration is explicit, with low-level constructor defaults matching newCommand rather than claiming CMD-file defaults. Backward-compatibility transforms and CommandList behavior remain separate requirements.

`Tools/check-command-matcher-native.mjs` passed **176 synthetic scenarios plus 247 original definitions**, comparing expanded step metadata, evaluation order and every tick's completion, buffer, timer, completed-step and step-timer fields. There were **43,784 compared ticks and 3,759 completion observations**; the two original Jupiter diagnostics matched and were excluded from tick execution. Original definitions use a shared mixed-input fixture; this does not prove every original move is reachable or performs correctly in battle.

These components replace the old hand-written battle command matcher in 0.26.27. Existing AssertCommand and trace interfaces forward buffer writes to the native-style matcher. Installed `engineVersions.ikemen` metadata selects legacy hold transforms and helper-AI restrictions; all five installed characters declare Ikemen 0.0 and MUGEN 1.0. This uses existing exported version metadata, not a complete DEF loader.

## Command-list sharing and legacy transforms

The optional `--with-lists` builder mode extracts **35 unchanged native declarations**, including CommandList grouping, Add/At/Get/GetState, Assert, ClearName, Step and ApplyBackwardCompatibility. Native console/log calls are captured by a fixture facade; hardware input and complete compiler version policy are not included. The original 25-declaration individual oracle remains separate.

`Engine/command-list.js` groups definitions by first name insertion, executes each matcher, clears completion flags as native Step does and resets shared duplicate progress while retaining their buffers. Assert assigns the exact signed-int32 buffer to all variants of a known name. `CommandMatcher.applyBackwardCompatibility()` propagates hold across AND steps, skips OR propagation and forces hold-only buffer time to one, matching the pinned native transform. Deciding whether to apply this transform from character version metadata is still a compiler/loader requirement.

`Tools/check-command-list-native.mjs` passed **32 scenarios / 3,232 ticks**, comparing every grouped command's expanded steps, flags, buffers, maximum buffer, timers and completion state, plus assertion return values and command-active results. Fixtures vary shared flags, legacy transforms, pause/hitpause, helper AI, missing-name assertions and explicit clears. Cross-player command-list copies remain unverified; local battle consumers have the additional gates below.

## 0.26.27 battle consumer evidence and remaining limits

`Tools/check-battle-command-list.mjs` executes all **215 installed definitions** across five character bundles, writable assertion buffers, OR, version-dependent holds and physical direction continuity. `Tools/check-battle-command-browser.cjs` loads each actual character profile and exercises P1/P2 sampling and real expression contexts: OR, three-tick release charge, expiry, absolute left across facing reversal, legacy held combinations and opposing-buffer isolation. Fixture-only commands are injected temporarily and restored; no character rules are changed.

All **306 Node checks** and the complete browser battle regression pass, including existing actual Helper keyctrl/AssertInput/ShiftInput/cleanup coverage and Saturn simultaneous super cases. Browser sampler fixtures call the real sampler directly; they do not prove keyboard/gamepad/touch event mapping or every original move's reachability.

The sampler still uses existing upstream canonical input/SOCD/injection handling and current hitpause scheduling. Exact native input.pauseonhitpause policy, end-command buffering during Pause/SuperPause, WinMUGEN extra buffering, inputWait/noinput reset timing, AI command cheats, cross-player command-list copies and complete State -1 ordering remain incomplete. Generic Defaults/Remap parsing, exporter support for new syntax and version-dependent tolerance of malformed definitions also remain. The matcher exposes these configuration controls, but that alone does not certify the full input pipeline.

```text
python Tools/build-native-command-oracle.py --input ../outputs/ikemen-input.go --common ../outputs/ikemen-common-pinned.go --go ../outputs/toolchains/go1.27.3/go/bin/go.exe --output ../outputs/native-command-list-oracle --with-lists
node Tools/check-command-list-native.mjs ../outputs/native-command-list-oracle/build-receipt.json
```

```text
node Tools/check-command-input-native.mjs ../outputs/native-command-oracle/build-receipt.json
node Tools/check-command-matcher-native.mjs ../outputs/native-command-oracle/build-receipt.json ../outputs/private-command-symbol-corpus.json
```

```text
node Tools/check-command-symbols-native.mjs ../outputs/native-command-oracle/build-receipt.json ../outputs/private-command-symbol-corpus.json
```

Reproduce locally with private references and a private output directory:

```text
python Tools/build-native-command-oracle.py --input ../outputs/ikemen-input.go --common ../outputs/ikemen-common-pinned.go --go ../outputs/toolchains/go1.27.3/go/bin/go.exe --output ../outputs/native-command-oracle
python Tools/check-native-command-oracle.py --receipt ../outputs/native-command-oracle/build-receipt.json --output ../outputs/native-command-results.json --character-cmd ../outputs/moon/original/moon.cmd --character-cmd ../outputs/venus/original/venus.cmd --character-cmd ../outputs/jupiter/original/jupiter.cmd --character-cmd ../outputs/neptune/original/neptune.cmd --character-cmd ../outputs/saturn/original/saturn.cmd
```
