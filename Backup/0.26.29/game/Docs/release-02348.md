# 0.23.48 — Stage projection, transitions and portraits

- Stage model projection follows IKEMEN drawModel: identity view/no camera tilt, source model offset/scale/FOV, zoom via model Z offset and source vertical anchor. Removes the former guessed camera pose, 1.86 lens calibration and 60px view shift. Stage camera framing and bounds retain the existing compatible subset.
- Portrait Explods always render on the foreground effect canvas. Previously run/backdash sprite priorities incorrectly sent portraits behind the white portrait backplates, making them look translucent. No portrait opacity animation is introduced.
- Opening: black to clear in 60 simulation ticks. Match end: clear to black in 60 ticks. Between rounds: 30 ticks to black, reset under black, then 30 ticks to clear. Combat and presentation controllers are stopped during transitions.
- User-approved override: additional IKEMEN KO velocity is disabled. HitDef ground/air velocities remain unchanged; lethal hits still use KO fall behavior. The original default profile is retained for reference with enabled=false, and the exporter preserves that override.

Projection reference: https://github.com/ikemen-engine/Ikemen-GO/blob/develop/src/model.go (Stage.drawModel).
KO reference: https://github.com/ikemen-engine/Ikemen-GO/blob/develop/src/char.go (hit behavior on KO).
