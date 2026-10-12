# HitDef parameter audit — 0.24.52

This is an implementation audit, NOT a declaration of complete MUGEN/Ikemen compatibility.
Scope: every named HitDef parameter in the official MUGEN 1.1 beta documentation and the pinned Ikemen compiler, including delegated PalFX parameters. Projectile-only parameters, controller persistent/ignorehitpause, StateDef parameters and undocumented fork extensions are outside this table.

[MUGEN reference](https://www.elecbyte.com/mugendocs-11b1/sctrls.html#hitdef)
[Pinned Ikemen compiler](https://github.com/ikemen-engine/Ikemen-GO/blob/cb56d73badb322f3725257c2e8cfd157b2c3989d/src/compiler_functions.go)

Implemented means a WEB execution path exists, not that every default/expression/mode has engine-identical behavior. Partial and Not implemented must not be treated as supported. Current battles use two roots, 2D and no team mode. Both root simultaneous attacks now use the native equal-priority Hit/Miss/Dodge table; cancelled ties leave their HitDefs active.

Audited parameters: 131. Current-source parameters with no complete execution path: down.velocity, fall.recover, hitonce, p2facing, snap.

Runtime files reviewed: index.html, Char/Venus/venus-special-runtime.js, Engine/score-runtime.js, Engine/hit-priority.js, Engine/hit-attribute-mask.js, Engine/point-controllers.js, Engine/redlife-controllers.js and Engine/damage-assertions.js. Imported character runtime data was inspected for explicit usage, not inferred from visual tests.

| Parameter | WEB status | Explicit source use | Reference | Limitation |
|---|---|---|---|---|
| affectteam | Not implemented | — | MUGEN + Ikemen | No complete native execution path. Importing/storing a value is not implementation. |
| air.animtype | Partial | — | MUGEN + Ikemen | Same limited reaction mapping as animtype. |
| air.cornerpush.velmul | Implemented | — | Ikemen | Execution path present; numeric expression/default parity has not been certified for every input. |
| air.cornerpush.veloff | Implemented | Jupiter, Moon, Neptune, Saturn | MUGEN + Ikemen | Execution path present; numeric expression/default parity has not been certified for every input. |
| air.fall | Implemented | Jupiter, Moon, Neptune, Saturn | MUGEN + Ikemen | Execution path present; numeric expression/default parity has not been certified for every input. |
| air.hittime | Implemented | — | MUGEN + Ikemen | Execution path present; numeric expression/default parity has not been certified for every input. |
| air.juggle | Not implemented | — | MUGEN + Ikemen | No complete native execution path. Importing/storing a value is not implementation. |
| air.type | Partial | Jupiter, Moon, Neptune, Saturn | MUGEN + Ikemen | High/Low/Trip are handled; None semantics are incomplete. |
| air.velocity | Partial | Jupiter, Moon, Neptune, Saturn | MUGEN + Ikemen | 2D aerial velocity exists; optional Z component is not implemented. |
| airguard.cornerpush.velmul | Partial | — | Ikemen | Explicit values and existing default multiplier drive aerial guard cornerpush. Full native default/version parity remains pending. |
| airguard.cornerpush.veloff | Partial | Jupiter, Moon, Saturn | MUGEN + Ikemen | Explicit values and ground fallback feed actual aerial guard cornerpush. Full native corner/scale conditions remain pending. |
| airguard.ctrltime | Partial | — | MUGEN + Ikemen | Explicit caller integer expressions and guard.ctrltime fallback drive original aerial guard CtrlSet. Full command eligibility and version/default parity remain pending. |
| airguard.velocity | Partial | Jupiter | MUGEN + Ikemen | Explicit XY and native 1.5x/0.5x fallback air velocity execute in imported-character aerial guard reactions. Z, full native scale/default and helper collision parity remain pending. |
| animtype | Partial | Jupiter, Moon, Neptune, Saturn | MUGEN + Ikemen | Light/Medium/Hard/DiagUp mappings exist; Back/Up and fallback parity are incomplete. |
| attack.depth | Not implemented | — | Ikemen | No complete native execution path. Importing/storing a value is not implementation. |
| attr | Partial | Jupiter, Moon, Neptune, Saturn | MUGEN + Ikemen | Attack classification and attribute masks exist; team/override parity is incomplete. |
| chainid | Not implemented | — | MUGEN + Ikemen | No complete native execution path. Importing/storing a value is not implementation. |
| crouch.friction | Not implemented | — | Ikemen | No complete native execution path. Importing/storing a value is not implementation. |
| damage | Implemented | Jupiter, Moon, Neptune, Saturn | MUGEN + Ikemen | Execution path present; numeric expression/default parity has not been certified for every input. |
| dizzypoints | Partial | — | Ikemen | Explicit hit point damage executes with its independent attack factor, target defense and no life cap. Native defaults, attack-base composition, queued timing, existing-dizzy suppression and other assertion interactions remain pending. |
| down.bounce | Not implemented | — | MUGEN + Ikemen | No complete native execution path. Importing/storing a value is not implementation. |
| down.cornerpush.velmul | Not implemented | — | Ikemen | No complete native execution path. Importing/storing a value is not implementation. |
| down.cornerpush.veloff | Not implemented | — | MUGEN + Ikemen | No complete native execution path. Importing/storing a value is not implementation. |
| down.hittime | Not implemented | — | MUGEN + Ikemen | No complete native execution path. Importing/storing a value is not implementation. |
| down.recover | Not implemented | — | Ikemen | No complete native execution path. Importing/storing a value is not implementation. |
| down.recovertime | Implemented | — | Ikemen | Execution path present; numeric expression/default parity has not been certified for every input. |
| down.velocity | Not implemented | Jupiter, Neptune | MUGEN + Ikemen | No complete native execution path. Importing/storing a value is not implementation. |
| envshake.ampl | Not implemented | — | MUGEN + Ikemen | No complete native execution path. Importing/storing a value is not implementation. |
| envshake.decay | Not implemented | — | Ikemen | No complete native execution path. Importing/storing a value is not implementation. |
| envshake.dir | Not implemented | — | Ikemen | No complete native execution path. Importing/storing a value is not implementation. |
| envshake.diradd | Not implemented | — | Ikemen | No complete native execution path. Importing/storing a value is not implementation. |
| envshake.freq | Not implemented | — | MUGEN + Ikemen | No complete native execution path. Importing/storing a value is not implementation. |
| envshake.mul | Not implemented | — | Ikemen | No complete native execution path. Importing/storing a value is not implementation. |
| envshake.phase | Not implemented | — | MUGEN + Ikemen | No complete native execution path. Importing/storing a value is not implementation. |
| envshake.time | Not implemented | — | MUGEN + Ikemen | No complete native execution path. Importing/storing a value is not implementation. |
| fall | Implemented | Jupiter, Moon, Neptune, Saturn | MUGEN + Ikemen | Execution path present; numeric expression/default parity has not been certified for every input. |
| fall.animtype | Not implemented | — | MUGEN + Ikemen | No complete native execution path. Importing/storing a value is not implementation. |
| fall.damage | Implemented | — | MUGEN + Ikemen | Execution path present; numeric expression/default parity has not been certified for every input. |
| fall.envshake.ampl | Implemented | — | MUGEN + Ikemen | Execution path present; numeric expression/default parity has not been certified for every input. |
| fall.envshake.dir | Not implemented | — | Ikemen | No complete native execution path. Importing/storing a value is not implementation. |
| fall.envshake.freq | Implemented | — | MUGEN + Ikemen | Execution path present; numeric expression/default parity has not been certified for every input. |
| fall.envshake.mul | Implemented | — | Ikemen | Execution path present; numeric expression/default parity has not been certified for every input. |
| fall.envshake.phase | Implemented | — | MUGEN + Ikemen | Execution path present; numeric expression/default parity has not been certified for every input. |
| fall.envshake.time | Implemented | — | MUGEN + Ikemen | Execution path present; numeric expression/default parity has not been certified for every input. |
| fall.kill | Implemented | — | MUGEN + Ikemen | Execution path present; numeric expression/default parity has not been certified for every input. |
| fall.recover | Not implemented | Jupiter, Moon, Neptune, Saturn | MUGEN + Ikemen | No complete native execution path. Importing/storing a value is not implementation. |
| fall.recovertime | Not implemented | — | MUGEN + Ikemen | No complete native execution path. Importing/storing a value is not implementation. |
| fall.xvelocity | Implemented | — | MUGEN + Ikemen | Execution path present; numeric expression/default parity has not been certified for every input. |
| fall.yvelocity | Implemented | — | MUGEN + Ikemen | Execution path present; numeric expression/default parity has not been certified for every input. |
| fall.zvelocity | Not implemented | — | Ikemen | No complete native execution path. Importing/storing a value is not implementation. |
| forcecrouch | Partial | — | Ikemen | Caller boolean selects crouching ordinary standing-victim reactions. Full native state mutation/ownership, custom/override/down/helper paths remain pending. |
| forcenofall | Not implemented | — | MUGEN + Ikemen | No complete native execution path. Importing/storing a value is not implementation. |
| forcestand | Partial | Saturn | MUGEN + Ikemen | Caller boolean and ground-Y default select standing ordinary reactions; guarded/trip/air branches retain priority. Native pre-state flags, down/custom/override ownership and helper victim parity remain pending. |
| getpower | Not implemented | — | MUGEN + Ikemen | No complete native execution path. Importing/storing a value is not implementation. |
| givepower | Not implemented | — | MUGEN + Ikemen | No complete native execution path. Importing/storing a value is not implementation. |
| ground.cornerpush.velmul | Implemented | — | Ikemen | Execution path present; numeric expression/default parity has not been certified for every input. |
| ground.cornerpush.veloff | Implemented | Jupiter, Moon, Neptune, Saturn | MUGEN + Ikemen | Execution path present; numeric expression/default parity has not been certified for every input. |
| ground.hittime | Implemented | Jupiter, Moon, Neptune, Saturn | MUGEN + Ikemen | Execution path present; numeric expression/default parity has not been certified for every input. |
| ground.slidetime | Implemented | Jupiter, Moon, Neptune, Saturn | MUGEN + Ikemen | Execution path present; numeric expression/default parity has not been certified for every input. |
| ground.type | Partial | Jupiter, Moon, Neptune, Saturn | MUGEN + Ikemen | High/Low/Trip are handled; None does not suppress native reaction correctly. |
| ground.velocity | Partial | Jupiter, Moon, Neptune, Saturn | MUGEN + Ikemen | 2D grounded velocity exists; native falling/down-state alternatives are incomplete. |
| guard.cornerpush.velmul | Implemented | — | Ikemen | Execution path present; numeric expression/default parity has not been certified for every input. |
| guard.cornerpush.veloff | Implemented | Jupiter, Moon, Neptune, Saturn | MUGEN + Ikemen | Execution path present; numeric expression/default parity has not been certified for every input. |
| guard.ctrltime | Implemented | Jupiter | MUGEN + Ikemen | Execution path present; numeric expression/default parity has not been certified for every input. |
| guard.dist | Partial | Jupiter, Moon | MUGEN + Ikemen | Root/helper HitDefs share actor guard-distance vectors with AttackDist; projectile snapshots also feed InGuardDist. Full local scale/defaults, eligibility and reset/persistence remain pending. |
| guard.dist.depth | Partial | — | Ikemen | Root depth vectors and strict pure query tests exist; actual Z gameplay and full actor/projectile integration remain pending. |
| guard.dist.height | Partial | — | Ikemen | Root vertical range updates actual strict proximity checks with same-plane safeguard. Root/helper/projectile proximity aggregation exists; custom defaults, scale and native eligibility remain pending. |
| guard.dist.width | Partial | — | Ikemen | Root caller integer expressions, alias priority, negative retention and omitted back-zero update actual proximity queries. Root/helper caller and independent projectile paths exist; full default/reset parity remains pending. |
| guard.hittime | Implemented | Jupiter, Moon, Neptune, Saturn | MUGEN + Ikemen | Execution path present; numeric expression/default parity has not been certified for every input. |
| guard.kill | Partial | — | MUGEN + Ikemen | Nonlethal guard floor and native lethal-chip switch to hit reaction exist. Pinned native char.go confirms this switch is intentional. NoKO/NoGuardKO/global survival assertions, rounding and queued damage parity remain pending. |
| guard.pausetime | Implemented | — | MUGEN + Ikemen | Execution path present; numeric expression/default parity has not been certified for every input. |
| guard.slidetime | Implemented | Jupiter, Moon, Neptune, Saturn | MUGEN + Ikemen | Execution path present; numeric expression/default parity has not been certified for every input. |
| guard.sparkangle | Not implemented | — | Ikemen | No complete native execution path. Importing/storing a value is not implementation. |
| guard.sparkno | Partial | Jupiter, Moon, Neptune, Saturn | MUGEN + Ikemen | Character-owned S-prefixed sparks only; common fightfx sparks/defaults are not complete. |
| guard.sparkscale | Not implemented | — | Ikemen | No complete native execution path. Importing/storing a value is not implementation. |
| guard.velocity | Partial | Jupiter, Moon, Neptune, Saturn | MUGEN + Ikemen | Ground X velocity exists; optional Z is explicitly unsupported. |
| guardflag | Partial | Jupiter, Moon, Neptune, Saturn | MUGEN + Ikemen | Ground H/L/M and imported-character aerial A contacts honor stance assertions and source UnGuardable. Aerial reactions execute original states 154/155. Venus aerial guard assets/state import and full SCF_guard/input ordering remain pending. |
| guardpoints | Partial | — | Ikemen | Explicit guard point damage executes with its independent attack factor and target defense. Native defaults, air guarding, queued timing and assertions remain pending. |
| guardsound | Partial | Jupiter, Moon, Neptune, Saturn | MUGEN + Ikemen | Same ownership/default limitations as hitsound. |
| guardsound.channel | Not implemented | — | Ikemen | No complete native execution path. Importing/storing a value is not implementation. |
| hitflag | Partial | Jupiter, Moon, Neptune, Saturn | MUGEN + Ikemen | M/A/F and stance checks exist; complete D/H/L and +/- eligibility semantics are missing. |
| hitonce | Not implemented | Neptune | MUGEN + Ikemen | No complete native execution path. Importing/storing a value is not implementation. |
| hitsound | Partial | Jupiter, Moon, Neptune, Saturn | MUGEN + Ikemen | Character-owned sound playback exists; common/character ownership and native defaults are not complete. |
| hitsound.channel | Not implemented | — | Ikemen | No complete native execution path. Importing/storing a value is not implementation. |
| id | Partial | Jupiter, Moon, Neptune, Saturn | MUGEN + Ikemen | Hit metadata/helper targeting exist; complete target-ID filtering is missing. |
| ignorereversaldef | Not implemented | — | Ikemen | No complete native execution path. Importing/storing a value is not implementation. |
| keepstate | Not implemented | — | Ikemen | No complete native execution path. Importing/storing a value is not implementation. |
| kill | Implemented | Saturn | MUGEN + Ikemen | Execution path present; numeric expression/default parity has not been certified for every input. |
| maxdist | Not implemented | — | MUGEN + Ikemen | No complete native execution path. Importing/storing a value is not implementation. |
| mindist | Not implemented | — | MUGEN + Ikemen | No complete native execution path. Importing/storing a value is not implementation. |
| missonoverride | Not implemented | — | Ikemen | No complete native execution path. Importing/storing a value is not implementation. |
| nochainid | Partial | Jupiter, Neptune, Saturn | MUGEN + Ikemen | Single-ID helper/projectile check only; two-ID and root attack checks are missing. |
| numhits | Partial | Saturn | MUGEN + Ikemen | Caller integer expressions drive actual root/entity HitCount/GuardCount queries and report hit/combo totals. Defender physical GetHitVar hitcount/guardcount are separate from numhits. receivedHits, complete reset/eligibility rules, projectile-owner attribution, queued timing and integer overflow remain pending. |
| p1facing | Partial | Jupiter, Moon | MUGEN + Ikemen | Paired throw path only. |
| p1getp2facing | Not implemented | — | MUGEN + Ikemen | No complete native execution path. Importing/storing a value is not implementation. |
| p1sprpriority | Implemented | Jupiter, Moon | MUGEN + Ikemen | Execution path present; numeric expression/default parity has not been certified for every input. |
| p1stateno | Partial | Jupiter, Moon, Saturn | MUGEN + Ikemen | Current paired throw path only; standalone/custom-state ownership semantics are incomplete. |
| p2clsncheck | Not implemented | — | Ikemen | No complete native execution path. Importing/storing a value is not implementation. |
| p2clsnrequire | Not implemented | — | Ikemen | No complete native execution path. Importing/storing a value is not implementation. |
| p2facing | Not implemented | Jupiter, Moon, Saturn | MUGEN + Ikemen | No complete native execution path. Importing/storing a value is not implementation. |
| p2getp1state | Not implemented | — | MUGEN + Ikemen | No complete native execution path. Importing/storing a value is not implementation. |
| p2sprpriority | Implemented | — | MUGEN + Ikemen | Execution path present; numeric expression/default parity has not been certified for every input. |
| p2stateno | Partial | Jupiter, Moon | MUGEN + Ikemen | Custom hit/throw transitions exist; p2getp1state and standalone parity are incomplete. |
| palfx.add | Not implemented | — | MUGEN + Ikemen | No complete native execution path. Importing/storing a value is not implementation. |
| palfx.color | Not implemented | — | Ikemen | No complete native execution path. Importing/storing a value is not implementation. |
| palfx.hue | Not implemented | — | Ikemen | No complete native execution path. Importing/storing a value is not implementation. |
| palfx.invertall | Not implemented | — | Ikemen | No complete native execution path. Importing/storing a value is not implementation. |
| palfx.invertblend | Not implemented | — | Ikemen | No complete native execution path. Importing/storing a value is not implementation. |
| palfx.mul | Not implemented | — | MUGEN + Ikemen | No complete native execution path. Importing/storing a value is not implementation. |
| palfx.sinadd | Not implemented | — | Ikemen | No complete native execution path. Importing/storing a value is not implementation. |
| palfx.sincolor | Not implemented | — | Ikemen | No complete native execution path. Importing/storing a value is not implementation. |
| palfx.sinhue | Not implemented | — | Ikemen | No complete native execution path. Importing/storing a value is not implementation. |
| palfx.sinmul | Not implemented | — | Ikemen | No complete native execution path. Importing/storing a value is not implementation. |
| palfx.time | Not implemented | — | MUGEN + Ikemen | No complete native execution path. Importing/storing a value is not implementation. |
| pausetime | Implemented | Jupiter, Moon, Neptune, Saturn | MUGEN + Ikemen | Execution path present; numeric expression/default parity has not been certified for every input. |
| priority | Partial | Jupiter, Moon, Neptune, Saturn | MUGEN + Ikemen | Root P1/P2 simultaneous attacks support all Hit/Miss/Dodge combinations and unequal priorities. Helper/projectile attack-class ties are not unified with this root resolver. |
| redirectid | Not implemented | — | Ikemen | No complete native execution path. Importing/storing a value is not implementation. |
| redlife | Not implemented | — | Ikemen | No complete native execution path. Importing/storing a value is not implementation. |
| score | Implemented | — | Ikemen | Execution path present; numeric expression/default parity has not been certified for every input. |
| snap | Not implemented | Saturn | MUGEN + Ikemen | No complete native execution path. Importing/storing a value is not implementation. |
| sparkangle | Not implemented | — | Ikemen | No complete native execution path. Importing/storing a value is not implementation. |
| sparkno | Partial | Jupiter, Moon, Neptune, Saturn | MUGEN + Ikemen | Character-owned S-prefixed sparks only; common fightfx sparks/defaults are not complete. |
| sparkscale | Not implemented | — | Ikemen | No complete native execution path. Importing/storing a value is not implementation. |
| sparkxy | Partial | Jupiter, Moon, Neptune, Saturn | MUGEN + Ikemen | Explicit character spark offsets exist; complete default/common-spark parity is missing. |
| sprpriority | Not implemented | — | Ikemen | No complete native execution path. Importing/storing a value is not implementation. |
| stand.friction | Not implemented | — | Ikemen | No complete native execution path. Importing/storing a value is not implementation. |
| teamside | Not implemented | — | Ikemen | No complete native execution path. Importing/storing a value is not implementation. |
| unhittabletime | Not implemented | — | Ikemen | No complete native execution path. Importing/storing a value is not implementation. |
| xaccel | Not implemented | — | Ikemen | No complete native execution path. Importing/storing a value is not implementation. |
| yaccel | Implemented | — | MUGEN + Ikemen | Execution path present; numeric expression/default parity has not been certified for every input. |
| zaccel | Not implemented | — | Ikemen | No complete native execution path. Importing/storing a value is not implementation. |
