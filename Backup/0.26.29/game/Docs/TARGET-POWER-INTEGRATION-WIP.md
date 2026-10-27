# TargetPowerAdd integration

Pinned reference: Ikemen GO cb56d73badb322f3725257c2e8cfd157b2c3989d bytecode.go targetPowerAdd and char.go targetPowerAdd, isPlayerType, powerOwner and setPower.

Local unpublished policy evaluates caller value/id/index/redirectid, filters the actual target list, excludes normal helpers and accepts native player-type helpers (type 2). Power writes go through the target's power owner, saturate before clamping to its maximum, honor a round-end lock and optional global maximum-power mode. Zero exits without writes. Unit tests cover redirection/filtering, helper eligibility, shared owner, positive/negative limits, locks and required value.

Local runtime integration now dispatches TargetPowerAdd through the shared controller path and writes the target's actual root power adapter. Normal helpers are excluded; player helpers are recognized through type metadata/retained helpertype parameters. Existing round-end power locking is reused. An actual-root fixture verifies P2 addition, redirected/indexed P1 subtraction and maximum/zero bounds. A test-local duplicate variable name was corrected without changing expected results; its full regression rerun is in outputs/controller-target-power-browser.log.

Pinned helpertype parsing confirms normal=1, player=2 and projectile-prefix=3, so only player helpers qualify for TargetPowerAdd. The root resource adapter's power maximum now comes from its own character profile rather than a current custom-state owner, matching powerOwner's root storage. This follow-up was added during the current run and needs fresh regression.

The baseline actual-root power regression passed (outputs/controller-target-power-browser.log). Helper spawning now records helperType using pinned CNS normal/player/projectile-prefix parsing, including invalid-type rejection; the pure parser also tests strict ZSS projectile spelling. Existing helper-hit unit regressions pass.

A dedicated fixture spawns normal/player/projectile-prefix helpers from a real helper source state, registers them as selected targets and invokes actual TargetPowerAdd. It expects only the player helper to add 50 to its own root's pool, leaving the controller owner's pool unchanged. This is a target-controller eligibility fixture, not proof of helper-victim collision support. Its full regression is running in outputs/controller-target-power-helper-browser.log and also covers the own-character power-maximum follow-up.

The root fixture also enters the existing post-round power-lock state, attempts TargetPowerAdd and verifies power stays 123. The fixture restores its lifecycle round state afterward. Fresh regression on 2026-10-13 passed with exit code 0 (outputs/controller-target-power-final-browser.log), including root writes, redirection, limits, spawned helper eligibility and simultaneous Saturn supers. Tools/check-target-power.mjs also passed. This proves the tested paths only, not full native compatibility.

Pending: full player-helper gameplay/ownership and helper-victim collision semantics, native team power sharing/global maximum-power mode, exact intro-based lock timing, compiler-time validation, certification and publication. This controller remains partial.

Additional semantic tests on 2026-10-13 passed: each eligible target independently adds to a shared power owner (two targets add twice), index-limited selection, missing redirected actor, zero-addition short circuit, signed 32-bit saturation before resource clamping, and post-round lock precedence over maximum-power mode. The latter mode is still only exercised through the controller API, not exposed as a complete game-wide option.

Separate 0.24.64 status batch: Actions run 38412848270 succeeded; page and status-controller module were verified.

PowerMax expression now reads the original character resource maximum instead of the current custom-state owner's profile. A browser fixture temporarily gives the custom-state owner a different maximum and verifies the expression retains the victim's original maximum. Full regression is being recorded in outputs/controller-powermax-owner-browser.log; publication remains pending.

