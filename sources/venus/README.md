# Venus source inventory / import V1

Canonical snapshot: the user's Moon Palace/ chars/SailorVenus directory, read through SailorVenus.def on 2026-10-02.

`manifest.json` records byte hashes, dependencies, counts, source-reference checks and controller-handler coverage against the unchanged 0.23.7 index.html. Counts are section/directory entries, not unique semantic definitions. Command names may repeat.

`original/` contains byte-preserved text sources on GitHub. The local source package additionally contains original venus.sff and venus.snd. Binary SHA-256 values and directories are committed; binary payloads are not uploaded. Keep the source package available when running the importer or a future asset exporter.

`state_sections.json`, `command_sections.json`, `air_sections.json`, `text_sections.json` preserve raw source sections and line numbers. AIR frame metadata is an index, not a fully evaluated animation/collision format. `sff_directory.json` / `snd_directory.json` index original binaries; they do not decode all sprites or sounds.

Reproduce with Python 3.9+ (no extra packages):

```text
python tools/import_venus_sources.py --source "PATH/TO/SailorVenus" --destination "OUTPUT/venus" --runtime index.html
```

The importer requires this inspected SFF v2 and UTF-8 text. It fails rather than accepting unsupported headers or undecodable text. It does not implement MUGEN expression semantics; dynamic / external references need review. Static missing references are source findings, not proof a reachable move is broken.

Root-level legacy source files and existing runtime bundles remain unchanged. They differ from the local source snapshot and must not be mixed silently. See VENUS_TODO.md for migration order and acceptance criteria.
