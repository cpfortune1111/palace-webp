# PlayerPush — in progress

Reference: Ikemen GO cb56d73badb322f3725257c2e8cfd157b2c3989d, compiler_functions.go playerPush, bytecode.go playerPush, char.go reset/push collision.

New controller module evaluates caller value/priority/redirectid and parses affectteam Enemy/Friend/Both using native first-letter syntax. Native requires at least one of value/priority/affectteam. Collision policy preserves strict enemy filtering and permissive partner filtering; priority determines which actor is displaced, equal priority shares displacement.

Shared dispatch now writes root/helper enabled/priority/team flags and replaces the old timestamp controller branch. Root collision consults team masks and priority displacement shares while preserving equal-priority compensation. Ordinary unpaused ticks reset priority/team/enabled; hitpause retains them. Helper default enable checks player type and round state through a new runtime callback. Baseline regression is running in outputs/controller-player-push-baseline.log and predates the final helper-round default edit.

Baseline passed with exit code 0 in outputs/controller-player-push-baseline.log. Actual root fixture now verifies higher-priority P1 remains still while P2 moves, redirected higher-priority P2 remains still while P1 moves, friendly-only enemy filtering and redirected disable. Fresh regression after helper-round default edits is running in outputs/controller-player-push-actual.log.

Actual root priority/team/disable regression passed with exit code 0 in outputs/controller-player-push-actual.log. Grounded helper/root and helper/helper pairs now participate in real collision resolution, using team masks, priority shares, original-character ground size constants and Width modifiers. The helper pass runs once per combat tick after entity stepping and before binding reconciliation, commits P1 reaction position and clamps live actors. Helper participation no longer inherits the root's legacy disable timestamp. Baseline regression is running in outputs/controller-player-push-helper-baseline.log.

Helper-collision baseline passed with exit code 0 in outputs/controller-player-push-helper-baseline.log. New actual redirected helper fixture verifies enemy displacement, friendly enemy exclusion, permissive friend displacement, independence from root legacy disabled timestamp, hitpause retention and ordinary helper default reset. It uses isolated entities and a temporary empty own state. Fresh regression is running in outputs/controller-player-push-helper-actual.log.

Actual helper enemy/friend/hitpause regression passed with exit code 0 in outputs/controller-player-push-helper-actual.log. Root fixture now additionally verifies hitpause retains priority 4/team Enemy/enabled, then ordinary reset restores priority 0/team Enemy and round-dependent default enable. Fresh final regression passed with exit code 0 in outputs/controller-player-push-final.log.

Pending: full native boxes/air/weights/corner/round/timing fidelity. Ground-only helper collision is partial, not full native collision certification.

