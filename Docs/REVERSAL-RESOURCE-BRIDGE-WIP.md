# Reversal pending-resource bridge — partial integration

Reference: Ikemen GO `cb56d73badb322f3725257c2e8cfd157b2c3989d`, `src/char.go` selectiveReset at line 1232 and actionRun resource consumption at line 12575.

Native selective reset preserves pending damage, dizzy points and guard points, but does not preserve red-life damage. The WEB adapter previously retained those native numeric fields while dropping its own `nativeResourceQueue` marker. Consequently the real resource consumer skipped preserved damage after a reversal recipient reset; a later queue preparation could also discard it as already-consumed legacy metadata.

Selective reset now retains the WEB-only queue marker and override-index bridge independently of the native field list. This does not add fictional native GetHitVars or preserve native red-life damage that the pinned reference resets.

Focused reset/reversal/resource tests verify the preserved queue is consumed exactly once. An actual recipient/resource fixture observes pending damage 20, dizzy points 5 and guard points 3; life becomes 980, points become 95/97, and a second consumption changes nothing. Red-life remains 1000 because its pending field was reset. Legacy immediate-consumption metadata is not debited again. The complete browser regression ended with exit 0 (`outputs/controller-reversal-pending-resource-bridge-browser.log`).

Complete override-index ownership, per-actor native scheduler parity, all engine profiles and successful ReversalDef dispatch remain Pending. This bridge fix is not complete ReversalDef certification.
