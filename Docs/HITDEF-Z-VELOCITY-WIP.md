# HitDef Z velocity — partial integration in progress

Pinned Ikemen GO cb56d73badb322f3725257c2e8cfd157b2c3989d: bytecode.go velocity fields; char.go HitDef defaults and GetHitVar assignments.

Guard/down parameter modules no longer reject a third velocity component. Ground guard Z defaults to ground velocity Z; aerial guard Z defaults to air velocity Z times 1.5, independently of the 0.5 Y factor. Down velocity omitted components inherit air velocity. Existing two-axis output shapes remain unchanged when no Z component is supplied. Focused guard/down tests pass.

Actual shared hit resolution now populates recipient-local GetHitVar zvel and fall.zvel using independent attacker/projectile-to-recipient scale ratios. Default fall Z is zero as in the pinned native initializer. Baseline regression passed with exit code 0 in outputs/controller-hitdef-z-velocity-integration.log. Dedicated actual hit resolver fixtures cover ground/air/ground-guard/air-guard/down Z, fall Z, HitVelSet recipient application, projectile scaling and independence from X facing; full regression passed with exit code 0 in outputs/controller-hitdef-z-velocity-actual.log.

Dedicated contact/HitVelSet/scale fixtures, fall Z application/bounce suppression, guarded native Y/version behavior, source velocity component defaults and expression evaluation, full KO/depth movement and compiler fidelity remain pending. This is partial 0.24.93 work, not full HitDef certification.

Actual source fall-controller path applies finite fall.zvel through recipient-local bindings on HitFallVel. Initial HitFallSet zvel support was removed after reference inspection proved the pinned source compiler does not parse that parameter; shared/source paths reject it rather than falsely certify an inaccessible enum branch. Down bounce suppression marks fall Z unspecified rather than forcing an extra Z reset. Dedicated fall-controller/source fixtures and shared non-fall/helper dispatch remain pending. Regression passed with exit code 0 in outputs/controller-hitdef-z-fall-integration.log.
