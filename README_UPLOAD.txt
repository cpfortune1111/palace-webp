0.19.8 State 200 Controllers M2
Upload/replace index.html + venus_runtime_states.json. Keep 0.19.7d attack atlas/JSON.

Actual venus.cns State 200 source slice now lowered:
- AnimElemTime(5)>0 + holdup -> State 40
- AnimElemTime(5)>0 + holddown -> State 10
- AnimElemTime(5)>0 -> StateTypeSet movetype=I
- AnimTime=0 -> State 0, ctrl=1

Generic runtime additions: AnimElemTime(n), MoveType, StateTypeSet movetype.
Temporary Web-only animDone State200 return is no longer used.
Deferred: HitDef, PlaySnd, VarSet/P2/MoveContact and AI branches.
