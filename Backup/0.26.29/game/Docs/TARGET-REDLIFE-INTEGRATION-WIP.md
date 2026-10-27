# TargetRedLifeAdd — partial integration

Reference: Ikemen GO cb56d73badb322f3725257c2e8cfd157b2c3989d, bytecode.go targetRedLifeAdd and char.go targetRedLifeAdd/computeDamage/redLifeAdd/redLifeSet.

Caller ID/index/value/absolute/redirectid select real targets. Positive caller-MUGEN additions force absolute, while damage computation uses victim defence and state-version nonlethal rules, attack multiplier 1 and life bounds. Native computeDamage receives the signed addition directly; negative additions are not bounded as positive damage. Red-life setters clamp to current life/lifeMax, clear dead actors and respect enabled/round gates. NoRedLifeDamage excludes targets.

Unit semantics and baseline browser regression passed. Actual root fixture checks P2 red life 800 to 780, redirected P1 800 to 770, and assertion exclusion preserving 780. Full regression passed with exit code 0 in outputs/controller-target-redlife-actual-browser.log. The fixture now independently disables the feature and forces round protection after removing the assertion, so each gate must independently preserve red life; fresh regression passed with exit code 0 in outputs/controller-target-redlife-gates-browser.log.

Additional unit tests pass for zero/missing/unmatched targets, caller-versus-victim version ownership and dead-victim MUGEN versus Ikemen nonlethal calculation. These prove calculation behavior, not complete native alive/state-version or helper collision fidelity.

Pending: full version/feature/round/helper matrix, native alive/final-defence fidelity, team life sharing, compiler-time validation, inventory certification and publication. Not fully certified.

