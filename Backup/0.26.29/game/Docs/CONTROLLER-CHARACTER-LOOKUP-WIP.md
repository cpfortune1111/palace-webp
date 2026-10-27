# Controller Character lookup (partial, unpublished)

Reference: Ikemen GO cb56d73badb322f3725257c2e8cfd157b2c3989d, system.go playerID and bytecode.go getRedirectedChar. Native explicit redirect IDs query the Character ID map, rejecting negative IDs, destroyed Characters and disabled Characters. Projectile objects are not Characters.

The WEB combat entity resolver intentionally includes projectiles for collision/source handling. A separate controller Character resolver now filters projectile, destroyed and disabled recipients, including root disabled flags. Forty direct findActor adapters use it; Target expression selection and NumTarget also use this lookup. General collision/source resolution remains unchanged. Omitted redirectid continues to use the caller directly.

check-controller-character-lookup.mjs checks identity preservation, rejected recipients, single lookup, negative-ID early return and actual DizzySet dispatch skipping RHS evaluation for invalid recipients. check-status-controllers.mjs and the existing actual-browser controller suite pass; browser evidence: outputs/controller-character-lookup-browser.log. These are focused checks, not proof of all migrated adapters or complete native Character/ID semantics.

Actual browser registry fixtures now dispatch DizzySet, TransformSprite and ModifyReflection through real root bindings for P1/P2 in mugen11/ikemen profiles. Projectile, disabled Helper, destroyed Helper and disabled opponent root redirects leave a side-effecting RHS variable untouched. These fixtures register lookup-only entities; they do not prove projectile construction or all forty adapters. Evidence: outputs/controller-character-lookup-actual-browser.log and outputs/controller-character-lookup-lifecycle-browser.log.

Lifecycle PlayerID and PlayerIDExist now share the Character resolver, including actual root disabled flags supplied by the WEB adapter. Standalone lifecycle tests cover live root/Helper identity and rejection of disabled roots, disabled/destroyed Helpers, projectiles and missing/negative IDs. This also removes the prior use of the current fighter/opponent pair as the root ID registry for Helper callers.

Four custom adapters now use the same Character resolver: Target velocity, HitAdd, velocity and position dispatch. The actual invalid-recipient fixture additionally exercises TargetVelSet, HitAdd, VelSet and PosAdd with side-effecting RHS expressions; all four profile/player cases pass (outputs/controller-character-lookup-movement-browser.log). Thus forty direct plus four custom controller adapters have migrated; this is not a claim of forty-four fully compatible controllers.

All 225 Node checks passed after the lifecycle resolver change. The full battle baseline completed with exit zero (outputs/controller-character-lookup-full-browser.log), but launched before the later four custom-adapter edits and cannot certify those edits. Current scheduling checks also pass (outputs/controller-character-lookup-scheduling.log).

The actual fixture includes a controlled prior-resolver comparison: temporarily restoring general combat lookup reproduces one unintended RHS variable write for a projectile recipient in every profile/player case. Restoring Character lookup suppresses all invalid-recipient RHS writes. Resolver and state cleanup use finally blocks. Evidence: outputs/controller-character-lookup-negative-control-browser.log.

Complete actual expression-dispatch coverage, final combined regression, native diagnostics/version behavior and publication remain Pending. No whole-controller certification changes.
