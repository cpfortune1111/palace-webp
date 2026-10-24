# GameMakeAnim — partial real consumers, not certified

Pinned reference: Ikemen GO cb56d73badb322f3725257c2e8cfd157b2c3989d, src/bytecode.go gameMakeAnim.Run and src/compiler_functions.go gameMakeAnim.

The extraction module follows redirected allocation before operand evaluation, caller-to-recipient local scale, float32 XYZ pos/random, native under/layer/priority/ownpal defaults, animation delegation and recipient draw-offset subtraction. Tests exercise missing recipient, exhausted allocation, evaluation ordering, vector limits and defaults. Unknown parameters fail rather than being ignored.

Animation operands now use a shared typed resource-reference parser: GameMakeAnim defaults unprefixed numbers to common F animations, preserves explicit S and dynamic empty prefixes, evaluates dynamic prefix before the signed action number, and accepts registered lexical prefixes. Independent tests cover these cases. The first parser check incorrectly expected a mocked numeric evaluator to enforce compiler syntax validation; that assertion was replaced by a real empty-operand rejection. Full compiler diagnostics remain unproven.

The module is now connected to the shared production dispatcher and existing source-effect renderer. Available common F120 and character animations reach real particles with recipient ownership, native layer/priority, independent palette-effect runtime and lifetime. Four actual browser cases cover both player slots and under values, checking visible F120 pixels and 27-tick removal. The sixteen MakeDust regression cases still pass. Unavailable animations or unsupported resource prefixes raise explicit errors instead of being silently ignored.

XYZ now reaches the actual source-effect depth projection and initial owner binding, rather than merely being stored on the effect. Two actual Z cases inspect draw-queue transforms; a normally spawned, moving Helper case verifies post-physics X/Z attachment to the Helper rather than the root. The combined fixture exits zero with all sixteen MakeDust cases still passing.

A further 32 real consumer cases cover both profiles, player slots, root/normal Helper, direct/redirected calls and own S0/common F120 resources. A fixed random source verifies all three random components, caller-context Var ownership, recipient facing/position/owner and actual nontransparent renderer output (outputs/game-make-anim-consumers.log). This is not proof of native RNG-sequence equivalence or custom local-coordinate parity.

The older check-runtime.cjs fixture fails during live cancel checks with undefined size constants in playerPushExtentsM1 (outputs/game-make-anim-full-battle.log). It does not establish a passing full regression and is not silently waived. The current release battle gate is check-saturn-priority.cjs; its terminal result is tracked separately. No production change was made to hide the older fixture failure.

The current complete battle gate subsequently exits zero and ends with simultaneous Saturn Miss/Miss supers passing without spent HitDefs or damage (outputs/game-make-anim-priority-battle.log). This ran before final version labeling/default-zero changes; final-version reruns remain required. An initial all-Node invocation omitted required reference-file arguments for two inventory checks; this was a runner invocation failure, not a passing gate. The corrected run supplies the pinned compiler source.

All 263 final-version Node checks pass with those arguments corrected (outputs/release-02589-node.log). Version 0.25.89 is prepared locally; final-version browser regression and verified publishing are still separate required gates.

Forty controller-specific actual-emission scheduling groups now pass both engine profiles and player slots: root current/global/lifecycle and normal Helper current/global hitpause gates, persistent=0 current/global behavior and global-pause Helper movement allowance. Particles are cleared between attempts and matching checks require the GameMakeAnim kind and recipient owner, not merely any common dust particle. The expanded nine-controller regression matrix has 360 groups (outputs/game-make-anim-specific-scheduling.log).

Pinned commitExplod/setAnim source review exposed the omitted-value default: the allocated Explod retains own animation 0, not an absent animation. Production allocation now retains that default and an actual dispatcher/drawing check verifies it. Explicit unprefixed value still selects common F animations; omission and explicit zero are deliberately distinct.

Actual allocation limits, full resource-prefix and invalid-animation behavior, exhaustive common animation readiness, exhaustive depth/binding/lifetime parity, native RNG, exhaustive pause/persistence and full MUGEN version semantics plus final regression/publication remain Pending. No whole-controller certification is claimed.
