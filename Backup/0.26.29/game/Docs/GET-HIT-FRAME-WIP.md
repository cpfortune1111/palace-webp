# GetHitVar frame — partial phase integration

Actual source query, finish/pause and non-intercepted live-recipient frame trajectory plus complete browser regression passed with terminal exit code 0 in outputs/controller-hit-frame-phase-actual.log. Release 0.25.00 remains a partial scheduler integration, not full native ordering certification.

Pinned char.go sets ghv.frame on contact and clears it in Finish before hit detection when the actor is not globally paused. Clearing blindly after contact at end of tick would erase the new event; clearing blindly before source controllers would hide the prior event from those controllers.

Actual contact now sets frame, and shared GetHitVar exposes its boolean. Roots clear once per logic tick at the pre-contact collision boundary, with a post-controller fallback before entity hits when the root core returns without collision. Non-fight driver uses the same finish hook. Helper finish hooks run after helper controllers and before its hit phase, including hitpause controller-only handling; globally blocked actors retain the flag.

An actual query/finish/pause fixture covers clear, same-tick newly set event, global-pause retention and resumed clear. Full regression is being observed. Still unpublished and partial: complete native simultaneous root/helper controller/finish ordering, hitpause/reversal/disabled actor behavior and all real driver clock trajectories remain Pending. This is not full native scheduler certification.
