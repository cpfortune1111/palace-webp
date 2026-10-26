# 0.26.21 Own-state selection, binding release and removal (partial)

Pinned reference: Ikemen GO cb56d73badb322f3725257c2e8cfd157b2c3989d, Char.tick/stateChange1/selfState/destroy, targetDrop and StateBlock.Run. Evidence is pinned-source plus executable WEB consumers. Native executable differential certification remains absent.

## New behavior after 0.26.20

Accepted Helper HitOverride selects its own provider/player State through the pending transition buffer. It no longer immediately initializes a StateDef from a retained foreign table. Hitpause body gates and MUGEN/Ikemen persistent reset differences remain active.

Root and Helper controller-binding release clears binding/facing and selects own pending 5050. Control and animation ownership remain unchanged until StateDef initialization, including common FightFX animation. Missing or hit binders use this path.

TargetDrop records controller-binding membership before removal and handles controller/snap targets through the shared release path. Selected removal while the binder was hit forces own pending 5050; an unhit binder only unbinds. P1 lookup works without a reaction object. Dropping a Helper no longer changes its root parent's State ownership.

Helper destruction invokes target cleanup before source hit-state removal. Owned TargetBind/snap targets select own pending States in the same destruction tick. Non-target parent-style bindings clear without forced SelfState.

## Executable evidence

There are 96 new actual browser cases after 0.26.20:
- 8 accepted Helper HitOverride contacts across both players/versions and zero/two-tick hitpause.
- 16 Helper binding-release cases across player/version/missing-or-hit binder/pause.
- 16 root binding-release cases with own-provider recovery and common-animation preservation.
- 24 TargetDrop root/Helper/controller/snap cases, distinguishing binder-hit behavior and parent-provider isolation.
- 32 actual Helper DestroySelf cases covering root/Helper/controller/snap/non-target routes and pauses.

Fixtures check immediate StateNo/provider selection, retained pre-StateDef control/animation, delayed own StateDef, binding cleanup and version-specific persistence. The legacy full-battle Helper release assertion now verifies pre-initialization state and actual H StateDef after buffer initialization; the original H result remains required at the native phase. Imported/fall StateDef aliases are kept consistent in root fixtures.

All 301 Node checks and dedicated animation/state, scheduling and Helper-entry browser gates pass after the final runtime change. A freshly observed final complete battle gate ended with exit 0 and passed simultaneous/one-tick/five-tick supers. Earlier override/release/TargetDrop full battle gates also passed. These are WEB regression results, not native differential certification.

## Retained behavior and remaining scope

0.26.20 negative-body CNS positions, transition outcomes, buffered same-tick StateDef initialization, full command-body processing, own-negative-source contexts and root/Helper player-slot identity remain covered by the existing fixtures.

Still Partial: complete DestroySelf recursive/removal/text/explod/retention semantics; every target/drop/gethit/snap binding and destruction phase; root/helper reset/retained-helper ownership; counter capacity growth/reallocation and nested aliases; synthetic slot layout; complete native constant/query/code-version contexts; global/current/presentation/pause replacement/disabled ordering; warning/compiler/version/player-slot corners; native differential tests. These cases do not certify whole controllers or full parameter sets. Coverage remains Partial.

Character palette replacement is excluded by user request; gameplay PalFX remains in scope. Publication excludes original SFF/SND/AIR and pinned Go sources.
