# Depth / DepthBound — partial actual integration

Pinned Ikemen GO cb56d73badb322f3725257c2e8cfd157b2c3989d: compiler_functions.go depth/depthBound, bytecode.go Run, char.go reset/depthToBox/zDepthBound/projectile candidates/camera contributions, and camera.go Z offset.

Depth writes independent player/edge modifiers. Presence of either specific declaration suppresses value, even when empty. Otherwise value is required and writes both. Missing second components are zero; caller expressions and recipient coordinate ratios apply before writes. Shared root/helper dispatch and ordinary unblocked reset retain modifiers through hitpause/global pause. Actual projectile-to-character overlap uses recipient player modifiers and source attack depth on depth-enabled stages.

DepthBound omitted value/movecamera compile to false. Actual dispatch stores actor-owned flags, root/helper Z clamps use stage depth bounds and independent Depth.edge, stagebound/depthbound gates disable clamps, and round start reads p1startz/p2startz. Flags reset on ordinary frames and retain hitpause/global pause; helper defaults distinguish normal/player helpers.

DepthBound.movecamera feeds actual root/helper Z range tracking. Previous range fallback, auto-center, tension/bounds, depthtoscreen and three float32 smoothing passes drive live camera/model/screen projection. Camera reset clears range/offset and initial-snap state. Current 2D stage defaults produce no Z camera offset.

Evidence: Tools/check-depth-controller.mjs, check-depth-bound.mjs and check-depth-camera.mjs pass. Actual contact, redirected values, edge/gate clamps and helper Time=0 source/reset fixtures pass in Tools/check-saturn-priority.cjs. Complete integration regressions passed in outputs/controller-depth-contact-actual.log, controller-depth-bound-helper-actual.log and controller-depth-camera-integration.log. Actual camera fixtures prove root exclusion, helper inclusion, previous-range retention and live screen/stage projection; full regression passed with exit code 0 in outputs/controller-depth-camera-actual.log.

Remaining: complete physics ordering, character HitDef depth, base depth push/overlap consumers, full Z movement/stage rendering, Y-tension/zoom coupling, stage source-coordinate metadata, native compiler diagnostics and broader ownership/version timing. Neither controller nor the full camera subsystem is certified complete. This is partial 0.24.91 work, not full Depth/DepthBound/camera certification.
