# Juggle source audit — not implemented completely

Pinned reference: Ikemen GO cb56d73badb322f3725257c2e8cfd157b2c3989d. The current WEB targetedBy structure preserves attacker IDs and their previously stored juggle value, but this does not implement juggle-point collision gating or debit. No Juggle/HitDef/StateDef row is certified by that storage.

Required native consumers identified in bytecode.go and char.go:

- stateDef.Run assigns the provided integer juggle expression before velocity; omission retains the prior cost.
- HitDef setup allows air.juggle to update a non-projectile character's cost for Ikemen-version characters; Mugen character HitDefs do not use that extension.
- Candidate filtering uses NoJuggleCheck, the source's current cost, the target's per-source remaining budget, Ikemen hittmp rules and Mugen existing-target ownership rules. Comparing only airborne status would be incorrect.
- Within the native Abs(hitResult) == 1 branch (hit, reversal or type None), if the target was falling before or after contact, the per-source budget loses the character cost, or the projectile's separate air.juggle cost. Character cost resets even under NoJuggleCheck. Guard results, ghvset suppression and the HitOverride early return have separate flow and cannot be folded into an unconditional debit.
- Helpers can inherit parent/root budgets and update their target lists. Projectile contacts have their own consumers and cannot be treated as identical Helper contacts.
- Ikemen state-owner version resets cost outside attacking move type during the native action phase; Mugen does not perform that reset. Native target/recovery cleanup controls budget lifetime.

Next implementation must connect actual character/Helper/projectile candidate selection and accepted-contact paths, resource ownership and phase resets, not merely add a query field or subtract a value in an isolated test. Source import, expression/default rules, redirected/global-provider units, simultaneous contacts, pause/hitpause and version-specific executable fixtures remain required. The broader controller/parameter objective remains active.
