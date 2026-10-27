# Logical undefined propagation — 0.25.49 partial checkpoint

References: MUGEN 1.1 CNS manual, bottom and special-form sections (https://www.elecbyte.com/mugendocs-11b1/cns.html); pinned Ikemen GO cb56d73badb322f3725257c2e8cfd157b2c3989d, expBoolAnd/expBoolOr/expBoolXor and bland/blor/blxor.

MUGEN-profile evaluated undefined values now propagate through typed and legacy fallback AND/OR instead of normalizing to false or replacing an invalid left operand with a valid right operand. XOR retains an undefined result when either evaluated operand is invalid instead of converting both to JavaScript booleans. Existing valid short-circuit behavior is preserved; full native MUGEN expression side-effect/evaluation-order parity is not claimed.

Pinned Ikemen retains its existing CNS distinction: dynamic AND/OR operands keep their selected value/tag, while constant folds and XOR normalize via native boolean conversion. Tests distinguish a retained dynamic undefined operand from a constant folded false. IfElse/Cond still isolate an unreturned invalid branch according to their separate eager/selective contracts.

Tools/check-logical-profiles.mjs has failing-before actual parser/evaluator assertions for invalid left/right operands, XOR, fallback queries and special-form isolation. Tools/check-logical-browser.cjs passes the original fourteen parameter expressions plus five undefined expressions in eight actual profile/player/root-or-Helper contexts. NaN is still only the incomplete WEB bottom representation; variable storage, untyped fallback arithmetic, all undefined origins, native warnings and full compiler/VM behavior remain Pending. Full regression/publication are separate gates; no controller certification changes.
