# Target point controllers — partial integration

Reference: Ikemen GO cb56d73badb322f3725257c2e8cfd157b2c3989d, bytecode.go targetDizzyPointsAdd/targetGuardPointsAdd and char.go targetDizzyPointsAdd/targetGuardPointsAdd/computeDamage/point setters.

The shared WEB dispatcher selects real target IDs/index with caller-evaluated value, absolute and redirectid. Native computation uses attack multiplier 1, defence unless absolute, positive minimum one, nonlethal life-based limits and signed rounding. Dizzy targets exclude dizzy additions; respective damage assertions exclude writes. Existing point adapters enforce feature switches and round damage gating.

Semantic tests passed. Baseline combat regression passed before the actual target-point fixture was added. Actual-root dizzy/guard resource and dizzy exclusion regression passed with exit code 0 in outputs/controller-target-points-actual-browser.log. The fixture now additionally disables guard points and forces the round no-damage gate, verifying neither permits mutation; fresh regression is running in outputs/controller-target-points-gates-browser.log.

Feature-disabled and round-protected actual guard-point writes passed with exit code 0 in outputs/controller-target-points-gates-browser.log. The latest fixture additionally sets both native damage-exclusion assertions and restores the original assertion set afterward; outputs/controller-target-points-assertions-browser.log is running. Integer negative-zero normalization now matches native integer results; zero, unmatched IDs, missing redirected owners and signed saturation tests pass.

Damage-exclusion assertion regression passed with exit code 0 in outputs/controller-target-points-assertions-browser.log. The fixture now additionally redirects to P2's real target list, selects hit ID 88/index 0, evaluates P1's variable expression, mutates P1 guard points and verifies an unmatched ID leaves P2 unchanged. Fresh regression passed with exit code 0 in outputs/controller-target-points-redirect-browser.log.

Pending: full actual version/helper matrix, helper-victim collision ownership, native final-defence and state-character version fidelity, compiler-time validation, inventory certification and publication. Neither controller is fully certified.

