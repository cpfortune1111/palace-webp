# Bitwise expressions — 0.25.47 partial checkpoint

Reference: Ikemen GO cb56d73badb322f3725257c2e8cfd157b2c3989d, BytecodeExp.not/and/xor/or and compiler expAnd/expXor/expOr; documented MUGEN 1.1 CNS bitwise operators.

The actual WEB parser and typed evaluator now accept unary ~ and binary &, ^ and | for recognized numeric literals, variables, assignments and conditional branches. Equality binds tighter than bitwise AND, then XOR, then OR, then logical AND. Variable assignment retains its comparison-level right-hand boundary. Binary bitwise operands are evaluated eagerly, including writes.

Pinned Ikemen converts float operands to integers. The MUGEN documentation instead specifies bottom for float operands; this path currently uses NaN as an incomplete bottom representation and preserves it through nested bitwise operations. Integral-valued floats retain their float tag.

Tools/check-bitwise-expressions.mjs executes the real extracted parser/evaluator for both profiles. It passes alongside existing logical-profile, conditional-expression and numeric-type checks.

Native query tags now cover Time, StateNo, Life and LifeMax as integers and Pos X/Y and Vel X/Y/Z as float32, based on the pinned bytecode PushI/PushF consumers. Query values come from the existing actor context, not from inferred JavaScript integer values. Tests include integral-valued float queries, bitwise operands and enclosing integer-versus-float division. Other query families remain untyped.

Tools/check-bitwise-browser.cjs passes eight actual browser scenarios: both engine profiles, both player slots, root and Helper. Ten expressions execute through VarSet parameter consumers, including precedence, enclosing integer division, Time queries and eager assignment side effects. Float variable and position queries additionally demonstrate the distinct profile rules without relying on storage to preserve bottom. All 192 Node checks pass and the existing eight-scenario logical browser regression passes.

Unknown unary bitwise operand types now fail explicitly rather than falling through the old unary numeric conversion and silently returning an unchanged value. The focused parser test covers this guard.

The complete combined browser regression (Tools/check-saturn-priority.cjs) completed with exit 0; evidence is outputs/bitwise-full-browser.log. It loaded the bitwise/query implementation before the subsequent unknown-unary guard. The focused parser and eight actual bitwise browser scenarios were rerun successfully after that guard. This does not claim the separate legacy runtime fixture passes.

Subsequent unpublished work adds typed undefined arithmetic/comparison propagation. MUGEN arithmetic/comparisons retain the NaN bottom representation rather than int32-coercing it to zero; the pinned Ikemen ToI/ToF consumers use zero for undefined operands. Undefined no longer contributes a float tag to the latter arithmetic result. Unary negation/complement and logical-not follow their pinned/documented profile distinction. Focused parser tests and all eight actual actor contexts pass for division-by-zero followed by arithmetic/comparison. This is not complete bottom semantics: logical chains, storage, fallback evaluators, undefined origins, modulo float rules and full native VM behavior still need work. The complete browser log above predates these subsequent changes and is not counted as their full regression.

The MUGEN 1.1 CNS manual (https://www.elecbyte.com/mugendocs-11b1/cns.html, arithmetic and precedence sections) additionally establishes float modulo as bottom and relational operators binding above equality. Both were previously incorrect: float modulo always truncated, and equality shared the relational level. The typed modulo consumer now distinguishes profiles; the parser separates those levels while keeping assignment's equality-level right boundary. Focused tests include negative remainder, integral-valued floats, variable float operands and 2=1<1 / 2!=1<1. The older numeric fixture now explicitly tests both engine profiles rather than presenting Ikemen's coercion as universal. Broader regression/publication for this additional change remain outstanding.

Final-version Node gate: 192/192 pass (outputs/release-02547-node.log). Final-version bitwise, logical and 44-case reaction browser gates pass (outputs/release-02547-bitwise.log, outputs/release-02547-logical.log, outputs/release-02547-reaction.log). The combined browser's old universal float-modulo expectation was corrected to test both native profiles without dropping the original division/wrapping/VelSet assertions. Complete combined-browser/deployment verification is recorded separately.

The final-version complete combined browser regression also exits 0 (outputs/release-02547-full-browser.log), including simultaneous Saturn supers at offsets 0, 1 and 5. This supersedes the earlier pre-modulo regression checkpoints above. Publication is verified separately; remaining bottom/query/VM/controller gaps are unchanged.

Still Pending: other native query numeric tags, unknown operands, full bottom propagation through arithmetic/comparisons/logical operators/storage, native overflow and undefined conversion boundaries, complete regressions and publication. This is not full VM parity or a controller certification. The last verified published version remains 0.25.46.
