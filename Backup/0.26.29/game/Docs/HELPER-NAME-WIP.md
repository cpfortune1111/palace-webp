# Helper name consumers (partial)

Reference: Ikemen GO cb56d73badb322f3725257c2e8cfd157b2c3989d. Reviewed helper compiler name parsing and ignoreMostErrors fallback, helper.Run name evalS, newHelper default name, BytecodeValue.ToS, HelperName opcode and ModifyPlayer's literal helpername compiler/consumer.

Actual Helper creation now stores a name. Omitted name derives from the current recipient parent's name plus "'s helper". Explicit name evaluates once in the original caller context, including string expressions and valid undefined results converted to empty string as evalS/ToS does. Evaluation precedes later stateno/ID/position reads; this fixes interactions with later variable writes, without claiming the remaining Helper compiler order is complete. Literal H950 is still suppressed early; computed H950 is still omitted under the game's existing exception.

The root parent-name adapter uses the game's original character name; a Helper parent uses its current own name. Redirected explicit expressions therefore read the caller, while an omitted name derives from the recipient. Actual HelperName queries see the stored value and later ModifyPlayer helpername changes. Name continues to read character information. Children retain creation-time default names when a parent is renamed later; new children derive from the parent's current name.

The runtime factory supports helperLooseNames for the native configured legacy parse-error fallback, stripping quotes only as a pair. Main game creation remains strict by default; all current imported explicit names use regular quoted syntax. Non-string/undefined values map to empty string rather than an invented display value.

Evidence: semantic checks for default derivation, single evaluation, ToS conversion and strict/loose constructor behavior; 64 real character-version/player/root-nested/name-form/order browser combinations, plus live renaming, nested snapshots, redirect and missing-target suppression. The regular game source names remain intact.

Pending: remaining Helper type/proxy/flag families, full compiler and registration/first-body order, complete string parser/escape fidelity, native configuration mapping and executable differential certification. ModifyPlayer helpername remains literal-only as the pinned compiler requires. No whole-Helper certification changes. Character recoloring remains excluded; no media or original assets are added.
