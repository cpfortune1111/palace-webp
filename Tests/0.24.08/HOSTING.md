# Moon Palace 0.24.08 test page

Open index.html over HTTPS. The launcher installs an asset router scoped only to this test directory, then opens game.html.

game.html is the byte-identical index.html from commit 5e65ded09d5c645c7ef2ed4b088f3b957b94138f. Historical files that differ from the frozen 0.26.29 backup are stored here unchanged. asset-map.json routes all other historical files to backup files with identical Git blob hashes. Responses preserve the original test URL for relative module imports. No current main-game or WASM code is substituted.

The launcher/router are hosting infrastructure only. Gameplay, assets, timing and known bugs remain those of 0.24.08. This is a baseline for user testing, not a performance certification. The existing Three.js CDN dependency is retained.
