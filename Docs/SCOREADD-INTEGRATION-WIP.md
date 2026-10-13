# ScoreAdd — partial integration

Pinned reference: Ikemen GO cb56d73badb322f3725257c2e8cfd157b2c3989d, bytecode.go scoreAdd and char.go scoreAdd.

The old direct score branch ignored redirectid, NoScore and float32 accumulation. The shared dispatcher now resolves redirectid in caller context, evaluates float32 value, respects NoScore and uses the native score addition path. Unlike TargetScoreAdd, ScoreAdd itself does not exclude normal helpers by helper type, matching native scoreAdd.

Unit tests pass for redirected writes, precision, NoScore, missing redirected actors and missing required value. Baseline browser regression passed with exit code 0 in outputs/controller-scoreadd-baseline-browser.log. A new actual-root fixture verifies redirected P2 score 0.25, caller-variable P1 score 1.5 and redirected NoScore exclusion; full regression is running in outputs/controller-scoreadd-actual-browser.log.

Actual root/controller regression passed with exit code 0 in outputs/controller-scoreadd-actual-browser.log. A spawned normal-helper fixture now executes ScoreAdd directly and verifies 0.5 belongs to its root, then verifies helper NoScore excludes another addition. Fresh regression passed with exit code 0 in outputs/controller-scoreadd-helper-browser.log.

Pending: complete teamside/score lifecycle and query compatibility, compiler/version certification and publication. Not fully certified.

