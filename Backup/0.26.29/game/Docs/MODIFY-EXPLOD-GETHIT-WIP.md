# ModifyExplod removeongethit — partial contact consumer

Pinned reference: Ikemen GO cb56d73badb322f3725257c2e8cfd157b2c3989d, bytecode.go modifyExplod explod_removeongethit and char.go Explod.update. The native modifier writes an evaluated boolean; removal checks the actual parent getting hit outside guard states.

The WEB modifier now changes the actual selected effects, supports explicit disabling, and uses typed boolean conversion. Qualified non-guard ground/air contacts remove only flagged effects owned by that root or Helper instance. Opposing effects and the Helper's root effects remain intact. Native-modified effects bypass the three broad legacy root removal loops, preventing those loops from removing them on guards or by player number alone. Unmodified legacy effects retain their existing behavior.

Independent extraction checks and 64 production-dispatcher/root/Helper/profile/player/ground/air contact cases pass, including guarded and None reactions, enabled/disabled mutations and owner isolation. Evidence: outputs/modify-explod-removeongethit-actor.log. These cases use real Explod creation, ModifyExplod selection and the shared accepted-contact resolver, not synthetic array-only deletion.

Remaining: native tickNextFrame/update ordering versus immediate accepted-contact removal, exact gethit/inGuardState snapshots for KeepState/HitOverride and simultaneous contacts, parent disappearance, binding, remaining parameters and final combined gates/publication. This is not whole-controller or native lifecycle certification. Character recoloring and further RemapPal work remain excluded by user request; gameplay PalFX effects remain in scope.
