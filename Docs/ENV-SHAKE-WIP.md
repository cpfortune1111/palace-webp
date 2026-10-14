# EnvShake — partial native shared dispatch

Actual source expressions, numeric rules, XY presentation and cancellation fixtures passed complete browser regression with terminal exit code 0 in outputs/controller-env-shake-controller-actual.log.

Pinned compiler-functions.go accepts time/ampl/phase/freq/mul/dir/diradd/decay, in that evaluation order. No redirectid parameter is compiled. bytecode.go clears/replaces the global shake before evaluation, truncates time/ampl to integers, scales and truncates amplitude in native space, clamps phase to [-180,180] and frequency to nonnegative, applies native default phase and restarts. Missing/nonpositive time cancels the old shake.

The new dispatcher routes root/helper/reaction source EnvShake into the same XY stepping/presentation state as FallEnvShake. Explicit amplitude rounds in native units before world presentation conversion; default amplitude originates in native space and does not receive explicit-parameter rounding. Focused tests cover all these numeric/default/evaluation-order distinctions. Actual source/controller-to-renderer fixtures pass complete regression as recorded above.

Still partial: full native game-width/widescreen camera projection, overlap/lifecycle clocks, all parameter-expression/version diagnostics and complete controller certification remain Pending. The CSS XY layer adapter is not native camera/draw projection certification.
