# AttackDist write ordering (unpublished, partial)

Reference: Ikemen GO cb56d73badb322f3725257c2e8cfd157b2c3989d, src/compiler_functions.go attackDist and src/bytecode.go attackDist.Run.

The compiler emits value, width, height and depth in that order after redirect selection. Runtime writes each supplied front/back component immediately after its expression evaluates. It does not evaluate every parameter into a temporary collection before updating the HitDef. Omitted back components preserve their existing values. Redirect scale division and expression multiplication use float32 arithmetic; negative results clamp to zero.

Engine/attack-distance.js now performs immediate component writes and rounds the redirect scale ratio to float32. A failing-before module test observed a later operand reading the old front distance (100 rather than 10). The repaired test verifies sequential reads across value components, width overriding value, and height reading the updated width/back values. Existing omission, ownership, clamping and validation cases continue to pass in Tools/check-attack-distance.mjs.

Subsequent browser evidence executes actual redirected AttackDist through the common dispatcher. A defender's parameter writes the opposing root's front distance first, then samples IfElse(InGuardDist,20,30) for its back distance. The real guard-distance query changes from false to true between components; the final back distance is 20 rather than the stale-value result 30. Eight profile/player/root-or-Helper caller scenarios pass in Tools/check-debug-clipboard-browser.cjs, with outputs/attack-distance-browser.log recording completion.

These results are not native executable differential certification. Full coordinate/version/rendering/scheduler behavior and controller certification remain Pending. Final combined regression and publication are separate gates.
