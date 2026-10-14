# GetHit selective reset — partial profile integration

Pinned char.go reset/selectiveReset preserves specified stacked fields and offsets but resets the fall shake group to zero before new contact. Guarded contact does not copy the HitDef fall shake group. This contradicts the earlier assumption that old shake values should survive every guarded hit. Full default playerno/teamside are -2 internally (query returns -1), playerid/projid/hitid are -1, fall X/Z are NaN, fall Y is -4.5/originLs, and friction defaults are NaN.

The new reference reset module models those defaults/preserved fields. Actual contact consumes its guarded fall-shake resets and logical-width fall-Y default only for an explicitly declared recipient compatibility='ikemen'; legacy/current Mugen-profile behavior is not silently changed. Focused tests pass stack/offset preservation, shake reset, scaled fall-Y and legacy.fallyvelyaccel. Actual profile/contact fixtures passed complete regression in outputs/controller-native-guard-fall-reset-actual.log, terminal exit code 0.

Only the two stated contact consumers are integrated so far. Full reset field application, deferred damage/point ledgers, frame-end clock/reset timing, idle clocks, native identity initialization and Mugen-versus-Ikemen version semantics remain Pending. The module alone is not proof that every modeled field reaches gameplay.
