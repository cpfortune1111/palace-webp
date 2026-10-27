# HitAdd — partial live counter integration

Reference: Ikemen GO cb56d73badb322f3725257c2e8cfd157b2c3989d, bytecode.go hitAdd.Run and char.go Char.hitAdd.

Engine/hit-add.js validates required value, resolves RedirectID in caller evaluation context, coerces integers and applies signed int32 additions to source HitCount/UniqHitCount. A zero value exits before counter access. Missing redirected actors do not evaluate the value.

When the source has an explicit target list, native code updates only its first still-existing target's ReceivedHits and source-side combo count. If all explicit IDs are stale, it does not use the no-target fallback. With no targets and a non-neutral native team side, eligible opposing roots receive the change if they already have ReceivedHits or are in MoveType H. The adapter API uses native team-side numbering (0/1, neutral -1); the future WEB bridge must translate its existing 1/2 side representation.

check-hit-add.mjs tests target order, stale IDs, fallback eligibility, neutral side, zero/missing redirection, negative and overflowing additions, redirected Helper isolation and combo side ownership. These are semantic adapter tests against controlled actor bindings, not actual game-counter integration.

The WEB dispatcher now binds both parameters to real root/Helper HitCount and separate native UniqHitCount/ReceivedHits/team-combo storage. HitCount, UniqHitCount, ReceivedHits and ComboCount expressions read these live consumers. Root/Helper round and destruction paths clear the new stores. Existing custom report scoring remains separate and unchanged.

Accepted ordinary, type-None and projectile callbacks update the new native counters; the accepted reversal path also records contact. Source unique count increases once per non-projectile unguarded contact rather than by NumHits, while eligible received/combo totals add NumHits. Source state transitions now distinguish HitCountPersist, and Helper counters no longer incorrectly survive ordinary state re-entry. Source count arithmetic uses signed int32 additions.

The first complete bridge run passed in outputs/controller-live-hit-add-browser.log. The subsequent lifecycle refinement exposed three older HitOnce/NumHits fixtures that read P1 HitCount only after P1 had entered a default reaction state. Pinned compiler.go supplies HitCountPersist=0 by default and bytecode.go calls clearHitCount on entry, so those fixtures now preserve/assert the pre-counterattack hit totals and separately assert the native post-reaction zero instead of keeping stale counts. The strengthened actual fixtures and complete browser regression passed with terminal exit 0 in outputs/controller-hit-add-counter-lifecycle-browser.log, including Helper persistence/re-entry and actual ordinary/None/projectile count checks.

Pending: full per-actor phase ordering and deferred state changes, all override/reversal/projectile combinations, StateDef persistence import across every format, original MUGEN differences, Simul/Tag and complete native combo HUD rendering. Current source snapshots contain no explicit HitCountPersist=1 states, so current asset payloads do not require regeneration for that flag. No controller or parameter is counted complete; this checkpoint is included in 0.25.21, with deployment verified separately.
