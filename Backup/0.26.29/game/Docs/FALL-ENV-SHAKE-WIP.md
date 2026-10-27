# FallEnvShake — partial shared dispatch

Actual GetHitVarSet/FallEnvShake-to-XY-renderer fixture and complete browser regression passed with terminal exit code 0 in outputs/controller-fall-env-shake-renderer-actual.log. Focused tests additionally cover native missing phase, per-cycle multiplier and zero-multiplier special behavior.

Pinned bytecode.go FallEnvShake redirects the recipient while evaluating redirectid in caller context, transfers the recipient's fall shake data, scales amplitude using the caller's local scale and consumes fall.envshake.time once. No MoveType H guard is applied by the native controller.

Root/helper shared dispatch now consumes canonical fall.envshake fields written by GetHitVarSet instead of only the old nested shake snapshot. Source reaction states route through the same dispatcher. A compatibility fallback reads the old nested values when canonical fields are absent. Focused tests pass redirected ownership, canonical precedence, caller amplitude conversion and one-shot consumption.

Pinned System.EnvShake.update was inspected directly. The new stepping module computes phase and direction with float32 intermediates, per-cycle multiplier, explicit decay power and XY offset; decay zero no longer invents a linear fade. Direction and diradd now affect rendered XY motion. The last active offset remains visible until the next update clears it, matching native clock order. Native missing-phase selection uses 90 degrees at frequency >=90, otherwise zero.

Focused tests pass direction, diradd, decay, stable default amplitude and last-frame clocks. Actual source/controller-to-renderer fixtures pass complete regression as recorded above. Release 0.24.97 remains partial: complete native default/restart/stacking fixtures, stage logical-to-screen projection, global EnvShake unification and full controller/version parity remain Pending. CSS layer translation is currently the presentation adapter; complete native camera/draw projection is not certified.
