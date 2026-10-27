# Actual entity hit adapter metadata — integration gap correction

Full non-intercepted callback and real-driver recipient trajectory plus complete browser regression passed with terminal exit code 0 in outputs/controller-entity-hit-full-recipient-trace.log.

Actual adapter-boundary capture plus real contact fixture and complete browser regression passed with terminal exit code 0 in outputs/controller-entity-hit-adapter-metadata-actual.log.

Source audit found applyEntityHit reconstructed an attacker object with only a subset of entity fields. Earlier synthetic direct contact tests therefore did not prove that actual gameplay preserved helper instance/projectile owner/projectile ID/team side/collision world scale. The live adapter now retains the entity fields before overriding its existing root-routing ID and authored facing/ability-state values.

The new fixture executes the actual adapter, intercepts only its resolver boundary before unrelated score/state side effects, then passes the captured actor to the real contact resolver. It verifies projectile owner/ID/team metadata and half-scale Z velocity. This explicitly tests the previously missing call site rather than repeating a detached direct-resolver fixture.

An additional fixture now calls the actual entity-hit callback without resolver interception, changes a live root recipient's life/state, verifies projectile owner/ID/half-scale Z metadata, and advances the real simStep driver. It begins a real training round rather than relying on a detached root object. The complete run is being observed separately.

The initial single-frame time>0 assertion was too strong: the observed real path changes S5000 to S5001 and resets its state clock to zero. The strengthened trajectory fixture now proves consecutive [state,time] frames [5001,0], [5001,1], [5001,2], stable post-hit life and no runtime error, instead of weakening the assertion to accept an unexplained frozen clock.

Unpublished and partial: full collision-eligibility/projectile spawning/score trajectory fixtures and broader native source ownership remain Pending. HitDef.keepstate still requires a separate implementation from HitOverride.keepState; that scope has not been certified by this adapter correction.
