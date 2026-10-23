# Additional controller redirect extraction (partial, unpublished)

Pinned reference: Ikemen GO cb56d73badb322f3725257c2e8cfd157b2c3989d, bytecode.go getRedirectedChar and each controller's Run dispatch. Explicit redirect IDs use evalI before native Character lookup. WEB JavaScript numeric coercion previously accepted numeric strings.

The shared controllerInteger extraction now covers twenty-one additional controller types: AssertInput, AttackDist, OverrideClsn, TransformClsn, Depth, FallEnvShake, GetHitVarSet, Height, HitFallSet/Vel/Damage, Offset, PalFX, ShiftInput, ScoreAdd, Trans, Width, ForceFeedback and Display/AppendTo/ClearClipboard. The separate legacy Helper feedback exclusion gate uses the same extraction. Payload fields and their existing integer/float conversion rules are unchanged by this batch.

Independent failing-before checks reproduce AssertInput and ForceFeedback numeric-string coercion (outputs/secondary-redirect-extraction-before.log and outputs/feedback-clipboard-redirect-before.log). check-secondary-redirect-extraction.mjs covers all twenty-one types plus the Helper feedback gate with strings, undefined, NaN, signed fractions, booleans and signed wrapping, verifying missing recipients skip payload evaluation. Actual AttackDist storage adaptation now also uses the native Character filter to reject disabled recipients.

The initial seventeen-type browser fixture passes for quoted root redirect IDs in both named profiles and P1/P2 directions (outputs/secondary-redirect-extraction-browser.log). Controllers with expression payloads leave a side-effect counter unchanged; flag-only/no-payload controllers have standalone lookup coverage rather than full native effect-state equivalence. The final expanded feedback/clipboard fixture, complete regression and publication remain Pending.

The expanded actual-browser fixture now also passes for ForceFeedback and all three clipboard controllers (outputs/secondary-redirect-extraction-final-browser.log). It verifies quoted root IDs cannot reach parameter side effects through their real WEB dispatch. Complete regression and publication remain separate gates.

Remaining ID/index consumers, profile/version/compiler/console behavior, nonfinite conversion fidelity and all whole-controller certifications remain Pending. This does not mark any controller completely compatible or count inert parameters as implemented.
