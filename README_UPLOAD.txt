0.23.0 Fighter Interaction M1
BUILD fighter-interaction-m1-20260930-01

Upload/replace:
- index.html

Source-first basis checked against IKEMEN-GO develop src/char.go / src/system.go:
- xScreenBound clamps camera-trackable fighters after camera position is resolved.
- pushDetection uses character Size boxes, then Clsn2 overlap by default, resolves penetration according to push priority/weight/factor, clamps screen bounds, and compensates when one fighter is cornered.
- noAutoTurn exists as an engine AssertSpecial flag; normal facing is therefore an engine-level behavior, not Venus-specific content.

Venus source constants used:
[Size]
ground.back = 40
ground.front = 40

M1 implemented:
- P1 and P2 both receive screen-edge clamping while preserving the locked Web 25% sprite-overflow allowance.
- Ground PlayerPush uses Venus ground Size width (40/40), equal Venus priority/weight split, and corner compensation.
- P1/P2 auto-turn toward each other after side changes.
- P1 canonical F/B input is now facing-relative.
- P1 CNS VelSet X is converted from local/facing-relative velocity to world velocity.
- P1 renderer and attack boxes respect facing.
- 0.22.2 dual-fighter camera and 0.22.1 hit/GetHit remain intact.

Known M1 limitation:
- IKEMEN normally also requires current Clsn2 overlap for PlayerPush (unless sizepushonly is asserted). This runtime does not yet have generic AIR Clsn2 imported for every movement action, so M1 uses the source Size box as the push gate. Do not treat this as full PlayerPush compatibility yet.
- noAutoTurn / StateDef facep2 are not yet generic runtime flags; default auto-turn behavior only is implemented.

Test:
1. Walk P1 into P2: P1 must not pass through P2.
2. Keep walking into P2 near either screen edge: neither fighter should leave the accepted visible edge allowance.
3. Move/cross sides where possible via knockback: both fighters should face each other.
4. After P1 turns left, physical left should act as forward and walking animation/movement should remain correct.
5. X attack after turning left must hit toward the left.
6. Damage remains 20 per punch and GetHit remains normal.
