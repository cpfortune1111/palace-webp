# Protected media and existing UI adapter

This preview uses the pinned official engine and browser port described in source-lock.json. The original main game and its backup remain separate.

## Asset format

The exporter converts sprite atlases to WebP and native sounds to Ogg Vorbis. Native SFF/SND archives are read only by private build tools. They are neither published nor reconstructed in the browser. PMS/PMA metadata maps sprite numbers, axes and sound numbers to compressed derivatives.

Each logical file is optionally gzip-compressed, split into 256 KiB fragments, authenticated with AES-256-GCM and interleaved with other media into at most 4 MiB bundles. An encrypted catalog stores fragment locations and decoded SHA-256 hashes. Duplicate content shares fragments. Authentication failures stop loading. Browser-readable keys make this protection an obstacle to casual copying, not a guarantee against extraction.

The reader fetches fragments lazily. Servers that ignore Range are supported with a bounded 16 MiB whole-bundle cache. Decrypted logical files have a separate bounded 32 MiB cache. No decrypted media is persisted by the adapter. The preview-scoped service worker supplies existing image, sound, model and font URLs from the encrypted catalog; missing media cannot silently fall back to plaintext files.

## UI ownership

The existing logo, menu, character selection, ACS, declarations, result screen, report card and arcade progression remain in the Web UI. An isolated iframe owns the native battle. Session tokens, source-window and origin checks protect the start/input/snapshot/result bridge. Blur and visibility changes release held controls. Removing the iframe discards its engine instance.

ACS HP scaling is applied at each native round reset. Damage scaling uses the attack attribute as well as the state category, so lingering projectiles retain special/super classification. Training resets ACS allocation. The original playful ability currently has no additional implementation in this adapter.

## Build workflow

Keep native source checkouts and generated intermediate derivatives outside the public site. First reproduce the pinned base engine as documented in README.md, then run prepare_host_engine.py into a fresh private directory and build_wasm.ps1. Apply patch_host_fs.py to the generated shim, collect_notices.py, and package_host.py into a separate distribution directory. The host validates the uncompressed WASM hash before instantiating it.

Generate common FX, presentation, source fixes, UI adapters and stage derivatives with the corresponding derive_*.py tools. build_game_pack.py reads these from the sibling wasm-pack-additions directory beside its common-derived input and overlays them before packing. Use an empty destination. repack_assets.py authenticates an existing development pack and creates fresh deduplicated, bounded bundles without stale development shards. It rejects SFF/SND paths.

Run check-pack.mjs and check-host-config.mjs, then browser battle and full UI flow checks. Local headless software rendering is substantially slower than real time; elapsed wall-clock deadlines alone do not establish an engine freeze. Inspect native ticks, state times, intro and paused telemetry.

This remains an experimental adapter until browser flow and character/stage qualification is complete. Native model shadows and browser TCP/UDP netplay remain unsupported by the underlying port. Mobile performance is not yet qualified.

The sprite loader now registers metadata without decoding or uploading the full character. Visible frames are uploaded on demand, with a 192 MiB target for managed sprite textures. Current/recent draw-list textures remain protected, so an unusually large simultaneously visible set may exceed that target. Upcoming frames of the active animation are prefetched; unselected character battles and unrelated animations are not bulk uploaded.

Browsers with ImageBitmap support decode WebP using their native image decoder and upload cropped ImageBitmaps directly, avoiding full-atlas copies through WASM memory. A decoded-atlas cache targets 128 MiB; borrowed bitmaps and transient decoding can exceed this target, then unused bitmaps are closed. A Go decoder remains available when ImageBitmap is absent. These counts exclude stage/model textures, the Web UI, browser overhead and compressed file caches; they are not total device memory measurements.

Native character audio is read on first playback rather than all at SND registration. UI declarations prepare only selected characters. Venus selection preloads its select action; intro and result actions are prepared at their respective stages. Selected result assets can warm after battle startup. The encrypted pack is unchanged by this runtime optimization. See loading-report.json for the local comparison and remaining test bounds. Mobile hardware performance remains unqualified.
