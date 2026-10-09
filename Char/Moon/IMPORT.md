# Sailor Moon — S0–S999 battle integration

Source: `SailorMoon.def`, `moon.cns`, `moon_Common.cns`, `moon_Helper.st`, `moon.cmd`, `moon.air`, `moon.sff`, `moon.snd`, `movelist.dat`.

- Source preserved in the local `outputs/moon` package with SHA-256 checksums.
- 109 state definitions, 865 controllers, 58 commands, 220 AIR sections, 1570 SFF sprites, 87 sounds.
- Author confirmed unfinished Actions 195/612/614/830/3199 and the State 823 → 10612 branch must be disabled.
- Compressed WEBP assets (quality 85, full alpha): `Battle/moon_full.json`; compressed audio: `Sound/sounds.json`.
- Actions 122/132/142/152 and 951 reference missing sprites 122,0 / 951,99; exported as empty frames with original timing, never replaced with Venus artwork.
- Duplicate source definitions 170 and 801 require source-order handling, not merging controllers by state number.

Playable SNES/Saturn basic-state profile: `Battle/moon_runtime.json`. P1/P2 use separate state, command, collision, animation and sound data. Includes ordinary attacks, rabbit jump, back dash, headbutt throw, common get-hit states, round initialization and HP/portrait helpers. 3DO hardware and command branches remain disabled; specials above S999 are not part of this release.

Duplicate definitions use the first source definition, matching IKEMEN's compiler; controllers never merge across duplicate definitions. Unfinished 195/811/822/823 and Actions 612/614/830/3199 remain disabled. Declaration screens temporarily use Moon's static selection portrait and original 191/192/180/170 voices, not Venus quote animation/audio.

Full animation export remains a source-preservation artifact. The battle profile preloads only the 12 pages needed by S0–S999 and common/round dependencies (about 180 MB decoded), not all 220 pages. Runtime readiness belongs to `moon_runtime.json`, not the full-archive manifest's `runtimeEnabled` flag.

Validation: `Tools/test_moon_states.py`, `Tools/check-moon-runtime.cjs`, `Tools/check-mode-flow-browser.cjs`.
