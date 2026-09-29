0.19.7f Generic StateDef velset
Upload/replace ONLY index.html. Keep 0.19.7d attack atlas/JSON and existing state/CMD JSON.

Source:
State 200 declares velset = 0,0.

Fix:
enterIRState() now applies a state's normalized IR velset generically at state entry.
This is not a State-200 special case.

Expected:
- S20/S21 -> X -> S200 immediately sets VX=0 and VY=0.
- attack no longer slides with walk velocity.
- normal walk/crouch/jump and previous no-deferred-X behavior unchanged.
