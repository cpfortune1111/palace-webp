# State-controller redirection (0.26.17, partial)

Reference: Ikemen GO cb56d73badb322f3725257c2e8cfd157b2c3989d compiler changeStateSub, bytecode getRedirectedChar/changeState.Run/selfState.Run, Char.selfState/changeStateEx and system.playerID. Original MUGEN versions remain separately in scope.

ChangeState/SelfState now resolve redirectid before later operands, exclude missing/destroyed/disabled recipients, select real root/reaction/Helper animation/control bindings and retain original-caller value/ctrl/anim/continue/read-ID scope. Existing entry/selection machinery changes the target State; same-actor paths retain their adapters. Redirecting another actor defaults to continuing the caller, while explicit continue overrides the stop decision.

SelfState selects the target's own or readplayerid State provider. Invalid/disabled read IDs fall back to own after the preceding operands were evaluated, matching the pinned bytecode/Char.selfState sequence. Native ChangeState ignores the compiled readplayerid operand without evaluating it; this is not general foreign-provider support.

Evidence: 24 direct cross-root/root-Helper state-controller cases cover target state/control/animation, caller-variable RHS, unchanged caller state and default/explicit continue flags. Mixed Saturn/Moon entries verify borrowed-provider StateDef control defaults, caller-variable source lookup, invalid read-ID own fallback with prior value side effect and disabled-ID fallback.

Actual caller-body evidence: 24 root-driver cases execute a transition followed by a VarSet sentinel across P1/P2, same/other targets and default/explicit continue. Six Helper cases execute that sequence through specialRuntime.step on the next tick after creation. All 30 verify whether the later controller really runs and whether readplayerid is natively ignored or evaluated; the initial creation-tick fixture was corrected without changing runtime timing or expected assertions.

All 300 Node checks, the dedicated browser fixture, three latest scheduling/Helper-entry/collision-position gates and complete simultaneous/one-tick/five-tick Saturn battle regression pass. STATE-CONTROLLER-COVERAGE.json lists all pinned controller/common fields with Partial evidence and remaining limits. The inventory test proves enumeration and evidence paths, not complete semantics.

Pending: full nested target-body/pause/hitpause/version/native frame phases, native warnings and compiler/type validation, exact player-slot state-provider attribution/team cardinality, broader foreign-StateDef/legacy cleanup interactions and executable native differential certification. No whole state controller is certified complete. Character recoloring remains excluded; no original SFF/SND/AIR is added.
