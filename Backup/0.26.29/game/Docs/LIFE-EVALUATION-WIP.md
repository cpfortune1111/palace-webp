# LifeAdd parameter ordering (unpublished, partial)

Reference: Ikemen GO cb56d73badb322f3725257c2e8cfd157b2c3989d, src/compiler_functions.go lifeAdd and src/bytecode.go lifeAdd.Run.

The compiler emits redirectid, absolute, kill and value in that order. Runtime starts absolute=false and kill=true, evaluates supplied flags with evalB, then consumes value and applies life addition. The old WEB path evaluated value first, then kill, then absolute, and evaluated an omitted absolute as a synthetic expression.

Engine/resource-controllers.js now samples absolute/kill before value, skips evaluator calls for omitted flags and uses native-style controller boolean extraction for supplied flags. Positive-healing legacy behavior also now uses the executing code's explicit engineVersions rather than only the caller compatibility label.

Tools/check-resource-controllers.mjs first failed with amount/kill/absolute evaluation instead of absolute/kill/amount. Its repaired order and omitted-default checks pass with existing life/power/redlife/defense/round gates. Eight actual profile/player/root-or-Helper cases use Var(4) assignments in all three parameters: flags establish 0 then 1, value increments to 2 and deducts 20, leaving life 480. The real resource actor and shared variable storage provide the evidence, not an isolated expression stub. See lifeOrder assertions in Tools/check-debug-clipboard-browser.cjs and outputs/life-evaluation-browser.log.

Full source-version selection, integer extraction, all resource defaults/ownership/scheduling and controller certification remain Pending. Combined regression and publication are separate gates; this change is not yet published.

The positive-healing branch follows pinned lifeAdd.Run and Char.stWgi: ordinary code uses the state-provider version; negative-state code uses the character's own version. Module tests conflict native metadata and compatibility labels, including a nonzero patch number with zero major/minor. Eight actual browser actor cases install opposing own/foreign versions and run state 5000/-2/-1 with defense 2 and healing 10: resulting life values are 505/510/510. Explicit absolute=0 is overridden only for legacy code. Fixture life, versions and state providers are restored. Evidence: healingResults assertions in Tools/check-debug-clipboard-browser.cjs and outputs/life-version-browser.log.

The separate already-dead kill=false rule inside recipient Char.lifeAdd depends on recipient working-state metadata, not the healing source version. Resource actor bindings now expose stable actor identity and current code-owner version data. Self writes use the active source working-code version (including negative states); redirected writes resolve the recipient's own current state provider. The production resource consumer uses that version for its dead-life floor independently of positive-healing policy.

Module cases conflict caller compatibility and recipient native versions. Eight actual actor cases test ordinary/-2/-1 source code with self and opposing-root recipients already dead: self yields 0/1/1 for foreign Ikemen versus own legacy negatives; the redirected Ikemen recipient remains 0 in all three. Expected observations are [[0,0],[1,0],[1,0]]. Original life values are restored after each case. Evidence: deadLifeResults assertions and outputs/life-recipient-browser.log. Concurrent nested negative execution of a different recipient and complete native phase equivalence remain Pending; these focused cases do not certify all scheduler/version semantics.

## RedLifeAdd zero-value operands

Pinned compiler_functions.go redLifeAdd emits absolute before value, and bytecode.go redLifeAdd.Run evaluates the flag before calling the native addition function, even when value is zero. WEB previously evaluated value first and returned on zero without ever evaluating absolute. It now samples a supplied flag with controller boolean extraction first and avoids synthetic evaluation of omitted defaults.

Tools/check-redlife-controllers.mjs first failed because only zero was sampled instead of flag/zero. The repaired gate verifies ordering, omitted defaults and Undefined absolute=false with defense-scaled damage. Eight actual actor scenarios assign Var(5) in absolute while value is zero, then assign/increment it across both operands of a second zero-valued call; the observed values are 7 then 2. Evidence: redLifeOrder assertions in Tools/check-debug-clipboard-browser.cjs and outputs/redlife-evaluation-browser.log. Zero additions still leave resources unchanged. Native executable differential and complete controller certification remain Pending.

## DizzyPointsAdd / GuardPointsAdd

Pinned compiler/runtime methods likewise emit and sample absolute before value for these controllers. The WEB point consumer had the same early-zero-return omission and treated undefined absolute as true. It now samples supplied absolute through controllerBoolean before value, preserving omitted defaults and existing point bounds/gates. Tools/check-point-controllers.mjs first failed on the skipped flag and now checks both add families, omitted defaults and undefined defense scaling.

Eight actual actor scenarios repeat a zero-valued flag assignment and a flag/value assignment chain through both point controllers. The shared variable observations are [7,2,7,2], demonstrating preserved evaluation even without changing resources. Evidence: pointOrder assertions in Tools/check-debug-clipboard-browser.cjs and outputs/point-evaluation-browser.log. The already-running combined game suite predates these point-only changes; final validation and publication remain separate.

## TargetLifeAdd flags and required value

Pinned targetLifeAdd compiler/Run methods require value and extract absolute/kill/dizzy/redlife with evalB in that order before the value. WEB already ordered these operands correctly but incorrectly treated undefined/string flags as true and defaulted a missing required value to zero. The production consumer now uses controllerBoolean for all four supplied flags and reports a missing value instead of accepting a silent no-op. Omitted native defaults remain false/true/true/true.

Tools/check-target-life.mjs first observed all four invalid flags as true; it now verifies undefined and string extraction plus missing-value rejection. Eight actual actor cases register an opposing root target, enable red-life/dizzy resource features, set defense 2 and use Name/1/0 flags with value -100. Life becomes 450, red life remains 900, dizzy points remain 800 and GetHit kill is false. Fixture resources/features/defense/targets are restored. Evidence: targetLifeFlags assertions in Tools/check-debug-clipboard-browser.cjs and outputs/target-life-flags-browser.log. Full target native-version/phase/parameter certification remains Pending.

## TargetRedLifeAdd ordering

Pinned compiler_functions.go targetRedLifeAdd emits redirectid/id/absolute/value; the Run consumer samples absolute before value. WEB previously read value before absolute. It now extracts the supplied boolean first while retaining the existing optional selection path and subsequent healing behavior. The pinned CNS compiler does not expose index even though the runtime enum includes it; existing WEB index behavior is not presented as certified CNS parity.

Tools/check-target-redlife.mjs first observed id/zero/flag instead of id/flag/zero; it also verifies undefined absolute is false for defense scaling. Eight actual actor cases register a target and assign/increment Var(7) across absolute/value in a zero-valued call, obtaining 2 rather than the old final 1. Evidence: targetRedLifeOrder assertions and outputs/target-redlife-order-browser.log. Native healing-source versions, recipient phases and complete parameter certification remain Pending.

TargetRedLifeAdd's positive-healing override now also uses explicit executing-code versions, matching its pinned Run method's c.stWgi condition. The common dispatcher resolves ordinary state providers versus own negative code; compatibility labels remain a module fallback only. Module tests conflict labels/native metadata, including a nonzero patch field with zero major/minor.

Eight actual actor cases register the opposing root with defense 2, life 100 and red life 500, then execute foreign ordinary versus own -2/-1 code with value 20 and explicit absolute=0. Red life becomes 510/520/520 respectively. Fixtures restore target lists, resources, defense, feature flags and engine metadata. Evidence: targetHealingResults assertions and outputs/target-redlife-version-browser.log. Complete recipient working-phase semantics and whole-controller certification remain Pending.
