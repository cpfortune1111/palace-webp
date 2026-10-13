# Width — in progress

Reference: Ikemen GO cb56d73badb322f3725257c2e8cfd157b2c3989d, compiler_functions.go width, bytecode.go width, char.go width modifiers/reset/edge and player bounds.

New controller module evaluates caller edge/player/value/redirectid with float32 localcoord redirection. Missing second component defaults zero. Native compiler parses edge then player and only accepts value when neither explicit field is present; tests retain that precedence instead of treating all three as simultaneous overrides. Width is an additive modifier, not replacement of base character size.

Shared dispatch now writes actual root/helper modifier storage and removes the no-op branch. Root push/compensation consumes facing-aware additive player extents; screen clamping consumes signed edge offsets. Ordinary unpaused root/helper ticks reset modifiers while hitpause retains them. Player extents normalize reversed boxes; signed edge offsets remain unnormalized. Baseline regression is running in outputs/controller-width-baseline.log and predates final normalization edits.

Baseline passed with exit code 0 in outputs/controller-width-baseline.log. Actual root fixture now verifies additive width increases separation to -15/85, redirects edge offsets to P2, checks both facing-aware screen margins and resets unpaused modifiers. Fresh regression after negative-normalization edits is running in outputs/controller-width-actual.log.

Actual push/edge/reset regression passed with exit code 0 in outputs/controller-width-actual.log. Root fixture now verifies hitpause retains its modifiers before normal reset. A redirected helper fixture uses an isolated temporary own state and isolated live entity list, verifies value sets both modifier pairs, hitpause retains them and the ordinary helper tick resets them. Fresh regression passed with exit code 0 in outputs/controller-width-helper-pause.log.

Pending: full native character base boxes/helper collision/localcoord metadata and pause/reset timing. Existing base push sizes are preserved, not certified as all-character native boxes. Partial, not fully implemented/certified from policy tests alone.

