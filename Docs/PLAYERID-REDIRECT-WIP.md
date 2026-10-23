# PlayerID expression redirection (partial, unpublished)

Reference: Ikemen GO cb56d73badb322f3725257c2e8cfd157b2c3989d, compiler.go PlayerID redirect compilation, bytecode.go OC_playerid and char.go playerIDTrigger. The native compiler requires parentheses and a comma; nested redirect argument evaluation returns to the original execution context. Missing actor lookup yields undefined and skips the redirected expression.

WEB now parses PlayerID(expression), expression into indexed redirection. Typed and untyped execution share target-context lookup. The index samples the original context, converts to signed integer, and resolves live root or Helper instance IDs. Helper animation/resource IDs and projectile IDs are not character instance IDs. Destroyed Helpers are excluded. Returned contexts keep the original execution context for nested operands.

Focused lifecycle assertions cover both roots, both teams' Helpers and absent/destroyed/projectile/resource IDs. Actual browser cases cover both players' root integer LayerNo reads, a live Helper, nested EnemyNear to PlayerID lookup and missing-target side-effect suppression. Evidence: outputs/playerid-redirect-browser.log. This is real expression execution, distinct from controller redirectid dispatch.

A failing-before arithmetic case exposed a redirect grammar error: only the first operand originally used the recipient context. PlayerID now parses the entire following expression in the redirect body, matching the pinned compiler's expValue call. Independent parser/evaluator and actual P1/P2 checks require both LayerNo operands to read the recipient, not mix target and caller values. This correction applies to the new PlayerID path; other redirect grammar paths still need their own audit.

Full native warning/console behavior, parser diagnostics, type extraction edge cases, all version/profile boundaries, complete nested-expression grammar, VM and full character lifecycle equivalence remain Pending. Final combined regression, versioning and publication are separate gates. No whole-controller certification is implied.
