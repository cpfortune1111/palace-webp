0.21.1 Dual Venus FighterInstance M1
Upload/replace index.html + venus_runtime_states.json.

Direction change:
- P2 Mars is removed from active runtime.
- P1 and P2 now instantiate Sailor Venus from the SAME Venus runtime data/atlas.
- No mars_atlas.png or mars_anim.json is loaded by this build.
  Existing Mars files may remain in repo unused.

Source-first P2 Venus:
- StageTraining P2 start x=+280, facing=-1.
- venus.air Action 0 is the P2 deterministic idle animation.
- venus.air Action 0 Clsn2Default:
  [-27,-429,25,-360]
  [-35,-360,36,-243]
  [-34,-243,39,1]
  [39,-56,63,1]

M1 validation:
- Both visible fighters should now be Venus.
- P2 is horizontally facing P1.
- P2 S/T/E advances independently on battle ticks.
- Pause freezes both; Step advances both one tick.
- Venus P1 State200 Clsn1 vs Venus P2 Action0 Clsn2 can produce OVERLAP 1 / CONTACT.
- Collision debug: red P1 Clsn1; blue P1/P2 Clsn2.

Deferred:
P2 CMD/AI, complete generic state-controller execution for P2, P1+P2 camera,
damage/GetHit/hitpause/guard/spark/sound.
