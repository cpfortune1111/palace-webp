# SelfAnimExist provider — 0.25.51 partial checkpoint

Reference: pinned Ikemen GO cb56d73badb322f3725257c2e8cfd157b2c3989d, Char.selfAnimExist uses the queried actor's own gi().animTable, distinct from Char.animExist and current animation providers.

Actual SelfAnimExist consumers now select the queried root/Helper's own character animation inventory. They no longer use the caller's active framesFor provider, which incorrectly followed borrowed state/animation tables and ignored redirected actor ownership. Imported character profiles retain the complete source action-ID inventory separately from the subset whose graphics are preloaded. Legacy Venus reads its own available action tables rather than a borrowed imported character's table.

Tools/check-self-animation-query-browser.cjs fails before the fix and passes after it. Eight profile/player/root-or-Helper scenarios each test own and foreign state/animation-provider variants, actual conflicting Saturn/Moon action inventories, own-only/other-only IDs, caller-scoped redirected ID expressions and real VarSet parameters. Tools/check-self-animation-inventory.mjs exercises the actual lookup for IDs with no preloaded frames and the legacy own-table fallback; the import wiring is checked explicitly.

Pending: AnimExist's current animation provider semantics, complete legacy AIR inventories, empty/invalid action validation, all prefixes/versions/native diagnostics and full VM/controller coverage. Existing ID undefined guards remain in force. Full regressions/publication are separate gates; no controller certification changes. Last verified release remains 0.25.50.
