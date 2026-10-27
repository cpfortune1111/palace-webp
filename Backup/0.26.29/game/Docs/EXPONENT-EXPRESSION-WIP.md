# Exponent expressions — 0.25.48 partial checkpoint

References: MUGEN 1.1 CNS manual, arithmetic and operator-precedence sections (https://www.elecbyte.com/mugendocs-11b1/cns.html); pinned Ikemen GO cb56d73badb322f3725257c2e8cfd157b2c3989d, BytecodeExp.pow.

The real parser now accepts ** above multiplication and below unary operators, left-associatively. Typed evaluation handles integer exponentiation, float32 results, negative exponents, invalid real powers and eager operand writes. Integer execution uses bounded exponentiation by squaring rather than a loop proportional to the exponent.

Documented MUGEN nonnegative integer powers saturate at MAX_INT on overflow and promote negative integer operands to float. Pinned modern Ikemen integer powers wrap int32 and keep negative integer bases as integers; negative exponents or float operands use float arithmetic. Result tags are chosen dynamically so a cached expression can change its enclosing division when the base changes sign.

Tools/check-exponent-expressions.mjs executes the actual parser/evaluator. Tools/check-exponent-browser.cjs passes eight actual engine-profile/player/root-or-Helper cases with twelve VarSet parameter expressions each, including Time queries and assignment side effects. Float storage intentionally rounds MAX_INT to float32; standalone evaluator tests additionally check the exact saturated integer value.

Pending: native warning/error diagnostics, legacy engine-version exponent quirks, full undefined/constant-folding/query semantics, transcendental rounding equivalence, complete regression and publication. This does not certify any controller; the last verified publication is 0.25.47.

Final-version focused gates: all 194 Node tools pass (outputs/release-02548-node.log); all eight real exponent actor/profile cases pass (outputs/release-02548-exponent.log). Full combined regression and publication are separately verified; remaining semantic boundaries above are unchanged.
