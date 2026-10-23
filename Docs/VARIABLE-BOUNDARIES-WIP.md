# Variable boundary/undefined consumers (partial, unpublished)

Reference: Ikemen GO cb56d73badb322f3725257c2e8cfd157b2c3989d, char.go varGet/fvarGet/sysVarGet/sysFvarGet and fvarAdd. Negative indices return BytecodeUndefined and report a family-specific warning. Existing float values, including NaN and negative zero, are not replaced by numeric zero on reads or before floating addition.

WEB variable reads now reject negative signed indices with undefined (NaN representation) and the pinned warning message body. Typed integer-variable results preserve undefined instead of coercing it to zero. Storage reads use nullish fallback, preserving stored NaN and negative zero. VarAdd likewise defaults only absent values, so a stored float NaN remains NaN after addition.

Independent failing-before cases exposed negative-index zero coercion and VarAdd recovering a NaN into a valid number. Real parser checks cover all four variable families, exact warning bodies, stored NaN and float negative zero. Actual P1/P2 root/Helper scenarios cover these behaviors and live P1 lifecycle bindings under the named mugen11 and ikemen profiles; console warnings are captured without replacing engine simulation. Evidence before profile-name correction: outputs/variable-boundary-browser.log. Fresh named-profile and combined gates remain required.

Warning character prefixes, native console/warning lifecycle, positive MUGEN upper bounds, all expression/undefined operator combinations, infinity/overflow, complete compiler/VM/profile semantics and whole-controller certification remain Pending. Versioning and verified publication are separate gates.
