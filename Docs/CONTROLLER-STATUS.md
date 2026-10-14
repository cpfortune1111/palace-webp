# Coverage accounting checkpoint — 0.24.99

Reference inventory: CONTROLLER-AUDIT.md, pinned Ikemen GO cb56d73badb322f3725257c2e8cfd157b2c3989d.

Additional GetHitVar query-name audit: 89 native names/aliases, 10 absent name dispatches as of this checkpoint. All recognized query rows remain semantically uncertified; this separate query inventory does not alter controller certification counts or prove overall parameter completion.

| Metric | Count | Meaning |
| --- | ---: | --- |
| Controller rows | 163 | Inventory, not completed implementations |
| Fully certified controller rows | 0 | No row currently proves all native semantics |
| Pending certification rows | 163 | Includes partially implemented and unimplemented work |
| Controller/parameter candidates | 2,158 | Same parameter in different controllers counted separately |
| Distinct candidate parameter names | 597 | Not a count of implementation tasks |
| Exact unfinished parameter count | Unknown | Requires per-parameter implementation/evidence ledger |

Counts exclude placeholder text for Null, LoadState and SaveState. Dynamic names and delegated parsers still need review: 2,158 is not a proven complete specification total. Fully certified means defaults, expressions, redirection/ownership, pauses/persistence, native behavior and executable regression evidence all pass. Existing runtime paths and narrow fixtures do not automatically certify a whole controller.

Version 0.24.94 adds partial actual three-axis HitDef component defaults and caller-expression finalization. Original Mugen special-value semantics, inherited persistence, fall defaults, XY/source-coordinate ownership and native compiler/version fidelity remain pending. Recent partial work and gaps are recorded in HIT-BY-INTEGRATION-WIP.md and HIT-OVERRIDE-INTEGRATION-WIP.md. Retain the full original objective; establish a per-parameter evidence ledger and continue native timing/collision/helper semantics. No overall completion percentage is asserted.
