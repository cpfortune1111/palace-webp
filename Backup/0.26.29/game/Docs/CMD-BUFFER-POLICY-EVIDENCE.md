# Command buffering policy — partial compatibility evidence

Runtime 0.26.29 separates commandUpdate's buffering decision from command matching and from pause arbitration. It does not certify full native tick order, Pause/SuperPause ownership/timers or all input handling.

`Engine/command-buffer-policy.js` implements the pinned commandUpdate decisions for active movement allowance, hitpause buffering controlled by the owning character's float32 input.pauseonhitpause constant, SuperPause precedence over normal Pause, end-command window bounds, WinMUGEN's extra frame and source-version-specific Helper restrictions. Its pause timer/allowance inputs must already represent the native global scheduler state. Passing default zeros is not a substitute for connecting that scheduler.

## Native differential evidence

`Tools/build-native-command-policy.py` extracts three unchanged statement blocks from commandUpdate in pinned char.go. Fixture facades supply timers, allowances, own constants and source versions. The Go 1.27.3 reference is not a complete CharList executable, and no native generated code or executable is published.

- Ikemen GO commit: `cb56d73badb322f3725257c2e8cfd157b2c3989d`
- char.go SHA-256: `7f8839374168cf5948d190268e6bdad73c61dac4febadb015cd501d46a579bf7`
- Active-allowance block: `9aebc9522f81bcfbb900c1d9bba2d4def2d33b7b97f6e3519c2750b70ffe2eff`
- Buffer flags block: `5354aeec029731d3930203f26770519374aa80381ae3787d54766d4b23c77838`
- Extra-time/Helper block: `64c0d94fbf151da6dc20fd7d6d4bce681a9d3c74dcfaf0e098668d9d81e138bc`

`Tools/check-command-policy-native.mjs` passes **8,788 combinations** of hitpause, the float32 constant, source engine versions, Helper status, both pause timers, movement allowances and command-buffer windows. Boundary cases include negative windows/allowances, simultaneous Pause/SuperPause, equality at the window boundary and float32 underflow/subnormals. All returned flags and extra-time values match the compiled native blocks.

## Current battle handoff

The real sampler now honors the owning character's input.pauseonhitpause constant, reads buffering version rules from the current State provider, and passes the explicit source-version Helper restriction to the matcher. Helpers blocked by Pause/SuperPause are no longer mislabeled as being in HitPause. Per-command buffer controls still run in the existing verified matcher.

The five-character P1/P2 browser gate adds **40 policy observations**: zero/nonzero constants and WinMUGEN versus MUGEN 1.0 buffering produce the expected exact buffer values, through real sampling and expression contexts. Existing raw CMD/Defaults/Remap/OR/charge/expiry/facing/peer-isolation fixtures continue to pass. Browser fixtures temporarily override metadata/constants and restore them; installed character files are not rewritten.

The policy function's Pause/SuperPause end-window branches are **component-tested only**. The battle handoff currently does not supply native global pause timers/end-window state. Existing per-player Web pause arrays and movement allowance handling differ from the pinned native arbitration model; these must be reconciled rather than approximated by taking a maximum timer. [The standalone global state component](GLOBAL-PAUSE-EVIDENCE.md) now supplies native-tested operations for that migration, but is not connected to battle. InputWait/noinput reset, auto-turn/updateFBFlip ordering, full State -1 execution and cross-player command-list ownership also remain incomplete. Current counter-to-hitPauseTime mapping requires broader scheduler verification. The complete battle regression on the HitPause/Helper consumer repair passes; metadata/cache revisions and the unconnected standalone component do not change those function bodies.

```text
python Tools/build-native-command-policy.py --char ../outputs/ikemen-char.go --go ../outputs/toolchains/go1.27.3/go/bin/go.exe --output ../outputs/native-command-policy
node Tools/check-command-policy-native.mjs ../outputs/native-command-policy/build-receipt.json
node Tools/check-battle-command-browser.cjs
```
