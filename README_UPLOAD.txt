0.20.2 Collision Debugger M1
Upload/replace index.html + venus_runtime_states.json.

Fix:
- HITDEF HUD marker is current logical tick only. It disappears immediately after
  the State 200 HitDef trigger (AnimElem = 4) stops matching.
- Removed misleading HitDef serial from HUD.

Debug UI:
- TIME and ELEM retained.
- Play / Step remain top-right.
- New □ top-right toggle enables collision visualization.
- RED = Clsn1 attack hitbox.
- BLUE = Clsn2 body collision.
- M1 visualization is source-exact for venus.air Action 200 only.

Source-exact Action 200:
E1: Clsn2 x3
E2: Clsn2 x3
E3: Clsn2 x3
E4: Clsn1 x1 + Clsn2 x4, duration 5 ticks
E5: Clsn2 x3
E6: Clsn2 x3
E7: Clsn2 x3

Expected:
- HITDEF appears only while ELEM 4 is the evaluated logical frame.
- Red Clsn1 appears only at ELEM 4.
- Blue Clsn2 follows every Action 200 element.
- At TIME 12 / ELEM 7 there must be NO HITDEF and NO red Clsn1.

This is visualization M1, not collision resolution. Mars is still not a real P2.
