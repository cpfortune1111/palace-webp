# BindToTarget — implementation in progress

Reference: Ikemen GO cb56d73badb322f3725257c2e8cfd157b2c3989d, compiler_functions.go bindToTarget, bytecode.go bindToTarget, char.go bindToTarget/targetBind/distX.

New module evaluates caller ID/index/time/pos/posz/redirectid, default index 0, time 1, X 0 and unspecified Y/Z as NaN. Head/mid/foot position selector follows native first-letter parsing. Coordinates include redirected local scaling and head/mid localcoord correction. The caller is moved relative to its first selected target, then the target receives a reciprocal TargetBind with native scaled offsets.

Unit tests pass for default axes, first target, head offsets, invalid selector and reciprocal binding. Shared dispatch now moves actual root/helper coordinates, uses original target head/mid constants and shares the live TargetBind registration/lifecycle. Unsupported nonzero depth on 2D callers fails explicitly. Current WEB coordinates use normalized localcoord 320; complete imported native localcoord/scales are not certified. Baseline browser regression is running in outputs/controller-bind-to-target-baseline.log.

Baseline browser regression passed with exit code 0 in outputs/controller-bind-to-target-baseline.log. Actual fixture now verifies default X relocation while retaining caller Y, head-position offsets using Saturn constants, redirected P2 movement and reciprocal mutual-binding reset. Fresh regression is running in outputs/controller-bind-to-target-actual.log.

Actual default/head/redirection regression passed with exit code 0 in outputs/controller-bind-to-target-actual.log. The actual fixture now also tests Saturn mid-position constants before redirecting. Fresh regression is running in outputs/controller-bind-to-target-mid.log. Unit tests cover redirected caller scaling, posz, zero binding time and missing/unmatched targets, including the pinned native asymmetric reciprocal Y/Z formula rather than replacing it with a simpler formula.

Actual mid-position regression passed with exit code 0 in outputs/controller-bind-to-target-mid.log. A spawned helper fixture manually registers its live instance as P2's target, moves P2 to foot-relative 92/32 while retaining helper 100/20, creates reciprocal indefinite binding and verifies helper isbound 1. This tests actual coordinate/dispatch behavior, not helper collision acceptance. Fresh regression is running in outputs/controller-bind-to-target-helper.log.

Actual helper-coordinate/query regression passed with exit code 0 in outputs/controller-bind-to-target-helper.log. Parameter evaluation now precedes target selection, matching native behavior even when no target matches; invalid position selectors are not silently skipped. Added unit tests pass for localcoord 640 head correction and no-target evaluation of pos/posz. Fresh full regression passed with exit code 0 in outputs/controller-bind-to-target-final.log.

Pending: full scale/depth/helper matrix, exact native rounding and already-bound distance behavior, native localcoord metadata/depth parity and full regression/certification. Do not count this partial path as full implementation.

