# GetHitVar velocity vectors — partial integration

Actual contact/all-fifteen-query/mixed-localcoord Root fixture and complete browser regression passed with terminal exit code 0 in outputs/controller-get-hit-velocity-vectors-actual.log.

Pinned char.go records ground/air/down/guard/airguard velocity XYZ vectors separately from the active hit velocity. Each vector is scaled to recipient units; only X receives -hitFacing. bytecode.go rescales every query component to the original expression owner's local scale. The vector values are informational unless a source controller explicitly consumes them; they must not replace active hit velocity indiscriminately.

Shared actual contact now records all fifteen canonical query fields using compiled component defaults. Query dispatch supports them with recipient-to-expression-origin conversion and native zero defaults for absent vectors. Focused tests pass count, fallback/defaults, facing and both scale boundaries. Actual source/contact/all-field/mixed-localcoord Root fixtures are running.

Unpublished and partial: full source-state local-scale ownership, complete original Mugen versus pinned Ikemen vector semantics, initial/reset storage and complete GetHitVar/controller certification remain Pending.
