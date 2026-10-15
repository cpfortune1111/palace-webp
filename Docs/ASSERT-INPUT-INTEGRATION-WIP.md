# AssertInput — partial root command-buffer integration

References: Ikemen GO cb56d73badb322f3725257c2e8cfd157b2c3989d, compiler_functions.go assertInput, bytecode.go assertInput.Run, input.go command input merging and char.go input-modifier reset.

The live root dispatcher now accepts flag and flag2–flag8, validates the case-sensitive U/D/L/R, a/b/c/x/y/z/s/d/w/m and B/F values, resolves RedirectID expressions and unions physical flags per recipient. B/F resolve using the redirected recipient's facing when the controller runs, not its facing at later command sampling. Invalid/missing flags fail explicitly; a missing redirected actor performs no assertion.

The existing root command sampler merges asserted physical keys into its canonical input without modifying real keyboard/touch state, and consumes the per-root assertion once. Match/input reset clears pending flags. Ordinary samples without assertions are unchanged. Helper command-buffer ownership is explicitly unsupported rather than silently redirected to a root.

Focused executable tests cover all flags, every slot independently, redirection, execution-time facing, missing actors, union and one-time consumption. The parameter-evidence ledger is checked against all nine pinned inventory names. Actual P1/P2 controllers inject keys into real command buffers, trigger a real single-button command and release the injected keys on the next sample. Redirected B/F still reflects the facing at execution when the actor turns before sampling. Initial browser startup caught input reset occurring before the new store's declaration; initialization was moved before startup handlers. The corrected actual fixture and complete browser regression passed with terminal exit 0 in outputs/controller-assert-input-startup-browser.log.

Pending: native global input/action phase ordering, pause/hitpause reset semantics, configurable SOCD resolution, ShiftInput composition, Helper key-control ownership, replay/network input and complete version fidelity. This is not full controller certification. No controller or parameter is counted complete; this checkpoint is included in 0.25.17, with deployment verified separately.
