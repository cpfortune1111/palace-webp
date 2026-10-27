# Hit contact ordering — partial integration

Pinned reference: Ikemen GO cb56d73badb322f3725257c2e8cfd157b2c3989d, char.go sortOthersByDistance and hitDetection.

Native hitDetection first orders valid candidates by absolute float32 distance with player-ID ties, then stably places ReversalDef recipients before ordinary recipients. Collision sorting uses X distance without depth, or the X/Z hypotenuse when depth is enabled; the P2-list rear buffer and extra Z weight do not apply to hit contacts.

Engine/hit-contact-order.js implements that ordering without mutating the caller's actor list. The automatic reversal contact adapter now consumes it instead of sorting all recipients only by X distance. Focused tests cover reversal precedence, absolute distance, equal-distance IDs and float32 ties. The actual browser fixture switches live depth configuration to distinguish X-only and X/Z ordering. The actual fixture and complete browser regression passed with terminal exit 0 in outputs/controller-reversal-contact-order-browser.log, including the earlier HitOverride-miss fixture and simultaneous Saturn super regressions.

Pending: native candidate eligibility phase ordering, complete juggle rules and inherited targets, exact local-coordinate distance arithmetic, source run ordering, ordinary HitDef integration and all version/parameter combinations. Sorting alone does not certify ReversalDef or HitDef. This checkpoint is included in the 0.25.16 release preparation; deployment is verified separately.
