# Coverage accounting checkpoint — 0.24.90

Reference inventory: CONTROLLER-AUDIT.md, pinned Ikemen GO cb56d73badb322f3725257c2e8cfd157b2c3989d.

| Metric | Count | Meaning |
| --- | ---: | --- |
| Controller rows | 163 | Inventory, not completed implementations |
| Fully certified controller rows | 0 | No row currently proves all native semantics |
| Pending certification rows | 163 | Includes partially implemented and unimplemented work |
| Controller/parameter candidates | 2,158 | Same parameter in different controllers counted separately |
| Distinct candidate parameter names | 597 | Not a count of implementation tasks |
| Exact unfinished parameter count | Unknown | Requires per-parameter implementation/evidence ledger |

Counts exclude placeholder text for Null, LoadState and SaveState. Dynamic names and delegated parsers still need review: 2,158 is not a proven complete specification total. Fully certified means defaults, expressions, redirection/ownership, pauses/persistence, native behavior and executable regression evidence all pass. Existing runtime paths and narrow fixtures do not automatically certify a whole controller.

Version 0.24.90 adds partial actual projectile geometry/cancellation with priority counters, team rules and stage-enabled depth, on top of 0.24.89 character coordinates. Projectile-to-character depth, ModifyProjectile, broader native ownership/timing and full parameter coverage remain pending. Recent partial work and gaps are recorded in HIT-BY-INTEGRATION-WIP.md and HIT-OVERRIDE-INTEGRATION-WIP.md. Retain the full original objective; establish a per-parameter evidence ledger and continue native timing/collision/helper semantics. No overall completion percentage is asserted.
