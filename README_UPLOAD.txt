0.22.1 Hit Acceptance + GetHit Visual Fix

Upload/replace:
- index.html
- venus_runtime_states.json
- venus_gethit_atlas.png
- venus_gethit.json

Fixes:
1) One HitDef activation can hit P2 only once.
   State200 E4 lasts 5 ticks, but overlap on later E4 ticks no longer reapplies
   damage. Expected one punch: HP 1000 -> 980, not 900.

2) Hit velocity is facing-relative.
   State200 source ground.velocity=-16 is stored as local hit velocity.
   State5001 HitVelSet x applies it through P2 facing. With P2 facing left,
   world knockback is +16: away from P1.

3) Real Venus GetHit visuals imported from source.
   venus.air Action5000:
     5000,0 x4; 5000,10 x4
   Action5005:
     5000,10 x6; 5000,0 x-1
   SFF sprites 5000,0 and 5000,10 were decoded into a compact dedicated atlas.
   State5000 shows the source hit pose; State5001 uses the source recovery
   Action5005 slice in this M1 path.

Still deferred:
generic GetHitVar/HitVelSet/HitShakeOver/HitOver lowering, attacker hitpause,
dynamic GetHit Clsn2, sparks/sounds/guard/fall/death.
