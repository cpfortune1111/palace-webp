# TargetScoreAdd — partial integration

Reference: Ikemen GO cb56d73badb322f3725257c2e8cfd157b2c3989d, bytecode.go targetScoreAdd and char.go targetScoreAdd/scoreAdd.

Caller value evaluates as float32; ID/index/redirectid are integers. Real target selection excludes normal/projectile helpers, admits player helpers, and respects NoScore. A new score-runtime native addition path rounds each current-round accumulation to float32 without changing the existing game scoring path; match totals receive its effective delta.

Semantic tests and baseline browser regression passed. Actual root fixture verifies P2 score 0.25, redirected caller-variable P1 score 1.5 and NoScore preserving P2 score. Full regression passed with exit code 0 in outputs/controller-target-score-actual-browser.log.

A new spawned normal/player/projectile helper fixture manually registers the live helper targets, verifies only the player helper adds to its root score, then verifies that helper's NoScore excludes another addition. This tests actual dispatch eligibility/ownership, not helper collision acceptance. Regression passed with exit code 0 in outputs/controller-target-score-helper-browser.log. Unit tests also cover negative score, round reset retaining match totals, match reset and missing/unmatched/ineligible targets.

Pending: actual helper eligibility/ownership, complete native team score ownership and score lifecycle/queries, invalid teamside, full caller/compiler validation and version certification. Not fully certified or published.

