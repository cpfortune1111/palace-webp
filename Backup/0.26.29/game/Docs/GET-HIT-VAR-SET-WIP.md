# GetHitVarSet — partial native integration

Tools/audit-get-hit-var-set.mjs compared the supplied pinned compiler reference with exported dispatcher schema: 48 compiler parameter names and 48 dispatcher names match exactly, including redirectid (47 payload names). This is name coverage only, not semantic certification. The audit does not upload the native reference source. Actual mixed-localcoord redirected write/query roundtrip and HitDef contact attribute fixtures passed complete regression with terminal exit code 0 in outputs/controller-get-hit-contact-roundtrip.log.

The additional scalar source setter-to-query fixture and complete browser regression passed with terminal exit code 0 in outputs/controller-get-hit-scalar-actual.log.

Initial integration complete browser regression passed with terminal exit code 0 in outputs/controller-get-hit-var-set-integration.log. Later actual source fixtures are recorded separately; the baseline regression alone does not certify this controller.

Actual source/root/helper query and velocity-consumption fixtures subsequently passed with complete browser regression, terminal exit code 0 in outputs/controller-get-hit-var-set-actual-fixed.log. Root movement friction now also reads authoritative fallback storage; the expanded consumption fixture and complete regression passed with terminal exit code 0 in outputs/controller-get-hit-var-set-consumers.log.

Reference: pinned Ikemen GO cb56d73badb322f3725257c2e8cfd157b2c3989d compiler-functions.go getHitVarSet and bytecode.go getHitVarSet.Run. The controller is an Ikemen extension, not an original MUGEN controller.

The new shared dispatcher writes the pinned compiler's payload entries in compiler order, including attr, chainid, friction, integer/boolean fields, fall/envshake fields, identity fields and XYZ velocities/accelerations. Redirected expressions evaluate in caller context; velocity/acceleration/fall velocity and shake amplitude use caller-to-recipient local-scale conversion. Missing redirected actors skip subsequent expressions. Clock fields synchronize helper/P2/current P1 reaction storage.

Important pinned discrepancy: source hitcount is compiled to the hittime bytecode slot, not hitcount. This implementation reproduces that pinned behavior explicitly; a corrected documented-behavior profile remains pending. ground.animtype has a bytecode enum but no source compiler entry or runtime assignment and is not claimed as a working parameter. Fall is compiled as an integer before boolean conversion. Shake amplitude is compiled as an integer before float-scaled/truncated storage.

Focused module tests pass type conversion, attribute mask, redirection, scaling and hitcount/hittime alias ordering. The actual redirected root fixture initially failed because GetHitVar read only actor.getHit while the setter correctly wrote resource fallback storage. The query path now reads the same authoritative fallback storage; this fixes a real dispatch/consumption gap rather than accepting a detached setter-only test. Actual root/helper fixtures exercise expression evaluation, fallback storage, friction/velocity queries, clock synchronization and helper VelAdd consumption.

Release 0.24.96 remains partial and not certified: root idle clocks, complete GetHitVar query coverage, fall shake presentation, metadata/version profiles, reset/persistence and ownership semantics. No ignored parameter is counted as fully integrated.

Additional scalar GetHitVar consumers now support chainid (native non-positive hitid clamps to zero), playerno/teamside (internal zero-based identity becomes one-based query), playerid/projid/redlife, dizzy/guard points, fallcount, down recovery and fall envshake scalar fields. Focused tests pass type/identity semantics; actual shared source setter-to-query fixtures pass with complete regression (outputs/controller-get-hit-scalar-actual.log, terminal exit code 0). Redirected query scaling, attr/flag string-or-mask grammar, complete HitDef production/defaults and presentation remain pending; storing a field does not certify its downstream gameplay effect.
