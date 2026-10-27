# Hit source identity — partial integration

Actual root/helper/projectile spawn/contact/query fixtures and complete browser regression passed with terminal exit code 0 in outputs/controller-hit-source-identity-actual-fixed.log.

Pinned char.go records HitDef playerno/playerid/teamside/projid on the recipient. Helper playerid is its unique native instance ID, not helper ID. A projectile records its spawning owner's ID and its own projectile ID, even if hit adapters substitute the root player number for routing. playerno/teamside are stored zero-based and queried one-based; non-projectile projid is -1.

Projectile spawn now retains owner instance and projectile ID independently. Actual shared contact populates native identity fields consumed by GetHitVar scalar queries. Focused module tests pass root/helper/projectile separation. Actual spawn/contact/query fixtures pass complete regression as recorded above. Still partial: complete native identity allocation, modified projectile IDs, destroy/redirect ownership lifecycle, teams across all game modes and full HitDef metadata/reset semantics remain Pending.
