# 0.23.6 — Sprite / Edge / Turn M1

- Render each atlas rectangle through a cached, unscaled sprite canvas before display scaling. This prevents filtering from sampling adjacent sprites without changing source pixels or turning off smooth display scaling.
- Use the existing StageTraining screen margins (60 logical pixels) for fighter axes instead of the current AIR frame's image width. Restore the missing fixed-width limit from IKEMEN's camera target-edge calculation, using the existing fixed 1280-wide view. Sprite changes no longer move the fighter or camera horizontally at the edge.
- Import standing turn AIR 5 and crouching turn AIR 6 from the original Venus SFF/AIR: three frames each, durations 1/4/1. Keep SFF axes, palette alpha, AIR offsets, and flip fields. Track turn animation time independently of state time.
- Evaluate each fighter's grounded auto-turn independently before forward/back input sampling. Use the source engine's eligible states and preserve P1 world velocity when facing changes. State 50/51 stays facing-locked; State 40 keeps the existing jump-start facing behavior.
- Keep the established camera calibration (1.86 zoom, -60 stage shift, ground 660), world bounds, physics, and keyboard/touch controls.

## Sources

Venus `SailorVenus.def` identifies MUGEN 1.0, localcoord 1280,720, version 10/22/2022, author TsukinoAi+.
`venus_Common.cns` State 0, 11, and 20 define the returns from Anim 5/6. `StageTraining.def` defines screenleft/screenright = 60. Other local stage settings differ from the locked prototype baseline and are not migrated.

`venus_turn.json` records SHA-256 hashes of the original SFF and AIR. Rebuild the two turn assets with Pillow installed:

```text
python export_venus_turn.py <SailorVenus-source-directory> <output-directory>
```

IKEMEN GO source read from develop:
- `src/char.go` blob `6b0e203da1ef75e60577122adcd87284813a4721`: autoTurn, setFacing, xScreenBound, grounded auto-turn eligibility before input.
- `src/camera.go` blob `bfe3affd6151dee9c208ab1092201a4edd5ae8f6`: Fighting_View target-edge width limiting and screen-margin correction. The prototype applies this with fixed zoom rather than adding variable zoom.
- `src/system.go` blob `8b9788f73593cfc6878fe745ab37e3b4c1437247`: screenleft/screenright axis limits.
- `src/image.go` blob `1109688ce3208fa026f195f3485e3fc74833b8ca`: SFFv2 headers, palette alpha, PNG formats.

## Validation

Headless Edge reproduces atlas bleeding on walking sprites 20,4 and 20,3; isolated rendering removes 37 and 21 foreign pixels respectively at the tested scale. Original sprite crops have no horizontal stripe.
Full local runtime checks verify AIR 5/6 frame sequence 0,1,1,1,1,2 then normal animation; P2 can turn while P1 is airborne; left/right edge backward jumps retain X=-3430/+3430 through landing; keyboard movement/attack works; no browser script errors.
Existing input-mode regression checks and module syntax validation pass. Visual checks include the isolated walking frames and original SFF turn sprites in the running scene.

