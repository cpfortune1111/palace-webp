# Helper immortal and KO-velocity consumers (partial)

Reference: Ikemen GO cb56d73badb322f3725257c2e8cfd157b2c3989d. Reviewed Helper immortal/kovelocity reads, newChar helper/root defaults, isPlayerType, lifeSet, redLifeEnabled and lethal GetHit KO-velocity handling.

Helper creation now evaluates immortal and kovelocity as booleans in the original caller context. Both default false for Helpers, including player-type Helpers. The real Life/HitDef consumers share a helper lifeSet path: ordinary/projectile Helpers with immortal retain 1 HP when candidate life reaches zero. Player-type Helpers on a normal team can still die; neutral player-type Helpers follow the native immortal exception. No-damage phases preserve life. A zero-life candidate clears red life; disabled red-life display synchronizes it to final life.

This invariant now reaches actual LifeSet/LifeAdd/TargetLifeAdd resource adapters, queued Ikemen GetHit damage and immediate MUGEN Helper hit application. It is deliberately separate from damage prediction: a lethal hit may still cause fall/KO reaction metadata even if immortal ultimately keeps the Helper at 1 HP. Existing damage rounding/ledger behavior is not silently replaced.

The real KO-velocity solver now checks the recipient's Helper kovelocity flag. Default Helpers no longer receive root-only extra KO velocity; explicit true enables the native profile. Root defaults, base hit velocity, fall behavior and nokovelocity assertions remain independent. Only the additional KO adjustment is gated.

Evidence: 36 semantic type/team/immortal/red-life cases plus flag/default/no-damage checks; 96 actual browser version/player/type/immortal/controller-target-hit cases; 48 actual ground/air/default-explicit/asserted KO-velocity cases. Extra actual cases cover disabled red life, no-damage and neutral player-type Helpers.

The existing full-battle KO-vector fixture now explicitly enables kovelocity on its synthetic Helper. Its original expected velocity numbers are retained; default-off behavior has separate real-contact coverage. The fixture previously assumed root defaults on a Helper.

Pending: full Helper flag/compiler/RHS order, other constructor flags, native cross-actor/resource phases and override/rounding/ledger edge cases, configuration mapping and native executable differential certification. No whole-Helper or whole-resource certification changes. Character recoloring remains excluded; gameplay palette effects remain. No original assets or new media are added.
