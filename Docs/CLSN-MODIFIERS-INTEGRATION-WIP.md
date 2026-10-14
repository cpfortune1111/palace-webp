# Collision modifiers — partial actual integration

Pinned reference: Ikemen GO cb56d73badb322f3725257c2e8cfd157b2c3989d, compiler_functions.go overrideClsn/transformClsn, bytecode.go Run, char.go getClsnLocal/resetClsnModifiers, system.go clsnOverlap and common.go RectIntersectSAT/RectRotate.

OverrideClsn executes group None clearing, All writing all four groups, default index zero, caller-context expressions and recipient redirection. Ordered geometry deletes zero rectangles, replaces existing/all boxes, and appends exactly one box for a positive out-of-range index. Negative indices do not create boxes in empty groups. Rectangles normalize after signed localcoord conversion.

TransformClsn executes default all groups/index -1, scale [1,1], missing second scale 1, redirected pivot conversion, cumulative signed scale and last-writer angle/pivot. Negative zero is retained. Actual root/helper attack Clsn1 and target Clsn1/Clsn2/Size/Dummy use override then transform and float32 facing-aware SAT rather than enclosing AABBs. Group-specific HitBy filtering remains independent.

Unblocked root/helper frame resets clear both lists even during hitpause, while blocked global-pause frames retain them. Projectile-owned attack boxes do not accidentally inherit root modifiers.

Executable evidence: Tools/check-clsn-override.mjs, check-clsn-transform.mjs and check-clsn-world-geometry.mjs pass semantic/geometry fixtures. Actual target deletion, Dummy creation/reset, attack replacement, rotated corner miss/central hit and helper Time=0 source dispatch are covered by Tools/check-saturn-priority.cjs. Root/helper hitpause/global-pause reset and complete Saturn regressions passed with exit code 0 in outputs/controller-clsn-modifiers-helper-actual.log.

Remaining: native source-coordinate/scale metadata, proxies, other collision consumers (push, projectile cancellation, reversal and overlap triggers), exhaustive compiler diagnostics/float precision and broader root/helper animation ownership. Neither controller is certified complete. This is a partial 0.24.88 release, not complete controller coverage.
