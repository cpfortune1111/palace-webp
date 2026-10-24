# ModifyExplod visual consumers — partial

Pinned reference: Ikemen GO cb56d73badb322f3725257c2e8cfd157b2c3989d, bytecode.go modifyExplod facing/vfacing/sprpriority/layerno/ontop/under cases and MUGEN postype reset.

Facing and vertical facing respect native parameter locks and character-version restrictions: MUGEN characters cannot flip an already left-facing or upside-down effect back through these writes, while Ikemen characters can. Native postype reset uses the pre-commit facing state. Layer/priority commit order is preserved: ontop=true forces layer 1/priority 0; ontop=false resets layer only when previously true. Under=true is sticky in the pinned implementation; false evaluates but does not clear it.

Independent tests verify extraction order and these native conditional writes. Sixteen actual root/normal-Helper/profile/player/character-version cases verify effect fields, real drawing transforms and layer/priority/ontop/under draw entries (outputs/modify-explod-visual-consumers.log). Other ModifyExplod fields, exhaustive diagnostics/version/native GPU parity and final regression/publication remain Pending; no whole-controller certification is claimed.
