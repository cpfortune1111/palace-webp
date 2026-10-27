# TargetBind — implementation in progress

Reference: Ikemen GO cb56d73badb322f3725257c2e8cfd157b2c3989d, bytecode.go targetBind and char.go targetBind/setBindToId/updateBinding.

The new controller module evaluates caller ID/index/time/pos/redirectid, native default time 1 and zero XYZ, float32 caller-to-redirect scaling and cumulative per-target scaling. Unit tests pass for these calculations and target selection. Native targetBind mutates its position variables between targets; tests deliberately preserve that behavior.

The shared dispatcher now routes TargetBind through real target selection instead of the old throw-only branch. A separate binding map retains live owner IDs, updates root/helper positions and world velocities, synchronizes P1 reaction/global storage, prevents mutual binding, clears on round initialization and advances finite lifetimes once per combat tick while respecting binder pause. Zero time clears; negative time remains indefinite. Unsupported nonzero depth on a 2D victim fails explicitly. Baseline regression is running in outputs/controller-target-bind-baseline-browser.log.

Baseline browser regression passed with exit code 0 in outputs/controller-target-bind-baseline-browser.log. TargetDrop now removes a matching controller binding by live owner ID. Actual fixture verifies ID/index selection, immediate P2 position/velocity, owner motion/facing, indefinite duration and TargetDrop release. Fresh regression is running in outputs/controller-target-bind-actual-browser.log.

Actual binding/TargetDrop regression passed with exit code 0 after the fixture cleared its inherited P1 reaction before setting binder coordinates. Root finite bindings now release to own 5050 when the binder is missing or receives a same-tick hit; negative bindings retain native finite-only release behavior. Helper SelfState release fails explicitly rather than pretending compatibility. Fresh regression is running in outputs/controller-target-bind-release-browser.log; actual release fixtures remain pending.

Release-baseline regression passed with exit code 0 in outputs/controller-target-bind-release-browser.log. The actual binding fixture now additionally binds P1 to redirected P2, marks P2 hit on the current combat tick and verifies P1 releases to own 5050. It also tests missing binder release for P2 to own 5050, restoring custom-state/animation owners afterward. Fresh regression is running in outputs/controller-target-bind-root-release-browser.log.

Actual root release regression passed with exit code 0 in outputs/controller-target-bind-root-release-browser.log. GetHitVar(isbound) now checks current incoming attacker identity against controller owner ID or snap binder key, retaining true during deferred zero-time expiry. Unit tests caught and fixed undefined identity pairs incorrectly matching. This is not complete native buffered incoming-ID parity. Fresh baseline regression is running in outputs/controller-target-bind-query-browser.log; actual query fixtures remain pending.

Query-baseline regression passed with exit code 0 in outputs/controller-target-bind-query-browser.log. The actual fixture now evaluates GetHitVar(isbound) while P2 is bound to its incoming attacker and after TargetDrop, expecting 1 then 0. Fresh regression is running in outputs/controller-target-bind-query-actual-browser.log.

Actual isbound/TargetDrop query regression passed with exit code 0 in outputs/controller-target-bind-query-actual-browser.log. The fixture now simulates deferred expiry by setting the live binding timer to zero, verifies isbound remains 1 before the binding update, then becomes 0 afterward. This proves storage/query clearing, not the full native timer schedule. Fresh regression is running in outputs/controller-target-bind-expiry-browser.log. Unit tests additionally cover NaN axis preservation and depth-enabled coordinates/velocity, with explicit failure for nonzero depth on 2D actors.

Deferred expiry/query regression passed with exit code 0 in outputs/controller-target-bind-expiry-browser.log. Helper runtime definition lookup now falls back to its own complete state table, and exposes the existing state-entry operation for TargetBind release; the explicit helper-release rejection has been removed. Baseline passed with exit code 0 in outputs/controller-target-bind-helper-release-baseline.log.

An actual spawned-helper fixture manually registers the live helper target, binds it through TargetBind, marks P2 binder hit and expects removal of its binding plus own state 5050/time 0/moveType H. This proves entry, not helper collision acceptance or the complete fall-state trajectory. Fresh regression is running in outputs/controller-target-bind-helper-release-actual.log.

Source throw inspection found its incoming-hit metadata omitted attacker actor identity and contact tick. The throw path now retains both, allowing binding identity queries and current-hit release logic to use the same metadata as ordinary hits. Actual spawned-helper release regression passed with exit code 0 in outputs/controller-target-bind-helper-release-actual.log; metadata baseline regression is running in outputs/controller-target-bind-throw-metadata.log.

Throw-metadata baseline regression passed with exit code 0 in outputs/controller-target-bind-throw-metadata.log. An actual fixture now calls the source-throw path with controlled valid state transfers, verifies incoming attacker identity/contact tick, then selects its real target through TargetBind and checks isbound. This tests throw plumbing, not a complete character throw animation trajectory. Regression passed with exit code 0 in outputs/controller-target-bind-throw-actual.log.

Pending: full character throw/release/query trajectories and helper fall trajectory, exact native timing/scale/NaN handling, helper/system binding interaction and buffered getHitVar(isbound) identities. TargetBind remains partial and uncertified; do not count policy tests as full implementation.

