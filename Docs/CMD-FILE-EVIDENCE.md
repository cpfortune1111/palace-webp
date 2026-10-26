# Decoded CMD text configuration — partial compatibility evidence

Runtime 0.26.28 implements decoded-text CMD configuration and its battle consumer. It does not certify the entire CMD/State -1 subsystem, byte encodings, includes, file-path resolution or pause/input scheduling. Existing installed character profiles retain their exported command bundles; decoded raw text is an additional accepted command-source representation.

`Engine/ini-sections.js` follows the pinned native INI rules: Unicode White_Space trimming, semicolon truncation even inside quotes, section-name handling, first occurrence of a key, signed integer-prefix conversion with native int32 saturation and numeric booleans. This is the engine's INI dialect, not a generic quote-aware parser.

`Engine/command-file.js` reads the first Defaults and Remap sections, defers command compilation until the complete configuration scan finishes, resolves all seven command defaults/per-command controls, applies button remaps and selects legacy transforms from Ikemen version metadata. Missing names, malformed quoted names and command-symbol errors follow the native distinction. Explicit legacy ignoreMostErrors preserves partial parsed commands while returning diagnostics; modern-version errors remain fatal. No source character rules are invented or rewritten.

The battle adapter accepts either existing exported definition arrays or decoded raw CMD text. Remaps and explicit error policy reach the matcher. Root/Helper command-value construction and expression existence checks use the compiled owning player's command list rather than assuming a JSON array or P1's definitions. Existing installed profiles continue using their existing exported definitions; original character CMD files are not published.

## Native reference boundary

`Tools/build-native-command-oracle.py --with-files --compiler <private compiler.go>` builds 45 unchanged native declarations plus an unchanged statement block from pinned CharCompiler.Compile. File I/O, engine setup and console/logging are fixture facades; this is not a full native compiler executable. The command configuration block is extracted between its initialization and the following string-pool reset. Its SHA-256 is `53ac348ea97f794f49adac663cb735d3629ccd3f8161ac57d7a08da524f821b1`.

References remain Ikemen GO commit `cb56d73badb322f3725257c2e8cfd157b2c3989d`:

- compiler.go SHA-256 `e027f39df8f86d3ea9b7c422237f4c1525795d70eb1365b136e9a31c75bcd9f8`
- input.go SHA-256 `c5f02ca16464c98a052fee9c453729638b3fab31c6d6ace6ba4e92a96985d94b`
- common.go SHA-256 `d7a40673b3bfcd7f6b320747e37679431fefd1aad7040e2d1f60484e03148ac6`

## Executed evidence

`Tools/check-command-file-native.mjs` passes **83 synthetic plus five private original CMD texts**, each under four version/error-policy combinations: **352 cases, 338 accepted results, 14 matching errors, 1,085 compiled definition observations**. It compares exact errors, defaults, remapped/expanded steps, evaluation order, timings, buffer flags and grouped definitions. The raw-text battle adapter's matcher configuration also agrees. Definition observations include repeated policies; they are not 1,085 unique commands.

The test caught native ReadI32's unusual buffer.time handling for a nonempty comma list with an empty first item: the temporary integer starts at zero, then clamps to one rather than preserving the inherited buffer. The implementation now matches this case.

The extended five-character P1/P2 browser sampler gate passes raw CMD text with Defaults, Remap and OR through actual expression contexts. It also exposed and corrected old JSON-array assumptions and an existence check using ambient P1 scope for a P2 context. Existing 215-definition adapter and native individual-matcher gates pass. All 307 Node checks and the final complete battle regression pass after the existence/consumer repair, including simultaneous Saturn super cases. Release metadata/import cache revisions do not change those function bodies. The 0.26.28 fresh-context 360-tick repeatability gate also passes with 339 stable loaded source inputs. This remains a scoped decoded-text/configuration and consumer gate, not full native engine certification.

State-controller sections, complete State -1 compilation, filesystem/URL packaging and encoding/BOM policy are outside this text-configuration gate. No original CMD text, native generated source, executable or toolchain is published.

```text
python Tools/build-native-command-oracle.py --input ../outputs/ikemen-input.go --common ../outputs/ikemen-common-pinned.go --compiler ../outputs/ikemen-compiler.go --go ../outputs/toolchains/go1.27.3/go/bin/go.exe --output ../outputs/native-command-file-oracle --with-files
node Tools/check-command-file-native.mjs ../outputs/native-command-file-oracle/build-receipt.json <private original CMD paths>
node Tools/check-battle-command-browser.cjs
```
