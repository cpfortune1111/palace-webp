# Movement redirect extraction (partial, unpublished)

Pinned reference: Ikemen GO cb56d73badb322f3725257c2e8cfd157b2c3989d, bytecode.go getRedirectedChar uses evalI before Character lookup. The WEB position/velocity adapters previously used JavaScript Number coercion and unbounded truncation, accepting numeric strings and missing signed 32-bit wrap.

controllerInteger now applies native string/undefined/NaN zero extraction and signed integer wrapping. PosSet/PosAdd and VelSet/VelAdd/VelMul/HitVelSet use it for explicit redirectid. Missing recipients still return before RHS evaluation; omitted redirectid still uses the caller.

A failing-before check reproduces a numeric string incorrectly selecting ID 7 (outputs/movement-redirect-extraction-before.log). The focused check covers strings, undefined, NaN, signed fractional values, booleans and wrapping. Existing position/velocity checks pass. An actual browser fixture verifies quoted root IDs do not trigger side-effecting movement operands in both named profiles and P1/P2 directions (outputs/movement-redirect-extraction-browser.log); the final expanded six-controller fixture remains to be rerun.

The expanded actual-browser fixture now passes for all six movement controller types in both profile/player directions (outputs/movement-redirect-extraction-six-browser.log). Its quoted redirect ID evaluates to a string, not a native integer; no movement operand side effect occurs. Standalone tests also cover all six types.

The same native getRedirectedChar/evalI path is used by AngleSet/Add/Mul/Draw, AttackMulSet, DefenceMulSet, CtrlSet, StateTypeSet, Turn and SprPriority. These ten types now share controllerInteger for redirect IDs. A second failing-before check exposes AngleSet's numeric-string coercion (outputs/controller-redirect-extraction-additional-before.log). Standalone checks cover all sixteen types.

Actual angle, attack, defense and state-property adapters now reject disabled Characters via controllerCharacterActor before adapting storage. Existing attack/defense storage wrappers remain intact. Expanded actual browser tests exercise four angle controllers, both multiplier controllers, CtrlSet and SprPriority against invalid Character IDs and quoted root IDs (outputs/controller-redirect-extraction-additional-browser.log). StateTypeSet/Turn have standalone extraction coverage, not dedicated actual invalid-recipient state assertions. Remaining specialized adapters are not claimed covered.

Full native integer overflow/nonfinite/version/compiler/diagnostic behavior, remaining integer consumers, complete regression and publication remain Pending. No whole-controller certification changes.
