# HitOverride native mask correction — partial

Actual source/native-bit/filter fixtures and complete browser regression passed with terminal exit code 0 in outputs/controller-hit-override-native-mask-actual.log.

Pinned HitFlag enum allocates D=8 and F=16. The older HitOverride mask helper swapped these positions, even though matching strings with the same helper could hide the difference. HitOverride now uses the shared native flag parser/layout also used by guardflag queries; unknown flag letters are rejected instead of silently becoming zero.

Focused tests verify D/F bit values and invalid input. The actual source fixture writes positive F and negative D filters, checks their stored native masks, accepts F-only contact and rejects F+D contact. Full regression is being observed separately.

Still unpublished and partial: complete native flag grammar/version diagnostics and HitOverride state/ownership/pause certification remain Pending. Native GetHitVar.frame resets in Finish before hit detection rather than merely at an arbitrary end-of-tick boundary; frame-query implementation must preserve that ordering and has not been falsely marked complete here.
