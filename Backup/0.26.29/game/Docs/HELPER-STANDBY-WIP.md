# Helper standby consumers (partial)

Reference: Ikemen GO cb56d73badb322f3725257c2e8cfd157b2c3989d, Helper standby boolean evaluation; Char.ctrl, trackableByCamera/xScreenBound, clsnCheckSingle/projClsnCheck, player/projectile hit detection, pushDetection and enemy eligibility.

Helper creation now consumes a typed standby boolean, default false. Actual Ctrl queries return false during standby without replacing the stored control flag; Standby queries expose the flag. The Helper continues its state body, movement and animation clocks. Standby does not act as global pause or disabled.

Real contact/collision adapters and Helper hit loops exclude standby attackers and recipients. Existing enemy/reversal/corner-push filters now receive the actual field. Proximity guard excludes standby Helpers. PlayerPush excludes them even if enabled explicitly. Camera tracking excludes standby Helpers on both axes; screen bounds no longer clamp them to the camera, while stage bounds still apply. Spawned projectile entities remain separate and are not silently frozen because their owner is standby.

Evidence: semantic constructor checks cover one caller-context evaluation, boolean/number/string/NaN/undefined conversion and raw control preservation. Forty-eight browser combinations cover both character versions, players, Helper types and default/explicit flags, actual CNS/velocity/clock progression, positive and negative attack/recipient collision/contact/control/push and proximity-guard paths. Additional actual camera and screen-vs-stage boundary checks cover an offscreen player-type Helper with the camera reset before screen-clamp assertions. All 290 Node checks, fourteen related browser regressions and full-battle simultaneous/1-tick/5-tick super regressions pass.

Pending: complete compiler ordering and all native tag/team participation, guard-distance/box/provider/cross-actor phase edge cases, native debug-visual standby colors and executable differential certification. These tests do not certify the full Helper controller or every tag-system use of standby. Character recoloring remains excluded; gameplay palette effects remain. No original assets or media are added.
