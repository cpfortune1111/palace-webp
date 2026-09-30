0.19.8b MoveType declaration fix
Upload/replace ONLY index.html.

0.19.8 introduced generic MoveType support, but runtimeMoveType was referenced without
being declared in the actual runtime variable declaration. Pressing X entered State 200,
then StateTypeSet/MoveType evaluation threw ReferenceError and stopped simulation.

Fix: declare runtimeMoveType='I' in the existing runtime state variable block.
No gameplay/state/CMD/tick-debugger behavior changed.
