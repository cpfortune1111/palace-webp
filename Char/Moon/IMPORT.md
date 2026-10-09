# Sailor Moon import — battle integration pending

Source: `SailorMoon.def`, `moon.cns`, `moon_Common.cns`, `moon_Helper.st`, `moon.cmd`, `moon.air`, `moon.sff`, `moon.snd`, `movelist.dat`.

- Source preserved in the local `outputs/moon` package with SHA-256 checksums.
- 109 state definitions, 865 controllers, 58 commands, 220 AIR sections, 1570 SFF sprites, 87 sounds.
- Author confirmed unfinished Actions 195/612/614/830/3199 and the State 823 → 10612 branch must be disabled.
- Compressed WEBP assets (quality 85, full alpha): `Battle/moon_full.json`; compressed audio: `Sound/sounds.json`.
- Actions 122/132/142/152 and 951 reference missing sprites 122,0 / 951,99; exported as empty frames with original timing, never replaced with Venus artwork.
- Duplicate source definitions 170 and 801 require source-order handling, not merging controllers by state number.

Not playable yet. The live battle engine still shares Venus state, command, animation, sound and helper data between P1/P2. Moon must use independent per-player datasets before enabling its selection cell. TargetBind / TargetState / TargetLifeAdd / ChangeAnim2 and other Moon-specific controllers also need implementation and mixed-character battle tests. Do not enable Moon by removing the selection guard alone.

Full animation export is a source-preservation artifact, not a preload manifest. Loading every page together would use excessive decoded-image memory; build a reachable-action asset set or a bounded on-demand cache before runtime integration.
