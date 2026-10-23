# AssertSpecial NoShadow reflection consumer (partial, unpublished)

Pinned reference: Ikemen GO cb56d73badb322f3725257c2e8cfd157b2c3989d, char.go checks ASF_noshadow before constructing both shadow and reflection sprites. NoShadow is an actor-local AssertSpecial flag, not a global stage reflection setting.

The WEB actor assertion controller now accepts NoShadow, including enabled and redirectid through existing native-style extraction. Its adapted recipient lookup rejects disabled/non-Character entities. Both root and Helper reflection drawing skip the asserted actor. This supplies a real consumer for the existing reflection pass; full native shadow rendering and complete AssertSpecial flag coverage remain Pending.

check-no-shadow.mjs first fails on unrecognized NoShadow (outputs/no-shadow-before.log), then verifies actor-local storage, redirection and enabled extraction. The actual spawn/controller/drawing fixture toggles NoShadow on a Helper and a root, proves a visible baseline and restored drawing, and preserves unrelated reflection records (outputs/helper-reflection-no-shadow-browser.log).

An earlier Helper visibility fixture set intensity zero before disabled/noshadow assertions, so it could not independently prove those gates. The revised fixture restores positive intensity, asserts visible/restored controls and drives NoShadow through executeControllerM1 instead of directly mutating flags. Root assertion snapshots are restored in finally. This supersedes only those weak visibility checks, not the previous geometry/palette/pause evidence.

Full native shadow geometry, actor visibility/assertion phase fidelity, compiler/version/console semantics, combined regression and publication remain Pending. No whole-controller certification changes.
