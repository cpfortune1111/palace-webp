# Native global Pause state — standalone component evidence

Status: **Partial**. `Engine/global-pause-state.js` executes pinned Ikemen global timer/allowance operations. It is **not yet connected to the battle scheduler**. The existing per-player pause arrays still drive battle freezing; this component must replace them with correct phase placement before global pause compatibility can be claimed.

The implementation covers buffered next-phase activation, within-buffer arbitration by duration/player/foreign-State owner, end-command window validation, SuperPause precedence, movetime setup and eligible preparation-time decrement, timer-only reset, unfaded/unhittable timers, float32 defence multiplication and ignore-darken propagation through the own-palette family tree. These are data-state transitions, not rendered darkening or complete controller expression/default handling.

## Exact reference scope

`Tools/build-native-global-pause.py` compiles five unchanged declarations: native setPauseTime, setSuperPauseTime, propagateIgnoreDarkenTime, Max and Btoi. Four unchanged statement blocks provide global timer advancement, selected actionPrepare fields, movetime stepping and timer-only reset. Fixture facades supply character/State identities, palette ancestry, child-ID lookup and command-list presence. The wrapper does not execute basic input actions inside actionPrepare, the full System action loop, collision or rendering.

Pinned commit: `cb56d73badb322f3725257c2e8cfd157b2c3989d`.

| Source | SHA-256 |
| --- | --- |
| char.go | `7f8839374168cf5948d190268e6bdad73c61dac4febadb015cd501d46a579bf7` |
| system.go | `b1784a92a937f5c940e7a99fc5025f807af497a23bc447c861c276bdbb51bf77` |
| common.go | `d7a40673b3bfcd7f6b320747e37679431fefd1aad7040e2d1f60484e03148ac6` |

The private build receipt records every declaration/block hash and executable checksum. No native generated source, executable or toolchain is published.

## Executed comparisons

`Tools/check-global-pause-native.mjs` passes **289 scenarios / 7,459 transitions**. Every transition compares both timer slots, pending buffers, owners, buffer windows, background flags and six actors' movement/previous movement/paused/action flags, unhittable/ignore-darken timers and defence multipliers. Fixtures include two roots, shared-palette children, an own-palette boundary, a stale child ID and a foreign-State helper.

Cases exercise zero/negative/int32-boundary durations, repeated same-player overrides, competing players, foreign-State overrides, pending versus active timers, simultaneous normal/super pauses, command-list absence, hitpause during preparation, reset retention and seeded action sequences. Float32 defence snapshots are normalized back to float32 after native JSON encoding before comparison.

The native arbitration compares the encoded **pending buffer**, not simply the largest active remaining time. Setters also update actor allowances and selected SuperPause effects even when a competing global timer is not accepted. Reset clears timer/buffer fields while retaining owner/window/background fields and actor data. These details are preserved rather than replaced by a maximum-of-per-player-timers approximation.

## Remaining integration

The caller must place timer activation before commandUpdate and eligible movetime stepping at the native preparation phase. State evaluation, helper creation/destruction, palette ownership, ModifyPlayer allowances, pause FX, stage freezing and end-command buffering must share the same global state. Current battle pause anticipation/per-player arrays do not provide this contract and remain to be replaced. Complete actor initialization/flag handling, malformed hierarchy behavior, full own-palette rendering and all version profiles are not certified.

This gate verifies pinned Ikemen behavior. Source comments describe differences from MUGEN's last-trigger arbitration; no independent MUGEN executable comparison is claimed.

```text
python Tools/build-native-global-pause.py --char ../outputs/ikemen-char.go --system ../outputs/ikemen-system.go --common ../outputs/ikemen-common-pinned.go --go ../outputs/toolchains/go1.27.3/go/bin/go.exe --output ../outputs/native-global-pause
node Tools/check-global-pause-native.mjs ../outputs/native-global-pause/build-receipt.json
```
