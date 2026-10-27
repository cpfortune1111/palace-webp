# Compiler parameter-name bindings — inventory refinement

Pinned reference: Ikemen GO cb56d73badb322f3725257c2e8cfd157b2c3989d, compiler.go and compiler_functions.go.

The inventory walker now tracks literal parameter-key bindings into shared compiler helpers instead of labelling every delegated paramValue/paramAnimtype/paramClsnType/key consumer as unresolved. Prefix-plus-literal keys retain their full names, and separate helper calls retain separate binding contexts. Numeric opcode arguments to helpers such as paramPostype are no longer mistaken for dynamic parameter names. Truly dynamic caller values remain unresolved rather than being silently discarded.

The executable check-controller-inventory.py fixtures prove literal binding, prefixed binding, numeric opcode distinction, preservation of unresolved dynamic values and exact equality of every controller's parameter-candidate list against the saved inventory. Running against the pinned sources retains 163 controllers and 2,158 parameter candidates, while reducing extraction follow-up entries from 234 to 11. This removes false extraction warnings, not unfinished runtime work. No controller or parameter receives semantic certification.

Subsequent finite-loop extraction recognizes directly bounded integer loops whose formatted key is immediately consumed by stateParam. It discovers the previously omitted AssertInput flag2–flag8 and resolves the MapReset exclude2–exclude8 traversal without a hard-coded controller exception. It does not resolve unbounded loops or unrelated uses of a same-named variable. Candidate totals are now 2,165 across the same 163 controllers, with 597 distinct names and nine remaining extraction follow-ups: Dialogue and the eight map-assignment variants.

The saved CONTROLLER-AUDIT JSON and Markdown snapshots now include the regenerated names, parameter-binding contexts and reduced warnings. Tests require exact equality between the regenerated pinned inventory and the saved JSON. This checkpoint is included in 0.25.17; deployment is verified separately, and zero controller rows are newly certified complete.

This is not proof that the complete MUGEN/Ikemen specification inventory has been extracted. Dynamic syntax, native defaults, version differences and full runtime behavior remain part of the active objective.
