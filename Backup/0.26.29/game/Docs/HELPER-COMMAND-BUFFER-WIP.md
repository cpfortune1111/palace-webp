# Independent Helper command buffers — partial integration

Reference: Ikemen GO cb56d73badb322f3725257c2e8cfd157b2c3989d, char.go command/keyctrl and own CommandList initialization, input.go AssertInput/ShiftInput/SOCD processing.

Helpers with keyctrl flag one now receive their own command list and signed input history rather than reading buffered commands from the root. Their sampler starts from the owner's pre-modifier physical input, converts facing for each Helper, applies that Helper's AssertInput and ShiftInput, and uses independent SOCD history when configured. A root's asserted/remapped keys do not leak into a Helper. Normal root sampling remains on the existing root lists.

The shared and special-runtime expression paths both query the Helper-owned list. Unsampled Helpers and Helpers without flag one cannot inherit a currently active root command. Input reset clears Helper command/history stores, stale or destroyed Helpers are pruned and the existing Helper-destruction callback releases associated input state.

The actual fixture creates two Helpers on the same side, injects/remaps only one, verifies both expression paths recognize its real b command, checks the other Helper/root stay unaffected, checks facing-relative input and release, and confirms destruction cleanup. The earlier keyctrl fixture now expects even a permitted Helper to remain false until its own buffer has been sampled. The actual fixture and complete browser regression passed with terminal exit 0 in outputs/controller-helper-own-commands-browser.log, including root input-modifier and simultaneous Saturn super checks.

Pending: exact native global input/action and pause phases, raw-input/default parity, complete Helper AI/command-name behavior, state -1/-2/-3 and automatic movement behavior for keyctrl flags, SOCD configuration-change history and replay/network input. This does not certify Helper, AssertInput or ShiftInput. No complete-controller counts change; this checkpoint is included in 0.25.19, with deployment verified separately.
