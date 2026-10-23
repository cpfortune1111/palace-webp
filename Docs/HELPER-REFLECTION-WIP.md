# Helper reflection consumers (partial, unpublished)

Subsequent consumer review adds actual AssertSpecial NoShadow dispatch for roots and Helpers. Positive-intensity visible/restored controls now distinguish disabled and NoShadow suppression from zero-alpha omission; the original checks did not isolate those gates. The corrected actual fixture passes (outputs/helper-reflection-no-shadow-browser.log). See NO-SHADOW-WIP.md. Full battle baseline passes before the later NoShadow controller change; a fresh final combined gate remains required.

Pinned reference: Ikemen GO cb56d73badb322f3725257c2e8cfd157b2c3989d, char.go Character sprite/reflection construction and bytecode.go ModifyReflection. Helpers are Characters, not native Projectile objects. Their character sprite data can cast a stage reflection and receive reflection overrides.

The WEB stage reflection pass now includes live, enabled, visible Helpers without the noshadow assertion. It carries Helper size drawing, offsets, entity scale, AIR flips, facing, angle state, actor palette/Trans and supported reflection overrides through the existing real reflection queue. Existing roots retain their path. Normal Helper spawning initializes an independent override state; active preparation clears it even during local hitpause, while blocked global pause retains it until preparation resumes. Explicit controller recipient lookup still excludes native-style projectiles.

ModifyReflection's supported color/intensity/offset/xscale/yscale/keeptransform/angle/xangle/yangle parameters now reach Helper storage and drawing rather than throwing for every Helper. Unsupported parameter names remain explicit errors; this is not full ModifyReflection certification.

The existing browser suite first failed because its stage reflection-layer fixture expected two root records despite a visible Helper. It now explicitly expects three records and still checks exact phase layers. The separate root-only override fixture isolates/restores entities rather than counting Helper records as roots. Evidence: outputs/helper-reflection-existing-browser.log and outputs/helper-reflection-existing-browser-recheck.log.

Actual normal Helper spawning tests for both player directions exercise redirected intensity, RGB, offsets, signed scales, zero-intensity omission, disabled/noshadow visibility, local-hitpause reset, blocked-global retention and resumed reset. The initial version passes (outputs/helper-reflection-consumers-browser.log); a subsequent fixture change gives opposite facing directions and requires a fresh run. Root geometry/color/phase tests still pass in the existing-suite recheck. Full helper projection/window/shear/animation replacement, size/shadow-offset/Z/native renderer fidelity, other stages, additional pause/lifecycle cases and final combined regression/publication remain Pending.

The opposite-facing normal-spawn fixture and all 228 Node checks now pass together (outputs/helper-reflection-focused.log). Complete battle regression is running separately; its result is not implied by focused checks.

No original SFF/SND or image assets were regenerated or uploaded; no whole-controller certification changes.
