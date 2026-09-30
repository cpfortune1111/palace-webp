0.20.4 Collision Snapshot Fix
Upload/replace index.html + venus_runtime_states.json.

Fixes the 0.20.3 CONTACT miss:
- Controller evaluation freezes one authoritative logical-frame snapshot.
- HitDef, Clsn1 lookup, collision resolver, Step renderer and HUD all consume that same snapshot.
- Collision resolver no longer reads the already-advanced live fi/current animation clock.
- Correct AIR element indexing is snapshot elem-1.

HUD while HitDef is active:
HITDEF E4 · OVERLAP 0/1 · CONTACT

Expected at the user's reproduced position (Venus around X 116, State200 E4):
- red Venus Clsn1 visibly overlaps blue Mars Clsn2
- HUD: HITDEF E4 · OVERLAP 1 · CONTACT

E1-E3/E5-E7:
- no active HitDef marker
- no CONTACT.

No damage/hit states added yet.
