# ModifyExplod removeonchangestate — deferred initialization consumer

Pinned reference: Ikemen GO cb56d73badb322f3725257c2e8cfd157b2c3989d, bytecode.go modifyExplod explod_removeonchangestate and char.go Char.stateChange2. The modifier writes an evaluated boolean after removeongethit. State removal occurs after StateDef initialization, only for the initializing actor's owned effects, and waits while the actual state initialization is held by hitpause. Re-entering the same state also initializes and removes effects.

The WEB modifier now commits the actual selected effect flag, including explicit disabling. Root P1, P2/reaction and normal Helper actual initialization callbacks remove only that actor's flagged source Explods, before stopping its flagged sound channels. State selection alone does not remove them; deferred initialization after hitpause does. Existing Helper sound-only API callbacks remain supported.

Independent typed-boolean/evaluation-order checks pass. Sixteen production root/reaction/normal-Helper/profile/player/same-state cases create real Explods, update them through the actual controller dispatcher, select real state changes during hitpause and observe retained effects until actual initialization. Disabled flags, opposing effects and the Helper's root effects remain intact. Evidence: outputs/modify-explod-state-actor.log.

Remaining full fidelity: all foreign-state/provider initialization paths, state-initializer side effects and native draw-slot flag/removal phase parity, compiler/version diagnostics, remaining parameters and final versioned regression/publication. This is a real consumer, not whole-controller certification. Recoloring/RemapPal integration remains excluded; gameplay PalFX remains in scope.
