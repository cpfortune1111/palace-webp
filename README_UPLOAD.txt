0.22.0 Damage + GetHit M1
Upload/replace index.html + venus_runtime_states.json.

Verified source:
venus.cns State200 HitDef: damage 20; animtype Light; ground.type High;
ground.slidetime 11; ground.hittime 15; pausetime 8,8; ground.velocity -16.
venus_Common.cns State5000: S/H/N, velset 0,0; Light+High -> Action5000;
HitShakeOver with no yvel/fall -> State5001.
State5001: S/H/S; Time0 HitVelSet x; slidetime friction; HitOver -> State0 ctrl=1.

M1:
CONTACT -> P2 HP -20 once -> S5000/A5000 -> S5001 knockback -> S0.
HUD adds P2 HP. 0.21.3 AIR loop fix retained.
Deferred: generic GetHitVar/HitVelSet/HitShakeOver/HitOver, attacker hitpause,
accurate hit-animation Clsn2, sparks/sounds/guard/fall/death.
