# Fixed engine/browser-backend experiment

This directory pins official IKEMEN GO v1.0.0 (`81c6da71d689625e20db79586815b695da00dd6d`) and the third-party fiiight `upstream-wasm-port` source (`716cc944a6f19bf845e08595a1c9b7b5f8f8525b`). The latter is a browser port patch source, not an officially merged browser release. Full per-file Git blob hashes are in source-lock.json.

Run `python fetch_sources.py --destination <private-directory>` to materialize and verify the two immutable source snapshots. Use an empty destination outside this published site. No demo roster, font, screenpack or touch implementation is installed into Moon Palace. Source retrieval alone does not prove the browser patches build against v1.0.0; rebasing and a reproducible integrated WASM build are the next experiment, and have not been completed here.

The existing Web UI, pre-fight dialogue, Ability Customize and touch controls remain authoritative. Future integration must expose configuration/start/round/result interfaces and preserve per-round ability settings. The asset reader must consume compressed derivatives from encrypted mixed chunks on demand, rather than publish original SFF/SND or reconstruct large original archives in memory. Browser-side decryption cannot guarantee that assets are impossible to extract.

Go is pinned to 1.27.3 (Windows amd64 archive hash in the lock). Generate wasm_exec.js from the same toolchain used for the eventual WASM binary. Both engine source repositories contain MIT license notices; retain those and audit dependency licenses when distributing an integrated binary. This step has not changed the live battle runtime, implemented encryption, or deployed a WASM game.
