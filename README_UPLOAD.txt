0.20.3 Collision Resolution M1
Upload/replace index.html + venus_runtime_states.json.

Source-first:
Venus uses source-exact Action 200 Clsn1.
Mars uses source-exact mars.air Action 0 Clsn2Default:
[-30,-440,25,-372], [-45,-372,41,-236], [-47,-236,32,-145], [-64,-145,23,0].
P2 facing=-1 is applied around Mars axis x=+280.

Added generic world-space box transform + rectangle overlap.
Collision is evaluated only while HitDef is active. HUD shows CONTACT on an overlapping logical frame.
Collision toggle also shows Mars Clsn2 in blue. Red remains Venus Clsn1.

M1 limit: Mars is still a stationary source-backed collision target, NOT FighterInstance.
No damage/hit state/hitpause/guard/spark/sound yet.
