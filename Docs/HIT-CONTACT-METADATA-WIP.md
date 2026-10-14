# Hit contact priority/facing/kill — partial integration

Actual source priority/kill expressions, contact queries, nonlethal damage and guard selection plus complete browser regression passed with terminal exit code 0 in outputs/controller-hit-contact-metadata-actual.log.

Pinned compiler/runtime treat priority's numeric component as a caller integer expression, retain the literal Hit/Miss/Dodge type, store the accepted HitDef priority and p2facing in GetHit data, and expose both as integer queries. GetHit kill records the applicable normal/guard kill permission, not the recipient's current alive state.

Shared source HitDef compilation now evaluates priority once and compiles kill/guard.kill/fall.kill boolean expressions. Actual shared contact stores priority/facing/kill, with getters consuming these fields. Focused tests pass expression evaluation/type/defaults. Actual source/contact/query/nonlethal/guard-selection fixtures are running.

Unpublished and partial: complete native priority grammar diagnostics, reversal/KO override kill behavior, legacy versions and full HitDef/GetHit ownership/reset certification remain Pending.
