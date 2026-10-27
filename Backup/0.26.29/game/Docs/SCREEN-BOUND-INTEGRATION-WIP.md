# ScreenBound — in progress

Reference: Ikemen GO cb56d73badb322f3725257c2e8cfd157b2c3989d, compiler_functions.go screenBound, bytecode.go screenBound, char.go flag reset/xScreenBound/camera tracking.

Controller module evaluates caller value/movecamera/stagebound/redirectid. Native controller defaults value and camera axes false; omitted stagebound retains current flag. Actor defaults differ: roots/player helpers track and screen-clamp, normal helpers do not; stagebound starts true. Pure interval policy distinguishes signed screen-edge offsets from absolute stage limits.

Shared dispatch now writes root/helper flags and removes the no-op branch. Horizontal/vertical camera tracking filters live actors by their respective camera flags. Root/helper clamps distinguish screen from stage limits and consume Width edge offsets; existing explicit stage-position clamps respect stagebound. Unpaused root/helper ticks reset flags, with hitpause retention and player-helper defaults. Camera roots read established global/live coordinates rather than stale reaction snapshots. Baseline regression is running in outputs/controller-screen-bound-baseline.log and predates this final coordinate-read adjustment.

Baseline regression passed with exit code 0 in outputs/controller-screen-bound-baseline.log. Actual fixture now isolates live entities, verifies stage-only clamp, fully unbounded X, redirected P2 screen-only clamp, excluded actors not moving the camera, and independent horizontal/vertical tracking. Fresh regression after the root-coordinate adjustment is running in outputs/controller-screen-bound-actual.log.

Actual camera/bounds regression passed with exit code 0 in outputs/controller-screen-bound-actual.log. Root fixture now verifies hitpause retains disabled bounds and ordinary reset restores default flags. An isolated redirected normal-helper fixture verifies screen/stage/camera flags retain hitpause then reset to normal-helper defaults. Fresh regression passed with exit code 0 in outputs/controller-screen-bound-helper-pause.log.

Pending: full player-helper/clamp/axis matrix, complete native camera/zoom/standby/teams/localcoord and reset timing fidelity. Partial, not fully certified from policy tests alone.

