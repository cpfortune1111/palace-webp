# Reversal hitpause signed addition — 0.26.23

Pinned Ikemen `cb56d73badb322f3725257c2e8cfd157b2c3989d`, `src/char.go` successful reversal branch (lines 14317/14322): the int32 pause component is added to `Btoi(hpFix)` before `Max(1, ...)`. Thus 2147483647 plus the MUGEN 1.x/Ikemen correction wraps to -2147483648 and produces a one-tick counter. The Web helper previously kept 2147483648, causing an extremely long pause.

`Engine/reversal-hit-pause.js` now wraps each sum to signed int32 before applying the minimum. Version selection, type-None asymmetry and existing-gethit suppression retain their existing behavior. The no-correction legacy case still keeps 2147483647.

`Tools/check-reversal-hit-pause.mjs` reproduced the old failure, then passed the fix and 36 signed-boundary/version combinations using independent BigInt arithmetic. `Tools/check-saturn-priority.cjs` exercises the actual pause adapter and independent Helper counters under legacy, MUGEN 1.x and Ikemen profiles. All 301 Node checks and the complete battle regression passed with terminal exit code 0. The actual pause-counter assertion and final simultaneous/1-tick/5-tick battle checks are included in that run; the private release receipt records the logs.

Evidence stages for this correction: Parsed Partial (existing source numeric path), Executable Partial (real reversal pause consumer), Source-verified Partial (the pinned integer addition/minimum branch), Semantically tested Partial (boundary unit checks and actual browser counters). Full ReversalDef/default/version/phase/actor conformance remains unfinished. This is an existing-consumer correction during M0, not full controller certification.
