# HitDef keepstate — partial independent integration

Actual Helper collision against a non-keeping HitOverride slot, retained state/control/movement/prior data, next-frame flag clear and one-hit consumption passed complete browser regression with terminal exit code 0 in outputs/controller-hitdef-keepstate-helper-collision-actual.log.

Actual P1/P2 non-intercepted hit callbacks and prior-data/control/movement/flag fixtures passed complete browser regression with terminal exit code 0 in outputs/controller-hitdef-keepstate-live-roots-fixed.log. An additional real Helper collision fixture now supplies a non-keeping HitOverride slot while the source HitDef keeps state, proving the two policies are not merely one synthetic flag; its expanded regression is being observed separately.

Initial complete browser regression passed with terminal exit code 0 in outputs/controller-hitdef-keepstate-integration.log. The expanded actual P1/P2 callback fixture initially failed P1 prior-xvel preservation: the contact merge read only originalDefender.getHit while idle P1 stores authoritative data in its resource fallback. The merge now reads the same fallback as GetHitVar. The assertions remain strict for state/control/movement/data/independent-flag preservation; the fixed expanded regression is being observed separately.

Pinned HitDef KeepState differs from HitOverride keepState. It suppresses the ordinary reaction-data/state replacement while updating default identity/type metadata, damage and hitshake. It does not imply selecting a HitOverride slot. The shared source compiler now evaluates HitDef.keepstate separately; contact marks its independent result policy and preserves prior reaction/velocity data.

Root state application has an independent keepstate path retaining the live state and current reaction rather than synthesizing a HitOverride. Helper override recipients also avoid the ordinary transition when the source HitDef flag is set. GetHitVar.keepstate reads the independent flag, and the finish-phase hook clears it. Focused data-preservation tests pass; full regression and actual live state/query trajectories are still required.

Unpublished and partial: deferred damage-ledger timing, full native untouched-field defaults, simultaneous HitOverride precedence, custom throw/P1StateNo routing, globally paused/disabled clocks and complete helper/general collision paths remain Pending. Existing flag/state hooks are not full certification.
