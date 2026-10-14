# HitDef friction — partial integration

Complete browser regression including the actual friction fixture passed with terminal exit code 0 in outputs/controller-hit-friction-actual.log.

Complete browser regression including helper XZ friction and hitpause clock fixtures passed with terminal exit code 0 in outputs/controller-helper-hit-friction-actual.log.

Complete browser regression including root source-physics friction/cutoff fixtures passed with terminal exit code 0 in outputs/controller-root-hit-friction-actual.log.

Pinned Ikemen GO cb56d73badb322f3725257c2e8cfd157b2c3989d compiler-functions.go accepts stand.friction and crouch.friction; bytecode.go evaluates float32 values, and char.go copies them into recipient GetHit data. Defaults are NaN. Native movement getters use the override only during MoveType H, while GetHitVar queries fall back to character movement constants regardless of MoveType.

Shared HitDef compilation now evaluates both fields in source context and shared contact stores them without recipient coordinate scaling. Root/helper Z physics and root source/reaction X friction paths consume the hit-only override. Root movement and GetHitVar fallbacks use the character's existing native constant lookup, preserving source IR fallback rather than assuming a generic value. GetHitVar queries support both names, including zero and NaN fallback. Tools/check-hit-friction.mjs passes focused getter semantics. The actual browser fixture proves source expressions, contact storage, GetHitVar queries, hit-only consumption and character fallback.

Helper X physics now applies native standing/crouching friction after position integration, including the native standing cutoff shared with Z. Both helper axes use the same character constant lookup as roots. The actual helper fixture covers hit-only standing override, zero crouching override, post-integration velocity cutoff and a paused frame that changes neither position, velocity nor actor time. Corner-push default friction also consumes the recipient's hit override, matching native checkCornerPush.

Root X friction paths now use the same float32 post-movement friction and native standing cutoff as Z rather than merely multiplying a double-precision velocity forever. The actual P2 source-physics fixture covers position-before-friction, standing residual cutoff, crouching residual preservation and PosFreeze suppressing position while friction still changes velocity.

Release 0.24.95 remains partial and not certified: full root battle-driver pause/ownership fixtures, GetHitVarSet, selective reset/persistence, version defaults and complete controller audit remain pending. All controller certification rows remain Pending.
