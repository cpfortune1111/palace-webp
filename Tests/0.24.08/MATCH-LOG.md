# Match diagnostics (0.24.08-r8)

During a match, press MARK (or F7) when you notice a problem. Press LOG (or F8) to download the JSON file. F8 also works after the result screen. Send that file with the marker number and a short description of what looked wrong. No data is uploaded automatically.

Recording begins when a match starts, and includes introductions, all rounds and the result transition until the next match starts. Rows contain tick/60 seconds, round phase, both players' State, State Time, Anim, Element, world position/velocity, facing, HP, control, MoveType and hit pause/shake. Additional data includes camera, effect count and helper/projectile state/position. Runtime errors add markers automatically.

The compact format declares its columns in fields and rowFields. The last ten seconds of the older detailed input/hit trace are also included. This is a diagnostic log, not a replay. A safety limit stops recording after one hour; the exported markers explicitly report that limit.

Audio preparation now downloads and decodes all battle sounds for the selected characters, plus shared sounds and the announcer, before starting the match. Decoded sounds from unselected characters are released on the next preparation. This can make the loading screen longer, but avoids first-play downloads/decode during combat.

Moon S430 intentionally allows a hit-confirm self-cancel after element 5 in moon.cmd; it does not require MoveType I. AI command evaluation now respects each actor's hit pause and super-pause.
