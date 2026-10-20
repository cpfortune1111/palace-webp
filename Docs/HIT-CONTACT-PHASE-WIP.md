# Native contact-phase rejection — 0.25.35 partial implementation

Pinned reference: Ikemen GO cb56d73badb322f3725257c2e8cfd157b2c3989d, char.go hitResultCheck around lines 11414–11432 and the pre-detection CSF_gethit reset around line 14954. This is not full state-change or GetHitVar certification.

Two native checks that do not require deferred-state inference are now real collision/accepted-contact gates:
- A source already marked CSF_gethit cannot activate a HitDef with a nonnegative P1StateNo.
- A recipient already marked CSF_gethit whose current GetHitVar attribute contains NT, ST or HT rejects subsequent contacts in the same pass. MoveType H alone is not this flag, and old throw attributes alone do not lock a later pass.

Engine/hit-contact-phase.js requires explicit boolean phase inputs and accepts string or integer attribute masks. Live consumers use the existing positive-contact phase store and authoritative recipient GetHitVars, not stale collision-frame snapshots. Projectile source flags come from the real character owner; independent Helpers do not borrow the root's flag.

The shared collision prerequisite, both direct root hit callbacks, entity contact writer, Helper override writer and qualified reversal entry use the checks. Rejected P1 callbacks no longer clear entityDefenderPause before eligibility. A Helper override writer returning no accepted result no longer queues a state change or publishes lastHitOverride.

Evidence:
- controller-contact-phase-before.log reproduces both missing gates in both root slots: all four prohibited contacts were accepted.
- check-hit-contact-phase.mjs exercises phase/attribute/P1StateNo combinations, integer masks, missing live inputs and a later pass.
- check-hit-contact-phase.cjs exercises ten root cases: prohibited repeats and already-hit custom-state sources, ordinary counter contacts, a later pass and negative type-None results. Snapshots include life, power, states, entry serials, GetHit fields, score hits, defender-pause flags, sound/spark calls and effect retention; rejected candidates remain unspent.
- Actual Helper and root-/Helper-owned projectile writers and collision prerequisites reject a thrown recipient. A qualified reversal also rejects without accepted-contact effects. Root and Helper source flags remain independent, and a Helper-owned projectile reads its Helper's flag.
- Existing contact fixtures now explicitly isolate collision-phase state while retaining all prior expected results. Separate source-state variants, the throw-after-counter-hit setup and the MissOnOverride acceptance variant advance their independent pass instead of silently reusing a previous source's gethit flag. Phase snapshot/restore itself has an executable test.
- The complete initial browser gate finished at exit 0 in controller-contact-phase-regression-5.log. The expanded actual phase fixture finished at exit 0 in controller-contact-phase-after-3.log; original Moon throw cases also passed. The Node sweep passes 177/182 with the same five existing harness failures. Versioned final gates and deployment are verified separately.

0.25.36 adds a real delayed initialization buffer for Helper P1StateNo sources. STATE-CHANGE-BUFFER-WIP.md records its actual consumers and limitations. Root and target transitions have not yet been migrated, so this does not constitute actor-wide stchtmp or ghvset coverage.

Pending: complete authoritative deferred stateChange1/stateChange2/stchtmp export, the remaining foreign-provider early-return conditions, live ghvset suppression and GetHitVar stacking/order, every HitOverride/version branch, and a single native-equivalent collision/action scheduler across roots, Helpers and projectiles. The current WEB phase store is scoped to logical ticks; passing these two gates does not prove all native collision reset boundaries. No guessed false stchtmp value was added to make the isolated getHitWriteEligible truth table appear connected. No controller or parameter is fully certified by this checkpoint. Deployment and complete regression are verified separately.
