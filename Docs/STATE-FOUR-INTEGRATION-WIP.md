# State -4 across global pause — partial integration

Reference: Ikemen GO cb56d73badb322f3725257c2e8cfd157b2c3989d, char.go actionPrepare/actionRun, bytecode.go StateBlock.Run and compiler.go negative-state Persistent handling.

Native actionRun executes -4 before its global-pause gate. Unlike -3/-2/-1, -4 does not require Helper keyctrl permissions or own-state ownership. Hitpause still applies each controller's IgnoreHitPause rule, and destroyed/disabled actors must not execute.

The lifecycle runtime now exposes a single negative-state execution entry and safely accepts absent controller arrays. Root processing invokes -4 before the existing pause gate. Helpers run -4 during global pause without advancing ordinary state execution, and on active ticks after their existing per-frame preparation so new modifiers are not immediately erased by preparation. Hitpaused Helpers run -4 through the existing per-controller IgnoreHitPause gate. Disabled Helpers skip execution. Existing -3/-2/-1 eligibility remains separate.

Semantic tests verify State -4 tagging, optional arrays and hitpause filtering. The actual browser fixture initializes a Helper, globally pauses the match for two ticks, checks root/Helper -4 counters while ordinary state/global counters remain frozen, resumes ordinary execution and distinguishes hitpause-filtered counters and disabled-Helper behavior. The actual fixture and complete browser regression passed with terminal exit 0 in outputs/controller-state-four-browser.log, including earlier independent command-buffer, negative-state and simultaneous Saturn super checks.

Pending: complete native input/action preparation, newly created Helpers during pause, all modifier consumers, root disabled-state behavior beyond this hook, exported -4 arrays for every source format, deferred transitions, global ordering across actors and complete version fidelity. This is not full scheduler/controller certification. Zero complete-controller count changes; this checkpoint is included in 0.25.20, with deployment verified separately.
