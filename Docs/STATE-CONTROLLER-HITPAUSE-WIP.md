# 0.26.19 State-controller hitpause and counter scheduling (partial)

Reference: Ikemen GO cb56d73badb322f3725257c2e8cfd157b2c3989d, Char.stateChange1/stateChange2/tick, StateBlock.Run, the CNS compiler controller-index assignment and common.go SliceGrow. Evidence is pinned-source plus executable WEB consumers; native executable differential certification remains absent.

Root/reaction ChangeState/SelfState select StateNo/time immediately during recipient hitpause while destination StateDef effects wait. Explicit animation/control is retained until initialization; redirected P1 reaction conversion retains hitShake. HitDef selection keeps its forced-control default. Root and Helper persistent commits follow dispatch outcomes; stopped transitions and self-destruction do not commit a completed counter.

Root and Helper counters use CNS positions. MUGEN selection during hitpause carries recipient counters and suppresses the recipient's last visited slot; Ikemen resets immediately. Ordinary selection and release clear only destination-visible slots, retaining hidden higher-slot history. Root direct-runtime controllers without CNS positions reset their fallback identities on ordinary selection.

Root captures share actor-wide current-controller position: an explicitly continued old body can update the position after a new State is selected, and a subsequent redirected transition uses that latest recipient position. Ordinary attack-hitpause drivers now use the same indexed body runner rather than filtering raw controllers. The scheduler also recognizes P1 reaction hitShake and P2 standalone hitPause.

Root carried counters clear at the end of the tick that expires the last hitpause clock, through combat and presentation/result drivers, before StateDef initialization. The initializer retains a fallback for externally cleared clocks. Helpers clear visible counters when their hitpause expires.

Forty new actual browser cases after 0.26.18:
- Sixteen root/Helper, P1/P2, MUGEN/Ikemen long-to-short-to-long State sequences, with paused and ordinary short entry.
- Eight root cases continuing an old body after ChangeState/SelfState, then redirecting a second transition during hitpause.
- Eight root version/player/combat-presentation expiry cases, executing before pending StateDef initialization.
- Six MUGEN/Ikemen P1-core, P2-step and P2-core ordinary attack-pause transition cases.
- Two secondary-clock root dispatch cases verifying ordinary/ignorehitpause gating and release.

The existing 0.26.18 root/Helper carry, clean-entry/reaction, redirect/continuation and animation fixtures remain. Module checks additionally cover visible resets, hidden locks, stale-generation rejection, fallback identities, captured backing and actor-wide cursor updates. Clean fixture resets are test isolation, not runtime erasure of legitimate history.

Validation: all 301 Node checks, dedicated animation/state browser, scheduling browser and Helper-entry browser pass. The final full-battle gate after the secondary-clock predicate change completed successfully, including simultaneous/one-tick/five-tick super cases without runtime failure or unintended damage. Earlier driver regressions also passed. These are WEB regression results, not native differential certification.

Remaining: exact counter capacity growth/reallocation and complete nested slice aliases; mixed-provider redirected Helper carry; synthetic landing/walk slot layout; complete global/non-attack/reaction/presentation/tick ordering; replacement/disabled pause edge cases; destination version/owner changes during nested execution; provider/player-slot coordinates; warning/compiler behavior; native differential tests. No whole controller or complete parameter set is certified. Coverage stays Partial.

Character palette replacement is excluded by user request; gameplay PalFX remains in scope. No original SFF/SND/AIR or pinned Go sources are included in publication.
