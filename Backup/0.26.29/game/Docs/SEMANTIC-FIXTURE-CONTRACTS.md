# 0.25.45 — Restored semantic fixture contracts

Release checkpoint: all 189 Node tools pass with no failures, and the complete combined browser suite passes. This does not certify every native controller/parameter; deployment verification and the separate legacy browser fixture remain separate scopes. Chronological pre-release observations are retained below.

The five longstanding Node failures were investigated rather than silently suppressed. Production validation was not weakened to accommodate incomplete test doubles.

- check-entity-hit-count.mjs and check-entity-hit-once.mjs now provide the character engineVersions required by the real HitDef compiler. Each retains all original contact/count/guard/rearm assertions and additionally runs both MUGEN 1.1 and Ikemen 0.99 version fixtures.
- check-hit-power-runtime.mjs supplies its real compiler dependencies: character engineVersions and root identity/team-side lookup. All original power defaults, damage, caller constants and one-evaluation assertions remain unchanged.
- check-pause-cancel.mjs supplies engineVersions for projectile compilation. Independent pause windows, movement allowance, H950 suppression, projectile cancel animation and removal assertions remain unchanged.
- check-result-state-watchdog.mjs supplies the current result-runner adapters and executes the actual P1/P2 physics functions extracted from index.html, not an invented physics stub. Its old integration assertion required an airborne attack to remain S240 after landing; that is incompatible with native physics A and the no-KO-freeze requirement. The revised test requires both actual physics consumers to enter S52 at y=0, rejects any premature S0 reset, and retains the original long-animation/two-loop/infinite/independent-player watchdog and KILL/1HP assertions.

Individual logs: outputs/check-entity-hit-count-fixture-metadata.log, outputs/check-entity-hit-once-fixture-metadata.log, outputs/check-hit-power-runtime-fixture-metadata.log, outputs/check-pause-cancel-fixture-metadata.log and outputs/result-watchdog-live-physics.log. All five individual tools exit 0. The later two-version entity checks also exit 0. This proves the restored fixture scopes, not full native action equivalence or any whole-controller certification. The separate legacy browser runtime suite still has unreviewed Opponent/random-context fixtures and is not counted passing.

Fresh complete Node sweep: 189/189 pass, zero failures (outputs/node-semantic-sweep-fixture-contracts/summary.json; process exit 0). The combined animation/assignment browser suite also exits 0 (outputs/reaction-animation-full-browser.log). Neither result certifies all native controllers/parameters, and the current changes have not yet been released.
