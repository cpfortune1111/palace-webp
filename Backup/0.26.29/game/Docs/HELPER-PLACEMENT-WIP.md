# Helper redirect and placement consumers (partial)

Reference: Ikemen GO cb56d73badb322f3725257c2e8cfd157b2c3989d, helper.Run/getRedirectedChar in bytecode.go; helperInit/helperPos, leftEdge/rightEdge/gameWidth in char.go; playerID in system.go and Helper field compilation in compiler_functions.go.

The actual Helper dispatcher now resolves redirectid first. Invalid/destroyed/disabled/projectile recipients are excluded by the main character lookup; no later Helper expressions run when the target is missing. Other expressions continue using the caller's context, while player, parent, inherited palette/size/life and target StateDef belong to the recipient. Root and normal-Helper recipients use the same spawn path. H950 suppression and the existing Moon light-column ground override remain game-specific exceptions.

Placement consumes float32 XYZ pos and typed facing/pausemovetime/supermovetime expressions. Caller/recipient local-scale ratios are applied once before conversion to world units. Postypes p1/p2/front/back/left/right/none follow the pinned Helper rules: p2 follows the current opponent's facing; front/back select zoomed screen edges and face the parent's direction; left/right/none start facing right unless the facing parameter flips them. Nonpositive facing values only flip when negative. With no P2, the zero position and initial facing remain. Position is installed before StateDef overrides.

Helper negative pause allowances are nonzero native Char allowances and remain movable; projectile -1 allowance likewise remains movable. Zero still blocks. This does not certify the existing positive/global clock algorithm or modified movement-time overrides.

Evidence: 84 independent position/facing/scale cases, missing-P2 and invalid-input checks; 168 real mixed-localcoord, caller-player, root/Helper-recipient, facing and postype combinations verify actual inheritance, original-caller RHS side effects, active lookup, pause fields and drawing. Existing Helper entry, Projectile ownership/events and battle gates remain separate regressions.

Pending: full Helper compiler/RHS ordering across all fields, dynamic native coordinate/provider edge cases, exact P2/edge/native phase fidelity, remaining constructor families, modified move-time edge cases and first-body/child-registration timing. The pre-existing offset fallback is a compatibility extension, not a documented Helper parameter. No whole-Helper certification changes. Character recoloring remains excluded; gameplay palette effects remain. No original assets or new media are added.
