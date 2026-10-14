# HitDef acceleration — partial integration in progress

Pinned Ikemen GO cb56d73badb322f3725257c2e8cfd157b2c3989d: bytecode.go HitDef acceleration fields, char.go defaults/GetHitVar assignments and gravity.

Native HitDef acceleration defaults are X/Z zero and Y 0.35/originLs. Explicit components evaluate once in source context. Actual shared hit resolution converts acceleration to recipient units; X has -hitFacing while Y/Z do not mirror. Root/helper GetHitVar queries now accept xaccel/zaccel/zvel/fall.zvel. Ordinary native aerial gravity uses movement.yaccel; HitDef X/Z acceleration must not be automatically invented as per-frame force when source controllers do not consume it.

Tools/check-hitdef-acceleration.mjs passes default/origin scale, recipient/facing conversion and single source evaluation. Shared source HitDef compilation populates finite float32 scalar components before hit resolution. Full regression passed with exit code 0 in outputs/controller-hitdef-acceleration-integration.log.

Logical-width actual contact fixtures and the complete browser regression were rerun successfully with terminal exit code 0 in outputs/controller-native-logical-width-confirmed.log. The acceleration module test also passed in the same verification run.

Actual shared source/contact fixtures now prove XYZ expression compilation, GetHitVar queries, VelAdd consumption, X facing and independent projectile-recipient scaling; complete regression passed with exit code 0 in outputs/controller-hitdef-acceleration-actual.log. Remaining: full native game-width metadata export/import, source-state coordinate ownership, selective GetHit resets, fallback query/version behavior and complete acceleration/KO/depth semantics remain pending. Included in release 0.24.95 as partial work, not full HitDef certification.

Reference aspect audit: the local game config declares video output 1280x720, but pinned System.applyFightAspect derives logical gameWidth from a 240-high aspect space. Video width is therefore not the native originLs gameWidth. Actual hit resolution now reads explicit stageCameraConfig.nativeRuntime.logicalWidth; absent metadata retains the legacy 320 preset, and invalid non-positive or non-finite values fail explicitly. Root/helper Z standing thresholds consume the same logical width. Actual contact fixtures exercise widths 320 and 640 and reject zero. Full native aspect metadata export/import, camera coupling and source-state coordinate ownership remain pending. Do not infer logical width from render resolution or change it silently.
