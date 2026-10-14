# Explicit documented HitDef parameter profile — partial

Actual source/contact/FallEnvShake/XY-step fixture and complete browser regression passed with terminal exit code 0 in outputs/controller-documented-fall-shake-actual.log.

An attacking character's battle metadata may declare hitDefParameterProfile: documented. This explicitly opts into forwarding HitDef fall.envshake.diradd and decay to recipient GetHit data, unlike the pinned Ikemen commit which compiles both fields but omits their contact copy. The existing/default pinned behavior remains unchanged when this property is absent.

Both fields retain source-expression float32 evaluation, are not coordinate-scaled, and reach FallEnvShake/XY shake stepping. Focused tests cover opt-in copy and default omission. The actual browser fixture exercises expression compilation, real contact, shared FallEnvShake and direction/decay offset computation. This profile is unpublished and does not certify every HitDef parameter or every Mugen/Ikemen version difference.
