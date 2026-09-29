0.19.7b X DOM Fix
Upload/replace ONLY index.html. Keep the 0.19.7a JSON files.

Actual root cause of the completely blank runtime:
0.19.7 attempted to insert the X button after obsolete #joy markup.
The current baseline uses #ctrl > #stick > #stickKnob, so #atkX never existed.
JavaScript then executed:
  document.querySelector('#atkX') -> null
  null.addEventListener(...) -> synchronous module crash
This happened before stage/character/runtime loading, explaining why the HUD stayed at Action 0 · Idle and everything was absent.

Fix:
- X button inserted into the actual current DOM.
- explicit #atkX startup guard added.
- no gameplay/CNS/CMD/camera/joystick changes.
