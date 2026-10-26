# 0.26.20 State-controller negative phases and ownership (partial)

Pinned reference: Ikemen GO cb56d73badb322f3725257c2e8cfd157b2c3989d, Char.action/stateChange1/stateChange2/tick, StateBlock.Run, controller compiler and common.go SliceGrow. Evidence is source-backed executable WEB behavior. Native executable differential certification remains absent.

## New behavior after 0.26.19

Root and Helper negative bodies retain CNS controller positions even for skipped ignorehitpause instructions. MUGEN same-position suppression applies to negative bodies, while negative persistent fields remain ignored. Lifecycle dispatch propagates transition outcomes: continue=0 stops the body, continue=1 allows later instructions.

Negative root State transitions select StateNo/time and explicit animation/control immediately but buffer destination StateDef effects. Initialization is blocked inside negative dispatch and allowed at the same-tick post-negative boundary. P1/P2 -1 command drivers visit the full indexed command body, continue after ordinary instructions, and initialize the final buffered State at the driver boundary. The dash adapter remains a filtered game-specific path.

State-provider player identity is separate from character resource labels for roots and Helpers. SelfState/readplayerid, TargetState, captured HitDef P1/P2 State changes and root reversal ownership propagate the player slot. Root -1/-3 and Helper eligible negative-state checks distinguish opposing players even with identical characters; own SelfState restores normal execution. Existing direct root-provider writes reset/infer slots through a compatibility proxy; explicit controller setters override inference when character labels are ambiguous.

Root negative contexts select own character/code version/player and expression coordinates independently of the live current-State provider. Thus -4/-2 and an explicitly continued -1 body can compile HitDef from their own resources while the actor remains in another State table. Helper negative contexts also explicitly identify their own player.

## Executable evidence

There are 172 new actual browser cases after 0.26.19:
- 96 root/Helper -4/-3/-2 cases: both players, MUGEN/Ikemen metadata, ChangeState/SelfState and continue=0/1.
- 16 buffered negative-root StateDef cases and 6 same-tick P1 command/dash/P2 command-boundary cases.
- 16 repeated full -1 command-body cases: leading ordinary instructions, continuation, ignored persistent=0 and stopped suffix.
- 6 mixed Saturn/Moon command-ownership cases.
- 12 same-character root SelfState/TargetState/HitDef ownership cases.
- 8 same-character Helper ownership and captured P1StateNo cases.
- 12 mixed Saturn/Moon own-negative-context HitDef captures across -4/-2/continued--1.

Module checks cover negative cursor/suppression and lifecycle outcome propagation. Existing 0.26.19 counter-range/cursor/expiry/attack-driver/secondary-clock cases remain. A full-battle fixture that formerly inferred opposing identity from a same-character label now explicitly selects the opposing player, with unchanged expected assertions.

All 301 Node checks and dedicated animation/state, scheduling and Helper-entry browser gates pass after the final runtime change. The final complete own-negative-context battle gate passed, including simultaneous/one-tick/five-tick super cases without runtime failure or unintended damage. The corrected preceding Helper identity full battle gate also passed. These are WEB results, not native differential certification.

## Retained 0.26.19 behavior and limits

Visible counter-range resets retain hidden higher-slot history across short States. Continued source bodies retain actor-wide current-controller position. Root expiry resets occur at combat/presentation tick completion before StateDef initialization. Indexed ordinary attack-pause paths and complete root secondary-clock scheduling remain covered.

Still Partial: exact counter capacity growth/reallocation and complete nested slice aliases; synthetic landing/walk slot layout; all negative/current/global phase interactions; dynamic constant/query closures and inherited expression ownership; full native key-control/own-context/retained-helper/reset semantics; replacement/disabled pause edges; every warning/compiler/version/player-slot corner; native differential tests. Same-character identity fixtures do not certify every ownership consumer. No whole controller or full parameter set is certified; coverage remains Partial.

Character palette replacement is excluded by user request; gameplay PalFX stays in scope. Publication excludes original SFF/SND/AIR and pinned Go sources.
