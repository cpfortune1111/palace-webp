# GetHitVar attr — partial integration

Actual GetHitVarSet-to-query/parser fixtures and complete browser regression passed with terminal exit code 0 in outputs/controller-get-hit-attribute-actual.log.

Pinned compiler.go supports standalone string queries, literal attribute-mask comparisons and trigger-to-trigger string comparisons. bytecode.go renders states in S/C/A order and individual attack types in NA/NT/NP/SA/ST/SP/HA/HT/HP order. GetHitVar.testAttr requires both state and attack overlap and excludes the sign bit.

The runtime now renders the stored mask/string, parses literal mask comparisons as their own AST node and preserves ordinary string comparisons between trigger results. Focused tests pass rendering and independent state/attack intersections. Actual GetHitVarSet-to-query/parser fixtures pass. Real HitDef contact production and mixed-localcoord redirected setter/query attribute comparisons also pass complete regression (outputs/controller-get-hit-contact-roundtrip.log, terminal exit code 0). Still partial: malformed/native grammar diagnostics, complete redirection and attr/flag language parity remain Pending. No full controller certification is claimed.
