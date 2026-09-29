0.19.6 CMD Sequence / Input Buffer M2
Upload index.html + venus_runtime_states.json + venus_cmd_runtime.json.

Source basis: actual venus.cmd.
Added generic canonical input history and command matcher:
- comma sequence ordering
- + simultaneous tokens
- / hold
- ~ release
- $ four-way directional modifier
- per-command time window
- buffer.time latch
- canonical keys F B U D a b c x y z s

Current touch UI still exposes directional joystick only, so this milestone regression-tests the held movement commands. Button commands are parsed and matcher-ready, but no attack buttons / State -1 activation yet.
Camera/EDGE/zoom/joystick geometry unchanged.
