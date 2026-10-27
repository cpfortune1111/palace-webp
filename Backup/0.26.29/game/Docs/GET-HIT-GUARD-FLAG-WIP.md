# GetHitVar guardflag — partial integration

Actual contact/parser fixtures and complete browser regression passed with terminal exit code 0 in outputs/controller-get-hit-guard-flag-actual.log. A subsequent outer-whitespace/lowercase normalization change passed the focused module test; release validation must rerun the complete regression on the final files.

Pinned compiler.go GetHitVar.guardflag accepts native literal flags and one sign suffix, or compares strings against another trigger result. Native bytecode compares any overlapping bit, not all requested bits. The M alias expands to H and L; flagString orders H/L/A/F/D/P/minus/plus despite D preceding F in bit allocation.

Shared HitDef contact now retains guardflag. Standalone queries return the canonical string; literal comparisons use independent AST mask matching and trigger-to-trigger comparisons retain ordinary string semantics. Focused module tests pass aliases, bit allocation, canonical order, invalid letters and any-bit matching. Actual contact/parser fixtures pass; final release regression is recorded separately. Still partial: exact whitespace/sign grammar diagnostics, full GetHit language parity and reference-version profiles remain Pending. Pinned GetHitVar has guardflag but not hitflag; unrelated bytecode enums are not falsely claimed as query support.
