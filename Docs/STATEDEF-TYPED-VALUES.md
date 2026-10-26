# StateDef typed values — 0.26.24

Pinned Ikemen `cb56d73badb322f3725257c2e8cfd157b2c3989d`: `src/compiler.go` declares StateDef ctrl/facep2 as Boolean and sprpriority/poweradd as integer expressions. `src/bytecode.go` evaluates those fields with evalB/evalI. BytecodeValue.ToB/ToI treat strings and undefined values as false/zero. A numeric-looking string remains a string.

The existing Web StateDef scalar/facing consumers previously used JavaScript Number coercion. An evaluated NaN/undefined could enable control or facing, and an evaluated `"1"`/`"7"`/`"9"` could enable control, add power or set priority. They now use the shared controllerBoolean/controllerInteger conversion helpers. Scalar ordering, single evaluation, omitted fields, layer reset, zero-power callback policy and facing assertions retain their existing behavior.

The new scalar assertion reproduced the old failure (NaN yielded ctrl true). Focused scalar/facing checks cover undefined/NaN, numeric and nonnumeric strings, single evaluation and Boolean short-circuiting. Actual State-entry fixtures cover P1, P2 and Helper: evaluated numeric strings produce priority 0, ctrl 0, unchanged shared/own Power and unchanged facing. The existing non-string/absence/order fixtures remain strict. All 301 Node checks and complete battle regression passed with terminal exit code 0; the private release receipt records the logs.

| Field | Existing Web consumer | Evidence stage |
| --- | --- | --- |
| ctrl | applyStateDefControlPower | Partial across parsing/execution/source/semantic tests |
| poweradd | applyStateDefControlPower | Partial across parsing/execution/source/semantic tests |
| sprpriority | applyStateDefPriority | Partial across parsing/execution/source/semantic tests |
| facep2 | applyStateDefFacing | Partial across parsing/execution/source/semantic tests |

This corrects existing converted-source consumers. Generic CNS/ZSS parsing/type checking, all integer/nonfinite/overflow cases, full State-entry/provider/pause ordering and complete StateDef/engine conformance remain unfinished.

Source provenance: bytecode.go is 441647 bytes, Git blob `52913d2d6c0eec630e4aac8e82530eea3fd2ac61`, SHA-256 `89793c6a023e65c30b25e30676e1f0120a0856af39b8033529d16435d92d119f`; the private cache matches the pinned upstream tree. Original source is not published.
