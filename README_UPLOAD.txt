0.19.4 Expression AST M3
Upload index.html + venus_runtime_states.json.

Architecture:
- Removed executable JavaScript Function() expression evaluation.
- Added deterministic Tokenizer -> Parser -> AST -> Evaluator.
- AST is cached after first parse.
- Current verified movement slice: literals; unary !/+/-; arithmetic; comparisons; &&/||; parentheses; Time/Anim/AnimTime/StateNo/PrevStateNo/Ctrl/AILevel/Pos/Vel; abs(), Const(), var(), sysvar(), ifelse()/cond(); holdfwd/holdback.
- Unsupported expressions fail loudly instead of falling through to JS.

Gameplay expected unchanged from 0.19.3.
Regression: walk, crouch 10->11->12->0, neutral/fwd/back jump, landing, camera/EDGE/zoom/joystick.
