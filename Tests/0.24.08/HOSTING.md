# Moon Palace 0.24.08 test page

R2 removes the old result-state watchdog entirely: no animation-loop rescue may force S0 and bypass source cleanup. Jupiter's 3005→3006→3007→0 chain removes E9066 under KO and time-over for both players. Supplemental WebP sprite sheets for Jupiter, Neptune and Saturn supply native SFF sprites referenced by Moon's foreign A805; they do not replace its AIR elements, timing or collision table. The sprite supplements are loaded with the selected characters. B1-9-CHECK.md records the five-character usage audit; none of the nine generic changes were imported.

Open index.html over HTTPS. The launcher installs an asset router scoped only to this test directory, then opens game.html.

The original baseline is commit 5e65ded09d5c645c7ef2ed4b088f3b957b94138f. R1 changes only game.html and adds Engine/baseline-fixes.js for the requested post-KO effect binding/independent hitpause, finish-state facing and ChangeAnim2 sprite ownership fixes. asset-map.json still routes unmodified historical files to frozen backup files with identical Git blob hashes. No current main-game or WASM code is substituted. BUG-CANDIDATES.md lists optional later fixes that have not been applied.

The launcher/router are hosting infrastructure only. Apart from the three R1 fixes, gameplay, assets, timing and known bugs remain those of 0.24.08. This is a baseline for user testing, not a performance certification. The existing Three.js CDN dependency is retained.
