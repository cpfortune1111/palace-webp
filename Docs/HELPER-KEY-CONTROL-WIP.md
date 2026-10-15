# Helper keyctrl command-access gate — partial integration

Reference: Ikemen GO cb56d73badb322f3725257c2e8cfd157b2c3989d, compiler_functions.go Helper keyctrl, bytecode.go helper_keyctrl and char.go helper initialization/command.

Native Helper keyctrl is up to four integer enum expressions, not a boolean tuple. Helper defaults are false/false/false/true. Each evaluated value 1–4 enables that corresponding flag; zero/out-of-range values enable nothing and do not disable defaults. Flag one controls Command access. Flags two/three alone do not grant Command access.

The WEB Helper spawn path now evaluates these enum expressions in caller context, preserves defaults and stores the four flags. Both special-runtime and shared fighter-expression command paths return false for Helpers without flag one instead of leaking active root commands. Root command access is unchanged.

Focused tests cover defaults, zero, duplicates, out-of-range enums, component limits and expression evaluation. The actual fixture creates Helpers with default, zero, flags two/three/four and a nested-comma expression granting flag one while a real root command is active. Both command-expression paths enforce the gate. The actual fixture and complete browser regression passed with terminal exit 0 in outputs/controller-helper-key-control-browser.log, including prior input-modifier and simultaneous Saturn super checks.

Subsequent integration: HELPER-COMMAND-BUFFER-WIP.md records separate Helper command buffers and partial per-Helper AssertInput/ShiftInput/SOCD consumers, replacing the pre-existing owner provider. HELPER-NEGATIVE-STATES-WIP.md records partial -3/-2/-1 permission and controller execution. Complete negative-state/deferred-transition timing, other key-control behavior, native input/action phases and version fidelity remain Pending. The recorded flags are not a claim that every corresponding behavior is implemented. No controller or parameter is certified complete; this checkpoint is included in 0.25.19, with deployment verified separately.
