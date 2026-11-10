# r36 — 3D VS declaration and comfort changes

## VS source and rendering

Uses supplied VS.glb unchanged inside gzip:285680→112782 bytes; decompressed SHA256 c6c7ac7e3b500e344704cbcc95ea18bdf3dfad44e2aec22b8d38091afca28fce. Original geometry, Blender node transform, Front/Side base colours, metalness0.35/0.6, roughness0.35/0.25 and clearcoat0.2 retained. Studio environment and lights illuminate existing PBR materials. Center pivot derived from transformed bounds. One shared transparent1280×720 renderer; cache frozen192T frame through dialogue. No new render while pose unchanged.

VS centered640,360. Linear entrance: at0T60% viewport height/0turns; at192T20%/3clockwise Y-axis turns, front-facing. Both portraits run9010 ready actions during entrance, without speech cues. At192T P2 starts voice/mouth animation.15T speaker gap, then P1. No post-P1 hold: outro begins as its voice ends.

Outro:112T to1.75 additional clockwise turns and scale0. Rotation/shrink clamp there. At96T (1.5 additional turns), whole declaration starts black fade, completed36T later at132T. Only then complete→battle. Fade overlays portraits and VS. Result/loser/winner declaration timing and order remain their previous30Tmovement+15Thold path.

## Other changes

Character-name wins use centerY300, matching ROUND/KO/etc instead of178. LOADING section and its canvas fill are black.

vs-review.html offers entrance/outro playback and scrub. Imported title/select/declaration modules use updated revision URLs.

## Validation

Actual renderer alpha bounds verify432px/144px heights (60%/20%), center640,360, exact3turn finish. Original material values checked. Cached rendering tested. Pure flow tests verify192T silence, P2→P1 and outro96/112/132T, result order unchanged. Real quote portraits/metadata confirm9010 stays active and no sound before192T, first P2 cue exactly192T, proper completion132T after exit. Black loading verified by canvas pixel and computed CSS. Winner glyph top264.5=center300-71/2. Screenshots reviewed at front,45-degree spin and full portrait composite.
