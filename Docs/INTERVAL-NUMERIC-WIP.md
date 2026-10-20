# Interval numeric consumers — 0.25.49 partial checkpoint

References: MUGEN 1.1 CNS arithmetic interval operators and bottom rules (https://www.elecbyte.com/mugendocs-11b1/cns.html); pinned Ikemen GO cb56d73badb322f3725257c2e8cfd157b2c3989d, compiler expRange and bytecode rangeCheck/blnot.

Recognized numeric interval operands now execute in the typed evaluator. The result retains its integer-compatible boolean tag through enclosing arithmetic: the failing-before (2=[1,3])/2 expression now returns integer 0 rather than JavaScript 0.5. All three operands are evaluated once in order; if any is a float, all three are compared at float32 precision. Open/closed bounds and negated ranges are preserved.

MUGEN-profile bottom propagates. Pinned Ikemen runtime rangeCheck also preserves undefined, including through its negation opcode, while its compiler's all-constant expRange path instead uses ToI/ToF coercion. Tests distinguish those native paths rather than making all invalid ranges true or all constant folds undefined.

Tools/check-range-numeric-types.mjs covers actual parser/evaluator values, float32 promotion, domains, cached branch tags and operand writes. Tools/check-range-browser.cjs passes twelve actual VarSet parameter expressions plus runtime/constant undefined observations in each of eight profile/player/root-or-Helper scenarios.

Pending: untyped query/range operands, complete compiler folding and syntax restrictions, version-specific behavior, native warnings, all undefined origins/storage and full VM/native phases. Complete regression/publication are separate gates. No controller certification changes; last verified release is 0.25.48.
