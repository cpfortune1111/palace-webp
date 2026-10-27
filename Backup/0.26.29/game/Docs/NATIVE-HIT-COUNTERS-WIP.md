# Native hit-count storage and consumers — partial integration

Pinned reference: Ikemen GO cb56d73badb322f3725257c2e8cfd157b2c3989d, char.go hitResultCheck/hitDetection/hitAdd/actionRun, bytecode.go StateDef/HitAdd and fightscreen.go FightScreenCombo.step/addComboHits.

Native UniqHitCount counts successful character contacts independently of HitDef NumHits. ReceivedHits and source team combo totals add NumHits only for non-guarded, non-override, non-None hit types. Projectile contacts do not increase the character-only unique contact count. HitAdd changes both source counters and selected recipient/combo counters directly using signed int32 arithmetic.

Engine/native-hit-counters.js owns independent per-actor unique/received counters and two native team combo values. Action-frame reset retains received counts during hitpause or non-hit dizzy states, clears them for normal idle or guarding, and leaves GetHitVar hitcount separate. Combo eligibility follows the pinned HUD aggregation: positive ReceivedHits, a valid team and alive or not over-KO; no eligible received total resets the opposite team's combo. The WEB finish callback evaluates this after Helper processing. Exact native phase placement remains Pending.

Actual runtime bridges share these stores across accepted contacts, HitAdd and expression queries. Source state transitions reset unique counts unless HitCountPersist is set; real HitCount/GuardCount state reset and integer additions were corrected alongside the bridge. Round and destroyed-Helper cleanup release storage. Existing custom scoring/report hit totals are not replaced by these native counters.

Semantic tests cover distinct unique/NumHits increments, None/projectile exclusions, paused/dizzy resets, over-KO combo eligibility, signed wrap and clearing. Browser fixtures cover real HitAdd dispatch on P1/P2/Helper, stale-target and fallback behavior, live queries, Helper persistence and common accepted contact callbacks. These do not certify the complete native scheduler, all foreign-state/version cases or a native combo HUD renderer. This checkpoint is included in 0.25.21, with deployment verified separately.
