# Helper negative-state execution — partial integration

Pinned reference: Ikemen GO cb56d73badb322f3725257c2e8cfd157b2c3989d, char.go actionRun and command/keyctrl gating.

Normal Helpers execute -3 with keyctrl flag three and own state ownership, -2 with flag two, and -1 with flag one and own state ownership. Player-type Helpers also qualify for -3/-2 without these flags. Eligibility is checked again before each negative state, so a changed ownership marker can affect later phases.

The Helper runtime now executes eligible -3/-2/-1 controller arrays before the current state. It uses existing globalControllers/playerCommands data and recomputes each controller's live Helper context. Global controllers do not consume the current-state persistence schedule or once indexes. During hitpause only negative controllers with IgnoreHitPause execute. DestroySelf exits the remaining Helper processing.

Focused policy tests cover all permission combinations, player type and foreign-owner suppression. An actual fixture distinguishes default Helpers, individual flags one/two/three, all three flags and player-type Helpers by writing ordered digits. Two ticks demonstrate negative-state Persistent=0 does not suppress later global execution; a paused Helper runs only the IgnoreHitPause -3 controller without advancing state time. The actual fixture and complete browser regression passed with terminal exit 0 in outputs/controller-helper-negative-states-browser.log, including independent Helper/root input and simultaneous Saturn super checks.

Pending: State -4 and global-pause placement, complete numeric state-provider identity, native deferred state changes, other keyctrl-flag behavior, AI and common movement, exported negative-state completeness and full scheduling/version fidelity. This does not certify the Helper controller or all keyctrl semantics. Zero complete-controller count changes; this checkpoint is included in 0.25.19, with deployment verified separately.
