# CNS scheduling literal parsing (unpublished, partial)

Reference: Ikemen GO cb56d73badb322f3725257c2e8cfd157b2c3989d, src/compiler.go CNS controller section parsing and src/common.go Atoi.

CNS persistent and generic controller ignorehitpause are compiled as integer literal prefixes, not evaluated expressions or JavaScript Number conversions. Atoi trims whitespace, handles one sign, consumes ASCII digits until the first other character and saturates outside signed int32. Thus 2 + 5 means persistent 2; var(8) means 0; 0.5 means false; 1 + 0 and -2 mean true for ignorehitpause. ZSS uses a separate scanner and is not covered by this CNS path.

Engine/cns-integer-literal.js implements the pinned prefix/range behavior. Its optional warning callback has tests, but native console/log warning delivery is not integrated or certified. Controller schedules and root/helper/lifecycle pause prefilters now use this parser and accept any nonzero ignore flag rather than only numeric 1. Effect-specific ignorehitpause expressions remain distinct and are intentionally not rewritten as CNS generic flags.

Tools/check-controller-schedule.mjs first failed on persistent text that native Atoi accepts. It now verifies literal prefixes, zero/negative one-shot persistence, overflow >128 reset and current/global pause flags. Tools/check-cns-integer-literal.mjs covers signs, ASCII prefixes, overflow saturation and warning prefix. Existing Helper scheduling tests remain intact.

Tools/check-cns-scheduling-browser.cjs runs actual common-controller root current/global gates, lifecycle global dispatch and Helper current/global bodies for both player slots under both engine profiles. Literal flags 1 + 0 / 0.5 / -2 yield execution counts 1/0/1. Helpers explicitly enable their -2 state through keyctrl=2; actor variable stores are used rather than movement-only bindings. Evidence: outputs/cns-scheduling-browser.log. These fixture requirements were corrected without weakening assertions.

Complete compiler timing/diagnostics, native negative/pause/lifecycle phase equivalence, warning delivery, ZSS and all common-parameter certification remain Pending. Combined game regression and publication are separate gates; all whole-controller certifications remain Pending.
