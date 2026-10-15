# State -4 import selection — five character builders

The Venus compile_state200.py path and Moon/Jupiter/Neptune/Saturn runtime builders previously exported global controller arrays only for -3/-2. They now select -4/-3/-2 while retaining the existing character-specific filtering and -1 command separation. Missing -4 produces an empty array, not fabricated behavior.

check-negative-state-import.py executes the actual export-selection AST blocks from all five tools against synthetic parsed-state fixtures. It uses the existing generic controller compiler and isolates unrelated full-build I/O. Tests verify mixed source order, two -4 controllers, source-line identity, variable target conversion, Persistent/IgnoreHitPause preservation, -3/-2 retention and absent -4 handling. Character-specific translator callbacks are substituted by the generic compiler in these selection tests; this is not full translation/media/export certification.

The currently available outputs/{venus,moon,jupiter,neptune,saturn}/state_sections.json snapshots each contain zero State -4 definitions/controllers. Consequently no existing character payload regeneration is required to restore a missing current -4 controller. The builder fix enables subsequent sources containing -4; runtime execution is separately covered by STATE-FOUR-INTEGRATION-WIP.md and its actual browser fixture.

Both Python tests pass across all five selection paths. Complete raw-source parsing/version support, custom dialects and existing character-specific exclusion policies still require their separate audits. No controller/parameter certification counts change. This checkpoint is included in 0.25.20, with deployment verified separately.
