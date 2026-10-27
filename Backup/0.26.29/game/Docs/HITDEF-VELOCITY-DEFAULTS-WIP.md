# HitDef velocity defaults — partial integration in progress

Pinned Ikemen GO cb56d73badb322f3725257c2e8cfd157b2c3989d: compiler_functions.go ground.velocity parsing, char.go HitDef initialization/finalizeParams.

Ground/air default all three components to zero. Guard starts [NaN,0,NaN] then inherits ground X/Z. Airguard starts NaN per component and inherits air with factors [1.5,0.5,1.5]. Down inherits air per omitted component, not only when the whole parameter is absent. Source expressions evaluate once in caller context before these fallbacks.

Pinned GO ground.velocity n leaves that component at its initialized zero; it does not implement original Mugen's intended velocity preservation. Its second-component n cannot be followed by a third component. The semantic module tests these literal pinned parser rules and explicit empty/excess-component errors. Original Mugen frontend behavior and documentation reconciliation remain pending; do not certify universal n semantics.

Actual shared root/helper/projectile HitDef numeric compilation now finalizes all five vectors before hit execution and does not reevaluate already-resolved velocity expressions. Focused velocity/projectile-hit tests pass; full regression passed with exit code 0 in outputs/controller-hitdef-velocity-defaults-integration.log.

Dedicated actual shared HitDef compilation/contact fixtures now verify guard/airguard/down omitted components, ground n and one evaluation per supplied source expression through caller query instrumentation. Full regression passed with exit code 0 in outputs/controller-hitdef-velocity-defaults-actual.log. Remaining: compiler-version diagnostics, inherited HitDef persistence, fall velocity defaults and complete native GetHitXY/depth behavior remain unfinished. This is partial 0.24.94 work, not full HitDef certification.
