# Sailor Moon — S0–S4999 non-3DO battle integration

Source: `SailorMoon.def`, `moon.cns`, `moon_Common.cns`, `moon_Helper.st`, `moon.cmd`, `moon.air`, `moon.sff`, `moon.snd`, `movelist.dat`.

- Source preserved in the local `outputs/moon` package with SHA-256 checksums.
- 109 state definitions, 865 controllers, 58 commands, 220 AIR sections, 1570 SFF sprites, 87 sounds.
- Author confirmed unfinished Actions 195/612/614/830/3199 and the State 823 → 10612 branch must be disabled.
- Compressed WEBP assets (quality 85, full alpha): `Battle/moon_full.json`; compressed audio: `Sound/sounds.json`.
- Actions 122/132/142/152 and 951 reference missing sprites 122,0 / 951,99; exported as empty frames with original timing, never replaced with Venus artwork.
- Duplicate source definitions 170 and 801 require source-order handling, not merging controllers by state number.

Playable profile: `Battle/moon_runtime.json`. P1/P2 use separate state, command, collision, animation and sound data. Includes ordinary attacks, rabbit jump, back dash, headbutt throw, common get-hit states, round initialization, HP/portrait helpers, SNES Moon Tiara Action, airborne Moon Spiral Heart Attack, Sonic Cry and Silver Crystal (long/short). Hardware restrictions and low-life super eligibility follow the source. 3DO-only Body Attack, Screw Punch and Super Spiral Heart states/commands remain disabled.

Duplicate definitions use the first source definition, matching IKEMEN's compiler; controllers never merge across duplicate definitions. Unfinished 195/811/822/823 and Actions 612/614/830/3199 remain disabled. Declaration screens temporarily use Moon's static selection portrait and original 191/192/180/170 voices, not Venus quote animation/audio.

Full animation export remains a source-preservation artifact. The battle profile preloads only actions referenced by enabled states/effects plus dynamic animation variants, not all 220 pages. Super cinematics add substantial atlas memory. Runtime readiness belongs to `moon_runtime.json`, not the full-archive manifest's `runtimeEnabled` flag.

S0 resets Moon's intro pose immediately on entry, and presentation ticks execute Moon's own standing controllers. Missing Moon animations never fall back to Venus artwork. Helper velocities, sounds, floating variables, projectile contact and effects use the owning player's profile.

Validation: `Tools/test_moon_states.py`, `Tools/check-moon-runtime.cjs`, `Tools/check-mode-flow-browser.cjs`.
0.23.88: S1100 returns through S1110/A1110 (updated source name). Landing audio fires once per S52 entry. Moon Sonic Cry uses one HitDef contact key, helper hit shake expires, ground reactions apply source friction, and Silver Crystal effects anchor at ground level with source RANDOM offsets.

0.23.90: All source high-number states are included, including S5000–5500, S5900 and Helper 9999. Recovery SelfState returns through the owning character reaction pipeline. 3DO and previously identified unfinished branches remain excluded. Venus/Moon Explod expressions use the owning actor context and available action data instead of a fixed effect whitelist.


