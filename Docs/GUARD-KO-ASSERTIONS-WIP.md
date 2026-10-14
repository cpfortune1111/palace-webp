# Guard KO query and KO assertions — partial integration

Actual AssertSpecial/contact/guard-KO-query fixtures and complete browser regression passed with terminal exit code 0 in outputs/controller-guard-ko-assertions-actual.log. Refreshed query-name dispatch audit has 10 remaining absent names; this is not semantic certification.

Pinned char.go guard KO occurs only when guarding damage can kill; AssertSpecial NoKO/NoGuardKO prevent that guard-to-hit transition. Native GetHit kill still records the source kill permission, while guardko records the actual guard KO outcome. The actor assertion and source HitDef permission must not be conflated.

Shared AssertSpecial now accepts NoKO/NoGuardKO. Actual contact applies those permissions to survival, guard selection and KO velocity paths, records persistent guardko and exposes its boolean query. Actual source/assertion/contact fixtures test ordinary guard KO, blocked guard KO and blocked unguarded KO while keeping the source kill query unchanged.

Unpublished and partial: complete global NoKO/override interactions, damage ledger clipping/reset semantics, frame/idle defaults and full controller/version parity remain Pending. HitDef.keepstate and HitOverride.keepState are distinct in the native reference and must not be joined merely to satisfy a getter; keepstate gameplay/query work remains separate.
