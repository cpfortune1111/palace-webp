Prototype 0.16 — CNS/ZSS Runtime Slice 1

Purpose:
- First conversion from Venus-specific hardcoded jump logic to a data-driven battle runtime.
- Keeps the proven 0.15 joystick calibration and locked stage/character calibration unchanged.

New runtime structure:
- venus_runtime_states.json = normalized State IR for States 0, 11, 20, 40, 50, 51, 52.
- StateDef keeps type and physics separate.
- physics=A alone applies movement.yaccel; type=A by itself does not imply gravity.
- Controllers execute from the State IR (WalkVelocity, JumpTakeoff, ChangeState, Land).
- Constants now use IKEMEN-style names such as velocity.jump.y and movement.yaccel.
- Jump direction is latched when State 40 begins, so joystick movement/release during startup cannot change takeoff direction.

Source-aligned Venus constants included:
walk fwd 9; walk back -6.75; jump neutral x 0; jump y -40;
jump fwd x 8; jump back x -8; runjump +/-16,-40;
airjump neutral x 0, y -8.1, back x -2.55, fwd x 2.5;
yaccel 1.76; stand friction .85; crouch friction .82;
stand threshold 8; crouch threshold .2; airjump num 0; airjump height 140.

Important scope:
This is NOT yet a general CNS/ZSS text parser. It is Runtime Slice 1: a shared IR/executor shaped so future CNS and ZSS parsers can compile into it. The regression target is identical Idle/Walk/Crouch/Jump/Land behavior to 0.15.
Camera follow is intentionally not changed in this build.
