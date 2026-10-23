# BindToRoot / BindToParent — in progress

Latest unpublished integration correction: normal first-generation Helper creation uses a null parentKey, which the prior BindToParent adapter failed to resolve. Shared live ancestry lookup now maps that representation to the owning root, preserves nested immediate parents and explicit root keys, and rejects destroyed Helper parents. Actual P1/P2 fixtures cover normal Helper dispatch, both generations' binding owners and ParentVarSet/RootVarSet writes (outputs/parent-controller-browser.log). Earlier nested-helper evidence did not cover this first-generation representation. Full coordinate/version/compiler/timing fidelity remains Pending.

Reference: Ikemen GO cb56d73badb322f3725257c2e8cfd157b2c3989d, bytecode.go bindToRoot/bindToParent, char.go root/parent/setBindTime/updateBinding.

The new shared controller module evaluates caller time/XYZ/facing/redirectid, default time 1/zero offsets and redirected float32 local scaling. Positive/negative facing sets relative direction; facing zero or omission retains the existing flag. Root/parent selection is delegated to actor ownership adapters. Root characters have no root/parent in the pinned native lookup.

Shared dispatch now selects live helper root/parent ownership, stores persistent facing flags and uses the shared binding map. The old helper-only entity-time expiry/facing-forcing branch was removed. Ordinary bindings retain velocity, honor own-actor pause rather than binder pause, and clear immediately when finite time reaches zero. Zero-time registration clears the facing flag; root characters have no parent/root. Baseline regression is running in outputs/controller-family-bind-baseline.log and predates the final facing-reset edit.

Baseline regression passed with exit code 0 in outputs/controller-family-bind-baseline.log. A new actual nested-helper fixture distinguishes root versus parent position, verifies relative facing without changing world velocity, and verifies time zero removes binding and resets its facing flag. Fresh regression after the facing-reset edit is running in outputs/controller-family-bind-actual.log.

Actual nested root/parent/facing regression passed with exit code 0 in outputs/controller-family-bind-actual.log. The fixture now redirects a root controller to the child helper, verifies helper hitpause retains duration 2, resumes to 1 and immediately removes the ordinary binding at 0. Inspection found ordinary expiry did not reset bindFacing; shared clearing now resets it and drops helper binding references. Fresh regression passed with exit code 0 in outputs/controller-family-bind-clock.log.

Pending: complete native shared-bind identity/scale/physics/persistence timing and certification. These paths remain partial, not certified from policy tests alone.
Native compiler parameter order is now explicitly tested as redirectid, time, facing, position axes. Final post-order-change regression passed with exit code 0 in outputs/controller-family-bind-final.log.

