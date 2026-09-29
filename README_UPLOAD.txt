0.19.7 State -1 / First Attack M1
Upload index.html + venus_runtime_states.json + venus_cmd_runtime.json.
Verified venus.cmd Stand Light Punch: ChangeState value=200; !AILevel; command="x"; command!="holddown"; StateType!=A; trigger1=ctrl. Combo trigger2 deferred.
Verified venus.cns State 200: type=S, movetype=A, physics=S, juggle=1, velset=0,0, ctrl=0, anim=200.
Adds X touch button -> canonical x -> CMD matcher -> verified State -1 slice -> State 200/AIR200.
State 200 source also contains PlaySnd and HitDef; intentionally NOT enabled in M1. Temporary anim-end return to State 0 until full State 200 controllers are lowered.
