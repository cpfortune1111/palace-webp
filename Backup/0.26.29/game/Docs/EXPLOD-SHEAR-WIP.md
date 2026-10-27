# Explod xshear consumers (partial, unpublished)

The actual matrix fixture now expands to 192 cases, adding all horizontal/VFACING combinations and sprite scales 1,1 versus 2,3. An independent unrotated zero-shear draw establishes the signed vertical scale used in native sprite-axis compensation; each rotated/nonrotated shear is compared against its own reflection-corrected baseline. Translation and all four linear coefficients are checked. This covers ordinary affine reflection/scaling combinations but is not native GPU/perspective/AIR-flip/interpolation equivalence.

Reference: pinned Ikemen GO cb56d73badb322f3725257c2e8cfd157b2c3989d bytecode.go explod_xshear; anim.go DrawList.draw shear/axis correction and Animation.Draw rxadd scaling; render.go initRenderSpriteQuad, applyProjection, applyShear and renderSpriteQuad.

WEB ordinary Explod creation now samples xshear as float32 after the angle fields. Drawing applies the camera-scaled affine shear before sprite scale/rotation. The native unrotated path bakes shear into bottom quad vertices; the rotated path applies a shear matrix plus sprite-height/axis compensation, so they are not replaced by one uniform transform. The current consumer retains this distinction and does not mutate stored angle/shear values.

Node tests cover extraction/defaults, invalid runtime strings and native-style compensation operation order. Twenty-four actual P1/P2/Helper browser cases cover shear -0.5/+0.5, Z rotations 0/90 and camera zoom 0.75/1.25. Real draw matrices are checked against independent baseline/quad compensation equations including translation, not only retained metadata.

This is partial orthographic, untiled, ordinary sprite coverage. Combined horizontal/vertical/AIR flips, arbitrary X/Y rotations, interpolation, screen coordinates, aspect normalization, redirects/localcoords, syncparams inheritance, GPU raster equivalence and perspective remain Pending. No whole xshear/Explod certification is claimed.
