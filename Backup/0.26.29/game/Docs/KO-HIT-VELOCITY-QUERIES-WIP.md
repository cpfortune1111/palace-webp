# KO hit velocity queries — partial integration

Actual lethal/ordinary contact velocity-difference/default queries and complete browser regression passed with terminal exit code 0 in outputs/controller-ko-hit-velocity-queries-actual.log.

Pinned char.go applies ground X multiplier and ground/air additions with native Y minimum rules, then stores xveladd/yveladd as the difference from the original hit velocity. Lying recipients and no-KO-velocity paths do not receive the additions. bytecode rescales both queried deltas to the original expression-owner scale.

The existing contact KO velocity block now shares a float32 helper and records both differences. Query dispatch supplies zero when absent, closing the prior conditional-hook/default-path gap. Focused tests pass ground/air/clamp/disabled/lying rules. Actual lethal-contact and ordinary-contact query fixtures are running.

Unpublished and partial: complete KO guard/override/animation/clock behavior, legacy Mugen's originally dummy triggers, source-state coordinate ownership and full HitDef/GetHit version certification remain Pending. This delta integration is not proof that all KO behavior is native-complete.
