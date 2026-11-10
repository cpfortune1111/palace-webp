# r37 — throw synchronization, reflection and Settings

## Battle

Capture ticks mark both fighters so a newly captured fighter cannot be advanced again later in the capture tick. Both sides begin at Time=0 independent of the P2-before-P1 update order. Custom AIR with a source AnimTime transition holds its final element at the cycle boundary until the controller runs, instead of rendering E1 between E48 and SelfState5050. Source release velocities and bindings retained. Ground reflections now use the same drawFighterAIR primitive as the body, mirrored around ground with stage reflection yscale; H/V, facing, axes and AIR offsets are shared. They remain a separate canvas for floor compositing, using the same live/paused pose and sprite.

All20 Giant Swing variants (5 targets ×2 sides ×2 strengths) passed finite positions, binding, missing-sprite, facing, source velocity and landing checks. Actual-hit traces confirm source transitions and no E48→E1 wrap. Seven throw element reflection bounds match a mirror of the rendered body within2px.

## Settings

Full-screen artwork over intact home background; home carousel and logo link inert. No old popup fade/moving-corner transformation. Original1280×720 Settings BG fades28–68T. SVG files losslessly gzip-compressed. Crescent height1840→104 by60T, hold to144T, then620 by156T; changes from above to below hearts after156T. Heart follows supplied20/44/144/152/160T keyframes. Main heart scaleX loops100→20%, holds3T, returns100%, cosine easing over30T total. Four upper and four lower hearts spawn144T and reach specified positions/sizes160T. White trail follows heart clockwise from bottom tip to86% over20–120T, dash pattern120/80/70/20/30/10/20; trail and Sparkle shrink120–132T, Sparkle removed133T. Glows use supplied colors/blur. Controls fade160–172T, enabled160T. Back fades artwork20T and restores home control.

Control layout retained pending any further design instructions; moved centrally between heart rows. Preview: settings-review.html with replay/pause/scrub. Local real-home browser tests verify keyframes, background button lock and Back.
