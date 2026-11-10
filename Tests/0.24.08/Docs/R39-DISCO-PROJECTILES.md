# r39 — Disco mirror selection and battle fixes

## Selection
Source E:/3D 2022/Select/DiscoBall v1.glb. Geometry, UVs, material regions and portrait arrangement retained. Whole-ball scale.35 matches previous layout; no rotation. Existing renderer/camera/red curtains/starfield reused, old ball and procedural effects hidden. Embedded portraits compressed WebP; GLB gzip488877B. Source Glow.Tuxedo/Moon/etc are empty nodes with no mesh/curve/extras. Exact border loops are derived from welded triangle boundaries of each Mirror.* primitive, projected with the actual model matrix/camera. No invented path coordinates. Several source portrait normals face inward: DoubleSide reproduces Blender visibility. Idle emission/transparent factor.20, selected/confirmed.05. P1 cyan/P2 pink independent moving points, confirmed continuous borders. Main roster unavailable entries remain dim/unselectable; hidden SuperMoon/LadySwatheshia not exposed; Tux portrait blank. Mirror raycast is sole character-selection hit target, original disc overlay/buttons removed. Portrait activation rectangles moved outside ball. Directional keyboard uses projected mirror centers; existing confirmation/ACS handoff preserved. Per-player Back, English Locked text, no Random stage option.

Legacy spark/glow implementation and assets are fully recoverable from commit58ecfe3258b0c2954562124b1502838e17225725 (Stage/Select/select-stage.js plus its referenced assets). Local copy outputs/r39-original-select-stage.js also retained.

## Battle
Moon901000–901010 replaced by fresh1280×720 WebP exports; worker hot-route bypasses old presentation-pack entries. Timeline unchanged.
JUP source removeongethit effects now clear immediately on custom throw capture, including MoonS800; gethit clearing also precedes effect pause early-return. Actual6 sourceS300X Explods tested.
Helper/projectile collision data remains owned by the original character during foreign custom states. Projectile clashes use attack boxes (fallback hurt boxes) against each other with continuous relative motion to avoid skipped crossings. Tiara/ordinary projectile trades retained below priority5; tier5+ resolves effective priority. Cancelled helpers cannot repeatedly re-enter override state/reset their removal AIR.
CycloneP1150 priority5 survives lower-priority projectiles/helpers. Guard cap3/5 consumes contact budget without removing visual/collision cancellation capability; remains until34/50T, thenA9043. Equal/higher priority can cancel early usingA9043. Expiry boundary corrected to exactN ticks. 16 priority combinations and source guard counts passed; old Moon/Saturn mutual cancellation regression passed.
Wink Chain SwordP1150 ignores old30T expiry, clamps its leading sprite edge to camera upper edge, stops velocity and playsA9041. Legacy Venus identity supplied explicitly because its old data lacks character metadata. Both sides and strengths tested; observed49T(L)/12T(H) at test camera, all at matching live sprite edge.

## Menu
All normal/selected artwork is decoded and rasterized ahead of home display; logo-to-home awaits carousel.ready. Ten persistent canvases toggle visibility instead of creating new images on switches. Five labels×100 switches preserve same nonempty canvas nodes.

## Evidence
R34 trace showsP1150entity185 five guards2367–2371, then anim=-1 removal at2371 before lifetime. Current tests retain until50T withA9043. Browser tests cover16 priority combinations,3/5 guards and34/50 expiry;4 Wink variants,6 original JUP effects on capture; Moon/Saturn regressions; desktop/mobile mirror picking, P1/P2 keyboard/confirmation;10 menu images/100 switches. Screenshots visually reviewed. Independent select-review.html added.
