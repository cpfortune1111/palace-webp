# GetHit resource consumption — preparatory, not certified

Reference: Ikemen GO `cb56d73badb322f3725257c2e8cfd157b2c3989d`, `src/char.go` actionRun resource-consumption branch and `src/compiler_functions.go` GetHitVarSet compiler.

The pinned compiler exposes 48 GetHitVarSet parameter names including redirectid. `check-get-hit-set-inventory.mjs` compares that complete pinned name list with the existing setter table; no name is absent. This does not establish semantic completion.

Native damage, redlife, dizzypoints and guardpoints are queued GetHit fields. During actionRun, each nonzero value is consumed in that order only when MoveType is H, or KeepState is active without a HitOverride. Each field is then cleared even when the resource operation is skipped. Negative values reverse the resource delta. GetHitVarSet therefore cannot be certified merely because a field can be stored and queried.

`get-hit-resource-consumer.js` implements that branch with an explicit native override index and resource callbacks. Focused tests cover ordering, H/KeepState/override eligibility, negative values and one-time clearing. It is now bound to actual actor resource hooks in the explicit Ikemen engine profile. Ordinary contacts and GetHitVarSet share one queue there, so rewriting damage replaces pending damage rather than adding a second debit. The default Mugen 1.1 WEB path still uses legacy immediate resource effects and remains pending migration.

Required next work:

- Finish migrating all engine profiles and reaction paths into the same native queue; never add a second consumer on top of legacy immediate damage.
- Bind actual root/helper ownership, damage windows, native life/redlife/point methods and override state.
- Place consumption at the real actionRun phase and verify same-tick contact/setter overwrite ordering.
- Verify query visibility before/after consumption and full Mugen/Ikemen/version behavior.
- Retain the pinned compiler's hitcount-to-hittime alias separately from any documented-profile behavior.

All related certification remains Pending. No new controller is counted complete.

The selective reset bridge also retains WEB queue/override metadata while applying the exact native preserved-field list. In particular, queued damage/dizzy/guard points survive a reversal recipient reset, but queued red-life does not. See REVERSAL-RESOURCE-BRIDGE-WIP.md for the actual one-debit versus legacy-no-redebit fixture and remaining scheduler/override limitations.

Additional focused boundary evidence: each of the four queue fields wraps signed 32-bit accumulation at both integer limits, but converts to a floating-point value before negation during consumption, matching the pinned `-float64(c.ghv.field)` calls. Callback assertions verify that the field remains visible until its resource operation returns and is then cleared. Profile-transition tests discard legacy already-consumed values, preserve unrelated identity fields, and retain pending values on repeated queue preparation. These checks pass in `check-get-hit-resource-consumer.mjs`; they do not establish complete damage arithmetic or scheduler parity.
## Current evidence

The pinned System action loop runs character Prepare/Run/Finish before character update, fight-screen update and collision/global tick. Resource effects queued by collision are therefore consumed in a following character actionRun, after controller code. Reference: [System action order](https://github.com/ikemen-engine/Ikemen-GO/blob/cb56d73badb322f3725257c2e8cfd157b2c3989d/src/system.go#L2898), [resource consumption](https://github.com/ikemen-engine/Ikemen-GO/blob/cb56d73badb322f3725257c2e8cfd157b2c3989d/src/char.go#L12575).

Actual Ikemen-profile fixtures observe a 20-damage contact leaving HP unchanged, GetHitVarSet replacing it with 5, then one actor-resource consumption lowering HP by 5 while also consuming red-life/points and clearing queued fields. A real spawned Helper/controller/step fixture consumes once across two steps. These do not certify the entire per-actor scheduler, root/Helper run-order interactions, numeric damage edge cases or all engine profiles.

The first live queue regression completed with terminal exit 0 (outputs/controller-native-hit-resource-queue-browser.log), including existing default-profile combat regressions. A further full-driver fixture now routes accepted helper-origin hits into each real root, rewrites pending damage through redirected GetHitVarSet, and observes two simStep calls. This is additional root binding evidence, not proof that all root controller/collision phases match native ordering. Mugen/default migration and per-character run-order interleavings remain required.

The root-driver fixture now injects GetHitVarSet into each real State 5000 reaction controller list rather than invoking the setter externally. Its initial assertion passes for both roots: a 20-damage accepted contact remains pending, Time=0 CNS changes it to 5, first simStep consumes 5 and clears the field, and the second does not repeat damage. Another actual fixture uses HitOverride controllers to select the live override slot and verifies I/H plus KeepState eligibility. Full browser completion is still tracked separately.
