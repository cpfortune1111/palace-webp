# Fixed engine/browser-backend experiment

[Open the protected-media UI preview](play.html). It retains the existing Moon Palace interface and drives real native WASM battles. Compressed WebP/Ogg derivatives are loaded from authenticated encrypted mixed bundles; original SFF/SND archives are not distributed. See [PROTECTED-ASSETS.md](PROTECTED-ASSETS.md) and protected-build-report.json for validation and limitations. The main game and backup remain unchanged.

The battle-ready loader replaces the rejected combat-time streaming experiment. Selection and declaration media live in one separate encrypted presentation bundle. Before battle, the loader downloads and decrypts the complete two selected characters, shared combat resources and chosen stage, uploads every selected sprite, and decodes every selected native sound to PCM. The readiness barrier then prohibits further asset reads or sprite decoding during combat. Browser-native ImageBitmap decoding avoids large atlas copies through WASM during preparation. See loading-report.json for validation and memory boundaries.

This directory pins official IKEMEN GO v1.0.0 (`81c6da71d689625e20db79586815b695da00dd6d`) and the third-party fiiight `upstream-wasm-port` source (`716cc944a6f19bf845e08595a1c9b7b5f8f8525b`). The latter is a browser port patch source, not an officially merged browser release. Full per-file Git blob hashes are in source-lock.json.

The browser port is now integrated onto v1.0.0 and compiled with pinned Go 1.27.3. Two fresh source integrations produced byte-identical 25,176,351-byte WASM binaries (5,798,159 bytes gzipped). The actual compressed distribution passed Edge/WebGL2 startup, 180 UI ticks, separate P1/P2 keyboard inputs and nonzero WebAudio sample tests without page errors. This is an engine smoke test, not a Moon Palace battle or 3D-stage compatibility result. See build-report.json and Dist/artifact-hashes.json.

[Open the standalone engine test](Dist/). It renders a pink rectangle and plays a quiet generated test tone. No character, demo roster, screenpack, font or alternative touch interface is bundled. Main Moon Palace runtime is unchanged.

Reproduce using empty private source/build directories outside the published site:

1. `python fetch_sources.py --destination <sources>`
2. `python integrate_sources.py --sources <sources> --destination <integrated>`
3. `python apply_port_fixes.py <integrated>`
4. `./build_wasm.ps1 -Source <integrated> -Go <Go1.27.3 executable> -Out <build>`
5. `python collect_notices.py <integrated> <Go1.27.3 executable> <build>/THIRD-PARTY-NOTICES.txt`
6. `python package_smoke.py <build>`
7. `node check_smoke.cjs <build> <test-results>` (requires Playwright and Edge; PLAYWRIGHT_MODULE can identify an existing Playwright installation).

Serve the build directory over HTTP to inspect it. stage_distribution.py copies only the explicit engine/test distribution whitelist into Dist; it never copies original native character assets. The July merge base is fixed at 05b7d98af690c73c7bffe5cb4f4eeb6933fa2703. Compiler, save-state and statistics conflicts retain official v1.0.0 code; music and system conflict hunks retain the official side. Remaining browser changes are applied by a three-way merge and checked before compilation.

The existing Web UI, pre-fight dialogue, Ability Customize and touch controls remain authoritative. The battle bridge preserves per-round ability settings. The asset reader consumes compressed derivatives from encrypted mixed chunks for only the selected match, without publishing original SFF/SND or reconstructing those archives in memory. Browser-side decryption cannot guarantee that assets are impossible to extract.

Go is pinned to 1.27.3 (Windows amd64 archive hash in the lock). wasm_exec.js is copied from that same toolchain. The distribution retains engine and Go notices plus notices from the 27 linked dependency modules. The port still lacks 3D model shadows and browser TCP/UDP netplay; video volume uses the port's linear HTML media approximation. The new protected-media host is isolated under Host/ and play.html; the original Dist/ smoke test and live main-game runtime remain unchanged. Mobile texture-memory optimization and broader character compatibility testing remain outstanding.
