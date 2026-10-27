# Protected media and existing UI adapter

This preview uses the pinned official engine and browser port described in source-lock.json. The original main game and its backup remain separate.

## Asset format

The exporter converts sprite atlases to WebP and native sounds to Ogg Vorbis. Native SFF/SND archives are read only by private build tools. They are neither published nor reconstructed in the browser. PMS/PMA metadata maps sprite numbers, axes and sound numbers to compressed derivatives.

Each logical file is optionally gzip-compressed, split into 256 KiB fragments, authenticated with AES-256-GCM and interleaved with other media. Battle groups use at most 4 MiB bundles; presentation media uses one approximately 27.5 MB bundle. An encrypted catalog stores fragment locations and decoded SHA-256 hashes. Duplicate content shares fragments. Authentication failures stop loading. Browser-readable keys make this protection an obstacle to casual copying, not a guarantee against extraction.

UI media uses lazy authenticated fragment reads. Before battle, the grouped reader bulk-downloads the complete shared group, unique selected character groups and chosen stage group, decrypts their contents into memory, and discards its ciphertext cache. It seals the resident library at readiness: an unprepared asset access is an error, never a network request. No decrypted media is persisted by the adapter. The preview-scoped service worker supplies existing UI URLs from only the interface and presentation catalogs; missing media cannot silently fall back to plaintext files.

## UI ownership

The existing logo, menu, character selection, ACS, declarations, result screen, report card and arcade progression remain in the Web UI. An isolated iframe owns the native battle. Session tokens, source-window and origin checks protect the start/input/snapshot/result bridge. Blur and visibility changes release held controls. Removing the iframe discards its engine instance.

ACS HP scaling is applied at each native round reset. Damage scaling uses the attack attribute as well as the state category, so lingering projectiles retain special/super classification. Training resets ACS allocation. The original playful ability currently has no additional implementation in this adapter.

## Build workflow

Keep native source checkouts and generated intermediate derivatives outside the public site. First reproduce the pinned base engine as documented in README.md, then run prepare_host_engine.py into a fresh private directory and build_wasm.ps1. Apply patch_host_fs.py to the generated shim, collect_notices.py, and package_host.py into a separate distribution directory. The host validates the uncompressed WASM hash before instantiating it.

Generate common FX, presentation, source fixes, UI adapters and stage derivatives with the corresponding derive_*.py tools. build_game_pack.py reads these from the sibling wasm-pack-additions directory beside its common-derived input and overlays them before packing. Use an empty destination. repack_assets.py authenticates an existing development pack and creates fresh deduplicated, bounded bundles without stale development shards. It rejects SFF/SND paths.

Run check-pack.mjs and check-host-config.mjs, then browser battle and full UI flow checks. Local headless software rendering is substantially slower than real time; elapsed wall-clock deadlines alone do not establish an engine freeze. Inspect native ticks, state times, intro and paused telemetry.

This remains an experimental adapter until browser flow and character/stage qualification is complete. Native model shadows and browser TCP/UDP netplay remain unsupported by the underlying port. Mobile performance is not yet qualified.

All selected character sprites are uploaded before the engine reports readiness. There is no combat-time texture eviction, upload, atlas decode or sound decode. Native sounds are resident PCM buffers, so playing a move performs no file read. The parent page creates and unlocks a shared interactive AudioContext from the start gesture; the native audio queue uses 512-frame chunks and a two-chunk limit. This addresses both suspended iframe audio and the previous large queue delay.

Browsers with ImageBitmap support decode WebP during loading and upload cropped ImageBitmaps directly. A 256 MiB atlas cache is used only while preparing; all atlas bitmaps close at readiness. A Go decoder remains available when ImageBitmap is absent. Full sprite residency uses substantial GPU memory: the tested Moon/Jupiter pair allocated approximately 3.07 GiB of managed sprite textures. This excludes stage/model/UI textures, browser overhead, resident compressed derivatives and PCM. Insufficient GPU memory must fail preparation rather than start with missing textures. Mobile hardware remains unqualified.

The root Pack manifest maps separate interface, presentation, shared, character and stage catalogs. UI selections and declarations never require a character battle group. Selected result presentation is prepared before starting battle. Lifebar faces and emblems use tiny standalone presentation sprites drawn on the front HUD canvas; native duplicate portrait helpers are disabled. Their background stays behind the faces. Use split_battle_packs.py with a private legacy development pack and derived additions to rebuild this layout. See loading-report.json for measurements; the earlier short-loading on-demand comparison is superseded and is not a gameplay-quality claim.
