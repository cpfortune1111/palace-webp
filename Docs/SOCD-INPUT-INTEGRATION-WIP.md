# SOCD input conflict resolution — partial configured root integration

Reference: Ikemen GO cb56d73badb322f3725257c2e8cfd157b2c3989d, input.go InputReader.SocdResolution and AssertInput/ShiftInput composition in command inputUpdate.

Engine/socd-input.js keeps independent first-held direction histories and implements mode 0 allow-both, mode 1 last direction, mode 2 U/F absolute priority, mode 3 first direction and other values neutral. Simultaneous initial directions choose D and B as first-held, matching the pinned source. Buttons are untouched, and caller input objects are not mutated.

setRootSocdMode(player,mode) explicitly configures each root's live command sampler. Null retains the existing WEB behavior pending native-default migration. Configured modes receive raw opposing P2 directions rather than the previous pre-neutralized sample. The sampler composes AssertInput, then ShiftInput, then SOCD, then command recognition. Input reset clears histories. This setting is an internal engine configuration hook, not a newly exposed menu option or a claim that native config files are supported.

Focused tests distinguish first/last histories, reset and independent actor storage. The actual browser fixture injects all opposing directions through real controllers, tests each policy and remaps an asserted button into a conflicting direction before resolution. The actual fixture and complete browser regression passed with terminal exit 0 in outputs/controller-socd-input-browser.log, including prior AssertInput/ShiftInput and simultaneous Saturn super fixtures.

Pending: default/version configuration migration, full raw-input parity, native input/action/pause phases, Helper key-control ownership, replay/network input and mode-change timing. No controller or parameter is newly certified complete; this checkpoint is included in 0.25.18, with deployment verified separately.
