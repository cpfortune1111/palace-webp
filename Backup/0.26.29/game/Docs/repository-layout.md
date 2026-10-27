# Web game layout (0.23.62)

- `index.html`: web entry point.
- `Engine/`: shared simulation, menu, selection and presentation modules.
- `Char/Venus/`: compiled Venus states, commands, sprites, sounds and original source snapshots.
- `Char/Mars/`: legacy Mars assets; not yet enabled as a playable fighter.
- `Stage/Training/`: playable training GLB and camera configuration.
- `Stage/Title/`: title GLB and reflective ocean renderer.
- `Stage/Common/`: shared stage filter.
- `Data/Logo/`: startup animation and WebP sprites.
- `Data/Fight/`: life bars, timer, round announcements and win icons.
- `Data/System/`: original system artwork; `Data/Select/` contains the static selection screen configuration and portrait.
- `Data/Common/`: shared character states and sprites.
- `Sound/`: title music, round voices and shared sound effects.
- `Tools/`: exporters and regression checks. `Tools/Legacy/` preserves previous utilities.
- `Docs/` and `Archive/DUMP/`: notes and historical snapshots.

`Data/asset-layout.json` maps original asset identifiers to their organized paths. `Engine/asset-paths.js` resolves requests through that map without modifying the original MUGEN identifiers stored inside compiled data. Modules use normal relative imports. Old root asset URLs are removed; there are no duplicate binary copies in the repository.

Export tools stage intermediate files in `work/` unless otherwise configured. Apply the layout map when promoting new exports to the organized asset directories. Run regression tools from the project workspace: `node work/Tools/check-specials.cjs --selection` and `--logo-intro`.

Selection follows SYSTEM.DEF's 1280×720 layout, four rows/six columns and original static artwork. Only Sailor Venus and Training have complete web runtime support; other choices are visibly disabled. VS, Training and Watch enter P1 selection, P2 selection, then stage selection. Escape/Back reverses those steps. The screen renderer is separate from the selection state so its static background can later be replaced by a GLB.

Startup letters use a tighter eight-pixel overlap in 1280×720 coordinates. After the final letter settles at tick 265, the logo holds 120 ticks, fades to black for 30, then fades into the loaded title for another 30. Loading time and background-tab pauses do not count toward playback. Slow frames never advance more than one animation tick.
