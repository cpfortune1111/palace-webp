# EnvColor consumers — partial, unpublished

The version-0.25.87 focused browser gate also passes actual new-round begin/reset clearing, global timer progression while actors are globally paused, and compositor activation when EnvColor is the only active effect (outputs/release-02587-env-color.log). All 259 final-version Node checks, stage parsing and five sound metadata tests pass. Final actor and scheduler gates pass within the combined process; complete battle/deployment verification remains pending until that process completes.

All 259 Node checks subsequently pass (outputs/env-color-node-regression.log); broad actor and focused scheduling/pixel browser gates pass separately. Complete battle and final versioned publication are not yet verified for these changes.

Reference: Ikemen GO cb56d73badb322f3725257c2e8cfd157b2c3989d, src/bytecode.go envColor.Run, src/compiler_functions.go envColor, src/system.go envcol timer/draw order. This effect fills the fight screen; it is not character recoloring and remains in scope.

The shared root/Helper dispatcher consumes value/time/under with native defaults (white, one tick, false), signed integer/boolean extraction and global replacement semantics. Supplied RGB is retained signed and wrapped to low bytes at drawing, rather than clamped. Negative duration remains active; positive duration advances at the simulation clock before actor controllers, independent of actor pause. The pinned compiler does not accept redirectid; unsupported parameters fail explicitly.

The production opaque compositor fills the screen, hides earlier background/reflection/under-layer content, conditionally draws normal layer-zero sprites when under is true, and retains layer-one sprites. Automatic compositor activation and new-round clearing are connected. The ordinary inactive rendering path is unchanged.

The focused Node check passes defaults, evaluation ordering, extraction, byte wrapping, time, fill and parameter rejection. Sixteen actual browser cases cover both profiles, both players and root/normal Helper callers with both under values. Controlled production-compositor pixels distinguish background, layer-minus-one, under-layer, ordinary sprites, reflection and layer-one sprites. Real simStep expires a positive duration and retains a negative duration. The test also verifies no Indexed recoloring assets are requested during normal Saturn preparation.

Remaining: complete native compiler/version/diagnostic behavior, fight-screen/text/motif layer parity, exhaustive pause/reset phases, controller-specific scheduler matrix, broad final versioned regressions and publishing. No whole-controller certification is claimed.

Subsequent checks: the broad actor/controller browser regression exited zero (outputs/env-color-actor-regression.log). Forty EnvColor-specific actual scheduler groups now pass both profiles/player directions for root current/global/lifecycle and normal Helper current/global paths, hitpause literal gates, persistent=0 reseeding and blocked/allowed global-pause movement. The expanded seven-controller matrix has 280 passing groups (outputs/env-color-specific-scheduling.log). These supersede the earlier pending controller-specific matrix, not the remaining native/full-versioned release requirements. Historical RemapPal fixtures opt in explicitly and do not restore automatic character recoloring preloads.
