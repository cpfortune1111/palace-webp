# Trans — in progress

Pinned Ikemen GO cb56d73badb322f3725257c2e8cfd157b2c3989d, compiler.go paramTrans and bytecode.go trans.Run.

Parameter policy covers default/none/add/add1/addalpha/sub/subadd, optional alpha component defaults, strict versus lenient invalid/blank handling, Mugen sub alpha locking, caller-context redirect and integer clamping. Unit checks pass. This is not yet connected to rendering or actor reset and does not count as implemented execution.

Next: reproduce native blend equations (including independent source/destination coefficients and subtraction), root/helper dispatch and reset, AIR precedence, actual pixel tests, then versioned publishing. Do not replace arbitrary destination coefficients with Canvas globalAlpha alone.
Added native blend-pass planning from renderWithBlending: independent destination attenuation/source addition, reverse subtraction, None destination override, transparent skip, and ordered grayscale/color SubAdd passes. RGB policy tests pass, including a semitransparent source with independent 128/64 coefficients. This is not a renderer yet; palette shader effects, alpha framebuffer behavior, full inversion cases and shared stage/actor composition remain pending.

Offset correction regression completed with exit code 0 in outputs/controller-offset-hitpause-correction.log. Root/helper offsets now reset during hitpause for the current Mugen 1.1/Ikemen scope; this correction must be published, not left only local.
Added opaque-destination RGBA and Canvas compositors consuming the native pass plan. They reject unresolved translucent destinations and SubAdd without an explicit shader-equivalent grayscale surface, rather than silently approximating. Unit tests pass for addition/subtraction/transparent pixels and SubAdd. Added browser Canvas subtraction/preservation fixture. Runtime shared stage/actor composition is still not wired; no implemented-controller claim.