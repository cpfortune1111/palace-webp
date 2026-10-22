# Angle evaluation staging (unpublished, partial)

Reference: Ikemen GO cb56d73badb322f3725257c2e8cfd157b2c3989d, src/compiler_functions.go angleSet/angleMul and src/bytecode.go angleSet.Run/angleMul.Run.

The compiler orders redirectid, value, xangle and yangle. The runtime samples supplied float operands into temporary values before calling any angle setter. Omitted axes have zero defaults without an expression evaluation. AngleMul reads each current target axis when committing its previously sampled multiplier. AngleAdd and AngleDraw retain their immediate per-parameter updates.

Engine/angle-controllers.js now stages AngleSet and AngleMul operands accordingly. A failing-before test observed xangle incorrectly reading the newly written value (2 rather than the previous 10). Tools/check-angle-controllers.mjs now verifies both operations, omission evaluation counts and the existing ownership, arithmetic, drawing matrix and snapshot behavior. This module is already invoked by the actual controller dispatcher; the new edge case has module-level evidence only, not a native executable or actual-browser trajectory certification.

Subsequent actual-browser evidence uses the common dispatcher, real actor contexts and parameter parser for both player slots, roots and Helpers, and both engine profiles. AngleSet and AngleMul consume Angle in a later operand before committing earlier axes. Eight cases verify the three resulting axes, floating division of XAngle and zero-valued queries after resetAngleDraw. Evidence: Tools/check-debug-clipboard-browser.cjs and outputs/angle-evaluation-browser.log.

Angle, XAngle and YAngle now have selected-actor queries and native float result tags. Pinned bytecode OC_ex_angle / OC_ex2_angle_x / OC_ex2_angle_y returns zero unless CSF_angledraw is enabled; the WEB query follows the same enabled-state condition. Native setters simply assign their float argument; no unreferenced normalization was introduced.

Rendering equivalence, scheduling, version availability, full redirect chains and complete parameter certification remain Pending. No whole-controller certification is claimed. Publication and final combined regression for these latest changes are separate gates.
