# Height integration — partial

Pinned reference: Ikemen GO cb56d73badb322f3725257c2e8cfd157b2c3989d, compiler_functions.go height, bytecode.go height.Run and char.go sizeToBox/reset.

Shared actual root/helper dispatcher consumes required float value pair, optional second value default zero, redirected recipient and caller-context expression/localcoord ratio. Actor-owned modifiers feed actual Size target collision geometry. Ordinary root/helper resets clear modifiers; hitpause/global-pause gates retain them. Unit tests cover signed pairs, missing recipients and ratio. Full baseline regression passed in outputs/controller-height-integration.log. Focused actual helper collision fixture requires an attack outside the original Size top to become a contact after Height adds 200; outputs/controller-height-size-actual.log.

Actual source dispatch and reset fixtures now prove redirected P2 retains [40,10] during hitpause/global pause then resets to [0,0] on an ordinary frame. A helper source Height at Time=0 retains [30,5] during hitpause, then clears on the next ordinary actor frame. Complete regression passed with exit code 0 in outputs/controller-height-reset-actual.log. Size collision actual regression also passed in outputs/controller-height-size-actual.log.

Native compiler diagnostics, source-localcoord metadata and exact native time ownership remain pending. Do not count Height fully certified yet.
