# Animation references and project FightFX (0.26.16, partial)

Reference: Ikemen GO cb56d73badb322f3725257c2e8cfd157b2c3989d, compiler paramPrefixValue, ChangeAnim/ChangeAnim2/ChangeState/SelfState/stateDef.Run, Char.getAnim/changeAnimEx/animSpriteSetup/clsnScaleWorld, and fightscreen.go newFightScreen/newFightFx. Original MUGEN 1.1 behavior remains independently in scope; pinned Ikemen behavior does not certify every MUGEN/version difference.

## Actual consumers

Numeric, literal S/F and dynamic S/F/empty references feed ChangeAnim/ChangeAnim2, transition anim and imported P1/P2/Helper StateDef entry. ChangeAnim/StateDef evaluates prefix before action; transition anim evaluates action before prefix. Source-player/ID selection retains its separate order. Helper callbacks receive the original StateDef expression before coercion. P2 imported lifecycle and reaction paths evaluate the animation once rather than repeating legacy initialization; side-effect fixtures verify this.

The verified project F library registers all 33 actions with the existing compressed atlas and source-verified empty collision rows. Source hashes, default 320x240 coordinates and scale 1 are recorded in Data/Common/fightfx-resource.json. The resource checker verifies them against the actual original directory without copying or publishing originals.

Common drawing scale follows native float32 fxScale * 320 / fxLocalCoord, then selfLocalCoord / 320, with the positive-coordinate guard. Common Clsn overrides use recipient coordinate units, independent of drawing scale. Animation/source ownership survives SelfState into anim=-1 destinations. Absent libraries retain the current action/source/progress, still apply explicit element operands, and accept resource-free -2 before library lookup. This does not implement any absent library's assets.

Common actions bypass game-specific character freeze/low-life-idle replacement rules and use their selected loop table. Frame selection, sprite metadata, atlas crops and finite-action last-tick wraps have actual project-action fixtures; general native animation phase/AnimTime fidelity is still pending.

ChangeAnim/ChangeAnim2 redirectid resolves the live non-disabled target before later operands. Source/element/reference expressions retain the original caller context. Writes select the real P1/P2/reaction/Helper binding, including P1 global lifecycle calls; reaction writes synchronize live root animation and clock. Invalid/disabled targets skip later side-effecting operands. ReadPlayerID also uses disabled-aware lookup.

## Evidence and limits

All 299 Node checks pass. Dedicated browser cases cover own/common/dynamic prefixes on both roots and Helper; mixed animation/sprite providers and scale; all 33 common actions and every root/Helper atlas frame; finite-action wrap; common OverrideClsn coordinates; actual StateDef and transition entries; side-effect evaluation counts; SelfState ownership retention; root/root and root/Helper redirect caller scope; missing/disabled targets; global P1 binding; and P1 reaction synchronization. The common resource Python check passes against source hashes/AIR. Six latest related browser gates and the final complete simultaneous/one-tick/five-tick Saturn battle regression pass. Publication remains unverified.

CHANGE-ANIMATION-COVERAGE.json enumerates every pinned controller/common field with Partial/Pending evidence and remaining limits. Its test proves enumeration and evidence paths, not semantic completeness.

Mixed-character redirected cases also verify that Saturn -> Moon default providers use the Moon recipient; redirected ChangeAnim2 with a Saturn-owned target state selects Saturn animation plus Moon sprites. The dedicated gate passes with these cases. Six related entry/scheduling/dust/Explod/history/self-animation browser gates pass on the current runtime.

Pending: character fightfxprefix overrides and arbitrary registered libraries; cold source resources and complete export-time prefix analysis; exact native player-slot identity/team cardinality and all provider queries; full compiler/type validation, original-MUGEN cross-table quirks and -2 version differences; complete legacy common-state cleanup/number special cases; general animation/render/paused phase and AnimTime fidelity; angle/shear/history/palette edge cases; native warning parity and executable differential certification. No whole-controller or complete parameter certification is claimed. Character recoloring remains excluded; gameplay PalFX remains in scope. No original SFF/SND/AIR is added.
