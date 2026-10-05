# Selection artwork and modes

Selection uses separate portrait, name and disc artwork from the supplied Select/WEB exports, not character SFF 9000,1. Portraits retain their exported canvas coordinates and are translated to system.def p1.face.offset / p2.face.offset; name artwork is centered on each player anchor. The disc artwork retains its supplied placement on the central globe.

Character images live in Char/<character>/Select; stage titles in Stage/<stage>/Select; shared hardware and command icons in Data/Select/Mode. Transparent margins are cropped with original positions recorded in Data/Select/selection-assets.json. The exporter uses WEBP quality 90 and keeps the original source PNGs unchanged.

Hardware and command artwork share a 0.75 display scale. Pending icons hold frame 0, the active selection alternates frames 0 and 1 every four 60 Hz ticks, and confirmed icons hold frame 1. Stage titles follow the same rule. Artwork is decoded before selection becomes interactive.

Order: P1 character, P2 character, P1 hardware, P2 hardware, P1 command, P2 command, stage. Enter/Z/Numpad0 confirms; direction keys change choices; Escape/Back returns one step and clears later confirmations. Both players' hardware and command choices carry into combat, scoring and subsequent round resets.

All supplied character artwork is included, but only Venus and Training are playable until additional fighters and stages are implemented.

The selection background now uses Stage/Select/Select.glb.gz, converted from Select v1.glb with WEBP textures (maximum 2048 pixels). Its three original animation clips are preserved. Sphere.004 receives a cyan inner rim and soft outer halo; seven rear glare rays gently vary in intensity and direction. Ninety-six deterministic light particles descend and flare near the lower edge. Effects are additive shaders rather than full-screen bloom, so portraits and text are not blurred. Existing disc artwork remains a separate overlay. Animation stops while the selection page is hidden, and the static background remains the fallback if the 3D model cannot load.

The original Blender file is not modified. Rebuild the web model with Tools/export_select_stage.py. The camera preset named Original IKEMEN Camera corresponds to Blender location (0, -7.2, 1.6), XYZ Euler rotation (90, 0, 0) degrees: native glTF position (0, 1.6, 7.2), facing -Z, vertical FOV 30 degrees. This selection model is not given the title model's separate scale/offset transform. Disc artwork and selection hitboxes are resized together for the new camera framing; portrait/name anchors are unchanged.

The 3D animation, glow, beams and particles advance at 30 Hz with unchanged playback duration. Fractional time accumulates between updates rather than slowing animation by dropping elapsed time. Leaving selection stops animation and clears fractional timing. Hardware/command icon logic retains its original four-tick timing.

Airborne particles have a dedicated soft halo pass sharing their core positions. All particles stop at ground before fading; eight-point star cores retain their size, round cores expand, and all halos expand and intensify. Beam shafts originate behind the sphere center with shorter fading tails. Beams brighten over 6 ticks, fade completely over 36 ticks, then remain invisible for a seeded random 90–180 ticks. Reflection stars brighten over 4 ticks and fade completely over 8 ticks. The upper-right star moves 20 logical screen pixels left. Existing inner/outer sphere glow and other star sizes remain unchanged.

The updated GLB preserves the longer curtain animations and removes its old sky. Stage/Select/background.webp supplies the new starfield, converted from the supplied JPG at quality 88. Animation remains 30 FPS with the original IKEMEN camera.

Particle size uses a 2x multiplier in both airborne and landing phases, with an additional deterministic size distribution. One third are round glows and two thirds are slender eight-point stars. Rear glare beams now use narrow, long shafts with independent intensity and a visible +/-0.24-radian angular sweep. Three fixed reflection-star positions only pulse in brightness: upper-left surface, upper-right behind the sphere, lower-right surface. The two surface stars are composited after the separate character disc artwork and before large portraits, so they remain visible without covering player portraits. Inner/outer glow parameters remain unchanged. Effect parameters are in Stage/Select/select-stage.js.

Run Tools/export_selection_assets.py with Pillow to rebuild, and node Tools/check-selection.cjs to validate navigation, mode payloads, rendering and asset paths. Tools/check-selection-browser.cjs also validates the loaded 3D effects, animation, hidden-page pause and absence of shader errors; it uses a local Three.js r180 test mirror under outputs/three-r180 to avoid restricted external browser requests.
