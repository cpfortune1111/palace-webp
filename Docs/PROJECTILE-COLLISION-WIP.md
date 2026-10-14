# Projectile collision — partial actual integration

Pinned Ikemen GO cb56d73badb322f3725257c2e8cfd157b2c3989d: char.go Projectile.getClsn/commitProjectile/cancelHits/tradeDetection; bytecode.go projectile Run; system.go zEnabled/zAxisOverlap; stage.go PlayerInfo bounds.

Projectile geometry has only Clsn1/Clsn2 and does not inherit root OverrideClsn/TransformClsn. Source-evaluated projclsnscale overrides spawning character collision scale, defaults a missing second component to 1 and stays independent of sprite projscale/doscale. projclsnangle uses origin rotation without a pivot. Actual projectile attacks and independent Clsn2-versus-Clsn2 cancellation use scaled/normalized SAT boxes.

Cancellation candidates apply Enemy/Friend/Both from both projectiles and spawning team-side, sort by squared world distance then projectile ID, and process sequential priorityPoints/hits depletion. Survivors receive HitDef pausetime; canceled projectiles stop trading. Zero-hit projectiles cannot damage characters but can trade. Actual fixtures verify expression-evaluated priority, multi-hit survival, nearest-first cancellation, mixed team modes and independence from root immunity/overrides/p2clsncheck.

Stage PlayerInfo topbound/botbound enable depth only when unequal; existing camera exporters retain both. Projectile attack.depth evaluates in source context, defaults to character attack depth and duplicates a single supplied value. Actual depth overlap uses independent projectile world conversion. Fixtures prove separated projectiles survive, touching depth edges cancel, world-Z scales once and disabled-Z bypasses depth.

Evidence: check-projectile-collision-geometry.mjs, check-projectile-cancellation.mjs, check-depth-overlap.mjs, check-projectile-hits.mjs and check-pause-cancel.mjs pass. Actual source/geometry/counters/team/depth tests and complete Saturn regression passed with exit code 0 in outputs/controller-projectile-depth-actual.log.

Remaining: projectile-to-character depth, owner destruction, stage Z simulation and depth movement/controllers, paused trade timing, ModifyProjectile controls, full removal/velocity semantics, compiler/version fidelity, source ownership and complete Projectile parameters. This is partial 0.24.90 work, not complete Projectile/controller coverage. No full controller certification is asserted.
