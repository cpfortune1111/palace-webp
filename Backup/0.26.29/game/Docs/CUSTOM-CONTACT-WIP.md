# Custom contact and Target redirection — 0.25.34 partial implementation

Reference: Ikemen GO cb56d73badb322f3725257c2e8cfd157b2c3989d, char.go targetTrigger and accepted-contact state changes; compiler.go Target arguments and OC_nordrun; bytecode.go OC_target. This is partial implementation evidence, not controller certification.

The root-only shortcut for HitDefs containing both p1stateno and p2stateno has been removed. Accepted contacts now use the normal damage, power, pause, facing, hit-count, HitOnce, juggle and custom-state consumers. Actual root fixtures cover both root slots, airborne contacts, and immediate MUGEN versus deferred Ikemen power delivery.

Target and Target(id,index) now select live valid targets, matching HitID and index. Missing selections skip payload evaluation. Indexed arguments use the original expression caller. Parser, isolated semantic and actual root/Helper fixtures exercise this behavior. Full OC_run/IfElse/Cond scope handling and native Undefined typing remain Pending.

Verification:
- controller-custom-contact-browser-3.log completed with exit 0, including actual Target redirection and the full existing browser suite.
- Original Moon S800 throws against Venus completed in both root slots: all four damage events, target binding, release, own-state recovery and landing; victim life 800. The default check-custom-throws.cjs gate runs these two available original-program cases; --include-missing-assets additionally runs the Jupiter diagnostic and still fails.
- Original Jupiter S1300 entered S1051/S1052 but failed its expected binding/damage check. The archived AIR and exported full bundle contain no A1051, A1055, A1060 or A1061. This remains a failing source-asset case, not a passing regression. Logs controller-original-custom-throws-3/4/5.log retain the failure. No source animation was invented or silently substituted to turn the diagnostic green.
- Authentic mixed-character stepping exposed missing Venus engineVersions metadata. The Venus compiler now imports compatibility from its archived DEF, and the payload carries MUGEN 1.0 / Ikemen 0.0.0. No inferred default was added to the runtime version validator.
- Character preparation now includes StateDef animation expressions in its existing variant preloading pass. This does not synthesize absent source actions or constitute arbitrary expression completeness.

The Node sweep passes 176/181 with the same five existing harness setup failures. Venus compatibility tests and an actual compiler export also pass. Versioned browser and original-program release gates and deployment are verified separately; this ledger does not itself prove a deployment.

0.25.35 adds two native gethit-dependent rejection gates to the live accepted-contact paths: an already-hit source cannot activate P1StateNo, and an already-thrown recipient rejects another same-pass contact. Ordinary sources/recipients and later passes remain independent. HIT-CONTACT-PHASE-WIP.md records actual evidence and the remaining native phase boundaries; this is not a complete ghvset/stchtmp implementation.

Full native custom-state phases, ghvset ordering, Helper victims, reversal ordering, arbitrary dynamic animation loading, version parity and every controller/parameter remain Pending. No controller is certified complete.
