# Comparison result types — 0.25.50 partial checkpoint

Reference: pinned Ikemen GO cb56d73badb322f3725257c2e8cfd157b2c3989d, BytecodeExp.eq/ne and numeric comparisons; MUGEN 1.1 CNS comparison operators return integer truth values.

Comparisons with nonnumeric query operands now retain integer-compatible boolean result tags through enclosing arithmetic and logical chains. Previously (StateType=S)/2 fell back to JavaScript 0.5 rather than native integer 0; failing-before parser tests now pass. Existing numeric comparison promotion stays on the typed path. The legacy AnimElem equality event consumer is explicitly preserved rather than replaced with an ordinary frame-number comparison.

String equality/inequality compares strings case-insensitively and does not equate a numeric string with a numeric value. Evaluated MUGEN undefined operands propagate; pinned Ikemen numeric undefined conversion is retained for the untyped comparison path. Operand expressions are evaluated once in order.

Tools/check-comparison-result-types.mjs covers actual parser/evaluator values, unknown query result tags, legacy animation-element events, string equality and profile-specific undefined. Tools/check-comparison-result-browser.cjs passes twelve VarSet parameter expressions in eight engine-profile/player/root-or-Helper cases, including real actor StateType/MoveType/Name queries and integer division through logical chains.

Pending: complete unknown operand metadata/promotion, numeric/string relational syntax and native validation, all irregular trigger syntax, version/compiler/undefined fidelity, complete regression and publication. This is not full comparison/VM parity or any whole-controller certification. Last verified publication remains 0.25.49.
