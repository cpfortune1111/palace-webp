## 0.26.15 — Independent animation/sprite sources (partial)

Numeric animation source-player/ID parameters now reach real root/Helper frames, collision, clocks and drawing. Independent sprite ownership includes localcoord compensation in root/Helper drawing and reflections. Mixed-character source/crop/geometry/double/half-size tests, all 296 Node checks, five related browser gates and complete battle regression pass. Prefixes/common FX/cold assets and broader native version/phase fidelity remain Pending; no whole-controller certification. See Docs/ANIMATION-SPRITE-OWNER-WIP.md. Character recoloring remains excluded.

## 0.26.14 — State-entry animation validity (partial)

Numeric transition, root/Helper StateDef, locomotion and eager reaction animation switches now validate actions and retain progress on missing/-1. Successful P2 switches also commit their start clock, fixing the Saturn S3001 skip. Live P1 fixture bindings were corrected. All 294 Node checks, dedicated entry/clock cases, four related browser gates and the complete battle regression pass. Alternate animation/sprite providers, remaining legacy overrides and native phase fidelity remain Pending. See Docs/STATE-ANIMATION-ENTRY-WIP.md; no whole-controller certification is claimed.

## 0.26.13 — Animation presence and element selection (partial)

Missing animations no longer expose character collision boxes; valid empty actions retain native character Size behavior while projectile recipients still require a current frame. Numeric ChangeAnim/ChangeAnim2 keeps the current action on failure and applies explicit elem/elemtime afterward, validating time against the committed animation. Both root players and Helper browser fixtures, all 294 Node checks, four related collision browser gates and the final full-battle regression pass. Full animation/sprite providers, prefixes, entry validity and native frame phases remain Pending; neither controller is certified complete. Character recoloring remains excluded.

## 0.26.12 — Character collision position (partial)

Native size.draw.offset and Offset now feed ordinary/reversal/query collision positions, actor drawing, reflections and debug outlines while logical Pos remains independent. Normal Offset consumes the real caller world/localcoord ratio, including mixed-coordinate redirection and omitted-axis retention. Sixteen actual version/player/facing/localcoord cases, real root rendering, proxy-child geometry, all 293 Node checks, eighteen related browser gates and full-battle simultaneous/1-tick/5-tick super regressions pass. Broader float/provider/offset-dependent consumer/native phase fidelity remains Pending; no whole-controller or collision-system certification changes. See Docs/CHARACTER-COLLISION-POSITION-WIP.md. Character recoloring remains excluded; no original assets or media are added.

Previous 0.26.11 publication was verified at 7e38ec234c3f57ded0dde1f22e507b8e80e0ec53, successful Pages run 40236666952 and eleven frozen live text comparisons.

## 0.26.11 — Collision overlap queries (partial)

ClsnOverlap and ProjClsnOverlap now reach actual parser, typed boolean, actor geometry and CNS controller consumers. Strict literal box contracts, original-caller redirected arguments, active owned projectile indexes, proxy/Size/depth/immunity rules and standby-owner independence have real tests. Forty-eight character and twenty-four projectile combinations, all 292 Node checks, seventeen related browser gates and full-battle simultaneous/1-tick/5-tick super regressions pass. Broader animation/provider/offset/native phase/logging/differential fidelity remains Pending; no whole-Helper or collision-system certification changes. See Docs/CLSN-OVERLAP-WIP.md. Character recoloring remains excluded; no original assets or media are added.

Previous 0.26.10 publication was verified at db0fd6516a27b069b7233fa375b99205d4517c15, successful Pages run 40234407328 and eleven frozen live text comparisons.

## 0.26.10 — Helper collision proxies (partial)

Helper clsnproxy now reaches ordinary HitDef and ReversalDef geometry through live proxy-only descendant families, while damage/contact/power remain assigned to logical parents. Size stays local; independent proxies cannot hit or be hit. Per-box HitBy reads actual source/proxy attributes and required-box existence precedes immune-box filtering. Forty ordinary and thirty-two reversal browser cases, actual automatic parent reversal/power, typed/traversal/provider checks, all 291 Node checks, fifteen related browser gates and full-battle simultaneous/1-tick/5-tick super regressions pass. Overlap-trigger/further-provider/offset/depth/phase/native differential fidelity remains Pending; no whole-Helper certification changes. See Docs/HELPER-CLSN-PROXY-WIP.md. Character recoloring remains excluded; no original assets or media are added.

Previous 0.26.09 publication was verified at 29f64fbe296a842d04c59640cf8d41392198f452, successful Pages run 40232136177 and eight frozen live text comparisons.

## 0.26.09 — Helper standby consumers (partial)

Helper standby now reaches actual Ctrl/Standby queries, attack/recipient collision and contact, proximity guard, PlayerPush, camera tracking and screen-bound consumers. CNS, movement, animation clocks and stage bounds continue. Forty-eight browser combinations, typed constructor checks, all 290 Node checks, fourteen related browser gates and full-battle simultaneous/1-tick/5-tick super regressions pass. Full compiler/team/tag/phase/debug-visual/native differential fidelity remains Pending; no whole-Helper certification changes. See Docs/HELPER-STANDBY-WIP.md. Character recoloring remains excluded; no original assets or media are added.

Previous 0.26.08 publication was verified at 41e43d87f10bae93a1957adac98ccf22cb764ad2, successful Pages run 40230636821 and seventeen frozen live text comparisons.

## 0.26.08 — Helper preserve lifecycle (partial)

Helper preserve now controls actual per-player cleanup and inter-round retention, with forced cleanup for a new match. Preserved objects retain CNS/animation/life/variables and native KO/hit/juggle/invulnerability/counter/move-hit/power registries. Live HitDef committed/buffered history survives independently of cleared Target bindings. Semantic and real VS round-two/new-match tests cover retained clocks, orphan parent references, continued CNS and MoveHitVar uniqhit. Full native lifecycle/phase/destruction/cache and executable differential fidelity remain Pending; no whole-controller certification changes. See Docs/HELPER-PRESERVE-WIP.md. Character recoloring remains excluded; no original assets or media are added.

Previous 0.26.07 publication was verified at 7154f4ec71bcf521eb58631dd2a69395183ba2b9, successful Pages run 40228069716 and eleven frozen live text comparisons.

## 0.26.07 — Helper survival flags (partial)

Helper immortal and kovelocity now reach actual life and lethal-contact consumers, including LifeSet/LifeAdd/TargetLifeAdd and immediate/queued hit damage. Native role/team exceptions, red-life handling and default-off Helper KO adjustment are preserved. Validation: 287 Node checks, 96 actual life cases, 48 actual KO-velocity cases, twelve additional focused browser gates, stage reflection, five sound metadata tests and full-battle regression including simultaneous/1-tick/5-tick Miss/Miss supers all pass. Full Helper/compiler/resource-phase/native differential fidelity remains Pending. See Docs/HELPER-SURVIVAL-WIP.md. Character recoloring remains excluded; gameplay palette effects remain in scope. No media/original assets are added.

Previous 0.26.06 publication was verified at b47b7ac2746d8469576113ea9a61e468df677d45, successful Pages run 40225878560 and ten frozen live text comparisons.

## 0.26.06 — Helper name consumers (partial)

Helper creation now stores native default names or evaluated caller-context strings, rather than relying on a literal-only query fallback. Names derive from the recipient parent under redirect; explicit expressions retain caller scope and precede later state/ID writes. HelperName, live literal renaming and nested creation-time snapshots have real consumers. Sixty-four browser cases and semantic strict/loose-name checks verify these paths. Other Helper fields/compiler/registration/string-parser fidelity remain Pending; no whole-controller certification changes. See Docs/HELPER-NAME-WIP.md. Character recoloring remains excluded; no media/original assets are added.

Previous 0.26.05 publication was verified at e40e3ef0edd2d29e133187cdba8b9fb795c7a508, successful Pages run 40224219183 and ten frozen live text comparisons; earlier pending wording below is historical.

## 0.26.05 — Helper redirect and placement (partial, release pending)

Helper creation now separates original-caller expressions from redirected-recipient ownership and inheritance. Standard p1/p2/front/back/left/right/none postypes, XYZ position, facing and typed pause fields have real consumers with local-scale conversion. Negative Helper/Projectile pause allowances follow their native class rules. Eighty-four semantic and 168 real mixed-coordinate/recipient/facing/postype cases verify these paths and drawing. Full Helper field/compiler order, provider/global-phase edge cases and first-body timing remain Pending; no whole-controller certification changes. See Docs/HELPER-PLACEMENT-WIP.md. Character recoloring remains excluded; no media/original assets are added.

Previous 0.26.04 publication was verified at 1691df96b703f8501067b2ca0e9aa7e297f819c8, successful Pages run 40222325664 and ten frozen live text comparisons; earlier pending wording below is historical.

## 0.26.04 — Helper entry bootstrap (partial, release pending)

New Helpers now begin with native animation 0, control enabled, zero velocity and life/max-life inherited from the parent's maximum before StateDef overrides. Missing/-1 animations render correctly. State/ID defaults and integer caller expressions are consumed once; negative IDs clamp, and the game's H950 suppression remains. Twenty-four root/nested/player/version/StateDef browser cases verify real sprite drawing plus scalar edge cases. Projectile contact fixtures no longer force Helper animation. Remaining Helper fields, full compiler/first-body timing and native differential fidelity stay Pending; no whole-controller certification changes. See Docs/HELPER-ENTRY-WIP.md. Character recoloring remains excluded; no media/original assets are added.

Previous 0.26.03 publication was verified at 9659912be74e772f2cf14588e36777ca85c9cda7, successful Pages run 40220691170 and eleven frozen live text comparisons; earlier pending wording below is historical.

## 0.26.03 — Owner-scoped Projectile events (partial, release pending)

Real projectile hits, guards, cancellations and Helper-recipient contacts now publish one latest event per owner. Typed Proj*Time queries, basic legacy ProjHit/Guarded/Contact expressions, default/own Helper ownership, reset/destruction and pause-aware clocks have real consumers. Thirty-two browser cases and semantic checks verify these paths. Complete legacy time-comparison syntax, exact native cross-actor phases and remaining Projectile/controller families stay Pending; no whole-controller certification changes. See Docs/PROJECTILE-CONTACT-EVENTS-WIP.md. Character recoloring remains excluded; gameplay PalFX remains. No media/original assets are added.

Previous 0.26.02 publication was verified at ab7212077ca3e68d98dbed854a4299964313197b, successful Pages run 40218636383 and eleven frozen live text comparisons; earlier pending wording below is historical.

## 0.26.02 — Projectile AfterImage consumers (partial, release pending)

Projectile creation and the real renderer now consume independent histories, with native hitpause/SuperPause recording rules and shared player budgets. Partial ModifyProjectile supports redirect, active owned ID/index selection, projid renaming and deferred per-projectile AfterImage writes without clearing history. Ordinary Helper projectiles now belong to the root unless ownprojectile is enabled; counts and selection follow ownership. Eight real browser combinations and semantic tests cover these paths. Other Projectile/ModifyProjectile families, Helper contact-event triggers and exact native fidelity remain Pending; no whole-controller certification changes. See Docs/PROJECTILE-AFTERIMAGE-WIP.md. Character recoloring remains excluded; gameplay PalFX remains. No media/original assets are added.

Previous 0.26.01 publication was verified at 190df5987c4710482b4beaea153d9981f9fb8e7e, successful Pages run 40216940885 and twelve frozen live text comparisons; earlier pending wording below is historical.

## 0.26.01 — Explod AfterImage parameters and player budgets (partial, release pending)

Explod creation and ModifyExplod now consume prefixed AfterImage parameters through the real history renderer. Deferred expressions run per parameter/per effect, active setup happens after the full commit, and changing settings retains old sprite histories and unspecified vector components. Sixteen own/common-resource/root/Helper/version/player combinations cover rendering, RHS side effects, independent histories and the pinned 512-per-player sprite budget. Configurable budget unit checks and shared standalone-controller regressions accompany these consumers. Native cue ordering, other Explod families and Projectile histories remain Pending; no whole-controller certification changes. Character recoloring remains excluded; gameplay PalFX remains. See Docs/NATIVE-AFTERIMAGE-WIP.md.

Previous 0.26.00 publication was verified at 17f6a9dc272784327e485561bc5fe8ec72ea8cd5, successful Pages run 40215261988 and nine frozen live text comparisons; earlier pending wording below is historical.

## 0.26.00 — Native AfterImage histories and synchronization (partial, release pending)

Actual AfterImage controllers now retain independent root/Helper sprite histories with MUGEN/Ikemen sampling, palette gradients, timing controls and real historical transforms/clipping/priorities. Synchronized effects copy settings while retaining their own history; AfterImageTime preserves recorded frames. Eight real browser combinations include pixel composition and independent effect capture. Full-battle Offset/AngleDraw checks use historical sprite snapshots. Exact native timing, global budgets and remaining creation/provider families stay Pending; no whole-controller certification changes. See Docs/NATIVE-AFTERIMAGE-WIP.md. Character recoloring remains excluded; gameplay PalFX remains. No media/original assets are added.

## 0.25.99 — ModifyExplod synchronization consumers (partial, release pending)

Modified effects now synchronize target grouping, priority/facing, size/orthographic transforms, clipping, shear and Trans/shared-PalFX during late updates, including hitpause. Disabling synchronization retains snapshots/live palette references as appropriate; redirected recipients and missing targets have real consumers. P1's missing sprite-priority adapter is corrected. 160 actual cases accompany semantic checks. Projection/shader/AfterImage sync families and full native fidelity remain Pending; syncparams is partial, not fully certified. Recoloring remains excluded; no media/original SFF/SND/AIR are added.

## 0.25.98 — ModifyExplod staged binding consumers (partial, release pending)

Modified effects now bind to actual root/Helper targets with finite/native-versioned countdowns, fixed relative facing and queued release velocity. P1 postype finalization and screen-edge behavior have real consumers. The late simulation path runs once after moving characters/Helpers in fighting and non-fighting branches; paused/disabled zero-age expiry is covered. 144 actual cases accompany independent traces. Full native phase/space/provider/creation fidelity and remaining controllers/parameters remain Pending; no whole-controller certification changes. Recoloring stays excluded; gameplay PalFX remains. No media/original SFF/SND/AIR are added.

## 0.25.97 — ModifyExplod cross-effect commit visibility (partial, release pending)

ModifyExplod now batches its real selected effects around deferred windows. Each window sees all preceding field updates across the collection, without seeing later angles/animation/hitpause flags from earlier effects. Sixteen real evaluator-observation cases accompany independent commit/ownership checks. Binding review exposed this ordering prerequisite; finite binding itself and full native phase/provider/controller coverage remain Pending. No whole-controller certification changes. Recoloring stays excluded; gameplay PalFX is retained. No media/original SFF/SND/AIR are added.

## 0.25.96 — ModifyExplod geometry/compiler ordering (partial, release pending)

ModifyExplod rotation, orthographic X/Y angles, shear and window clipping now reach actual drawing. Window operands are deferred and written per component/per effect. Native compiler review corrects selector, velocity-synonym and layer/ontop precedence. Forty-eight actual matrix/pixel-clipping/side-effect cases accompany semantic checks. Full native GPU/provider/compiler/phase fidelity and remaining controllers/parameters remain Pending; no whole-controller certification changes. Recoloring remains excluded; gameplay PalFX is retained. No media/original SFF/SND/AIR are added.

## 0.25.95 — ModifyExplod animation/resource consumers (partial, release pending)

ModifyExplod now changes real frame position/time, freeze/resume and own/common animation resources. Animation and sprite players select timing and atlas independently while preserving effect lifetime/motion. MUGEN-character animation locks, missing actions and native empty action -2 have real consumers. Thirty-two playback cases and 128 distinct-character resource/draw cases accompany semantic checks. Full native provider/phase/library fidelity and remaining controllers/parameters remain Pending; no whole-controller certification changes. Recoloring stays excluded; gameplay PalFX is retained. No new media or original SFF/SND/AIR are included.

## 0.25.94 — ModifyExplod blend and ownership lifecycle consumers (partial, release pending)

ModifyExplod Trans/alpha now reaches real blended drawing; ignorehitpause follows the actual effect parent. Removal flags support owner-isolated qualified hits and real deferred StateDef initialization, including same-state restarts and explicit disabling. Actual pixel, contact and hitpause/state tests accompany typed semantic checks. Exact native phase/provider fidelity and remaining controllers/parameters remain Pending; no whole-controller certification changes. Recoloring remains excluded; gameplay PalFX is retained. This update includes no original SFF/SND/AIR or new media.

## 0.25.93 — ModifyExplod visual and timing consumers (partial, release pending)

ModifyExplod facing/layer/priority flags now reach real draw transforms and ordering, preserving native MUGEN flip restrictions and sticky under behavior. Removal and pause movement fields consume native versioned effect-age deadlines, negative modes and override order. Sixteen visual fixtures, 64 removal modes and 128 pause cases pass with actual effects/drawing. Full remaining parameters, native phase/lifecycle fidelity and final deployment remain Pending; no whole-controller certification changes.

## 0.25.92 — Explod random and ModifyExplod motion (partial, release pending)

Own/common Explods now consume native XYZ random offsets and preserve relative facing/binding. ModifyExplod has real selection, random/pos/velocity/accel/friction/scale consumers, native MUGEN locks/reset rules and float32 motion. Sixteen actual mixed-effect cases plus forty controller-specific scheduling groups pass; the expanded matrix has 400 groups. Other parameters/postypes, full native fidelity and final regression/deployment remain Pending. No whole-controller certification changes; no original assets included.

## 0.25.91 — Native controller random consumers (partial, release pending)

VarRandom, GameMakeAnim, AssertCommand and TargetDrop now share pinned integer/float32 random operations. Random samples per occurrence; RandomRange is a typed integer intrinsic with undefined/lazy-branch gates. Actual root/Helper/player/profile interleavings and boundary checks pass. Full RNG consumer unification, configured seeding/replay lifecycle and compiler/version fidelity remain Pending; no whole-controller certification changes. Final regression/deployment remain required; character recoloring stays excluded.

## 0.25.90 — Common animation resources and ownership (partial, release pending)

GameMakeAnim now loads all 33 compressed project common animations, preserves own animation ownership in foreign states, discards invalid actions without stopping the match and retains indefinite AIR frames while skipping zero-time elements. Real common-frame/lifetime, opaque/A/A1 composited-pixel, foreign-state and held-frame checks pass. Full native library/limits/RNG/compiler/version fidelity and final deployment remain Pending; no whole-controller certification changes. Original SFF/SND/AIR are not included; character recoloring remains excluded.

## 0.25.89 — GameMakeAnim consumers (partial, release pending)

GameMakeAnim now reaches real own/common animation rendering, caller-context redirected XYZ/random positions, native under/priority defaults, omitted own-animation-zero behavior and moving-Helper binding. Thirty-two consumer cases plus depth/default/lifetime checks and forty scheduling groups pass. Full native resources, limits, RNG and version/compiler fidelity remain Pending; no whole-controller certification is claimed. Character recoloring remains excluded.

## 0.25.88 — MakeDust consumers (partial, release pending)

MakeDust now uses the actual compressed F120 animation, actor-owned spacing clocks, redirected positions, NoMakeDust suppression, native hitpause playback and real root/Helper drawing. Helper binding and enabled-stage Z projection have actual simulation/drawing checks. Sixteen focused browser cases and forty controller-specific scheduling groups pass. Complete native fidelity and final versioned deployment remain Pending; character recoloring remains excluded.

## 0.25.87 — EnvColor consumers and scope update (partial, release pending)

EnvColor now fills the actual fight-screen compositor with native signed RGB/defaults, layer rules and simulation duration. Sixteen root/Helper/profile/player pixel cases and forty controller-specific scheduling groups pass. Character recoloring/RemapPal expansion is excluded by user request; unused indexed assets no longer preload automatically, while existing gameplay color effects remain. Full native controller compatibility and final versioned deployment remain Pending.

## 0.25.85 — Round time consumers (partial)

RoundTimeSet/Add now change actual HUD countdown ticks, preserving signed arithmetic, configured bounds and unlimited-expression skipping. Actual root/Helper timer/display checks, production round-flow Time Over integrations and eighty controller-specific scheduling groups pass. The pinned native runtime ignores redirectid; this is recorded, not counted as implemented redirection. Full native timing/configuration/compiler/version fidelity and final versioned regression/publication remain Pending.

## 0.25.84 — AssertCommand consumers (partial)

AssertCommand now writes real signed command buffers with native name/default/random-time rules and root/Helper ownership. Explicit assertions are visible to already-created expression contexts and expire through normal input sampling; nonasserted AI behavior is retained. Actual recipient, clear/expiry and forty scheduling groups pass. Full foreign-state command tables, native RNG/compiler/version fidelity and final versioned regression/publication remain Pending.

## 0.25.83 — ModifySnd consumers and sound grammar (partial)

ModifySnd now reaches owned audio pan/volume/priority/stop flags and native speed/seek/loop updates, with ordered pending commands and audio-thread acknowledgements. Forty exact root waveform cases, six Helper ownership cases and forty actual scheduling groups pass. Sound values support lexical/dynamic string prefixes and omitted item=0; rejected allocations no longer leak menu tracking. Complete compiler/version/device/clock fidelity remains Pending; final versioned regression and verified publication are separate gates.

## 0.25.82 — Native default playback and readiness (partial)

PlaySnd now uses native playback even when speed/loop/seek fields are omitted. Selected-character preparation awaits decoded own/common sounds and shared worklet setup; repeated preparation reuses the verified cache. The character mixer explicitly requests the pinned 44100-Hz default. Real default-waveform, Helper ownership/priority/capacity, preparation/cache and context-rate checks pass. Full native compiler/version/settings/device/clock fidelity remains Pending; final versioned regression and verified publication remain separate gates.

## 0.25.81 — Native PlaySnd speed, loops and seek (partial)

Explicit playback parameters now reach a native-frame AudioWorklet stream with source-rate metadata, PCM normalization, bounded/infinite loops, seek and frequency resampling. All 338 current sound entries validate; 22 additional lossless FLAC variants preserve exact original frame counts where MP3 decoding differed. Actual own/common P1/P2 sample renders, cancellation and cleanup checks pass. Default legacy playback, full native timing/configuration/compiler parity and whole-controller certification remain Pending. Final versioned regression and verified publication remain separate gates.

## 0.25.80 — PlaySnd pan, volume and stop flags (partial)

CNS PlaySnd now supplies default/explicit positional pan, absolute override and recipient-owned volume/volumescale gain through real media graphs. Flagged sounds stop at actual StateDef initialization or real reaction-hit acceptance, not during deferred selection, hitpause, guard or None contact. Actual root/Helper/foreign-state consumers and rendered gain/clipping probes cover these paths. Remaining frequency/loop/seek parameters, legacy version interactions, native timing/settings fidelity and whole-controller certification stay Pending; final regression and verified publication are separate gates.

## 0.25.79 — SndPan audio consumers (partial)

SndPan now reaches real owned media graphs with native linear stereo gains, typed redirect/channel parameters, relative facing/local-scale capture and absolute pan. Offline sample renders, actual root/normal-Helper coordinate/source tracking, graph reuse/cleanup and forty scheduling groups pass. PlaySnd lowpriority now evaluates before priority. Full sound parameters, native timing/settings/audio-device fidelity and whole-controller certification remain Pending; final versioned regression and verified publication are separate gates.

## 0.25.78 — Character sound ownership (partial)

PlaySnd/StopSnd now use root/Helper-owned channels, parent/root playback inheritance and native negative-channel selection. Numbered-channel priority, player-pool capacity and automatic-first oldest/slot eviction have executable checks plus actual source/Helper/saturation consumers. Negative sound groups do not allocate media. Remaining sound parameters, audible output, native clock/configuration fidelity and whole-controller certification remain Pending; final versioned regression and verified publication are separate gates.

## 0.25.77 — MoveHitReset controller consumer (partial)

MoveHitReset now executes for roots, reaction roots and Helpers, clearing contact time/counter flags without discarding hit counts or MoveHitVar data. Fresh and pre-existing expression contexts observe reset state. Actual source-state tests cover both profiles/player directions, omitted/redirected recipients, hitpause, persistent-zero current/global behavior and global-pause Helper allowance. Full native diagnostics/compiler/version/lifecycle fidelity and whole-controller certification remain Pending; final versioned regression and verified publication are separate gates.

## 0.25.76 — Gravity controller consumer (partial)

Gravity now executes through shared root/Helper dispatch, using recipient-owned acceleration and float32 current-state coordinate conversion. A dedicated own-character data path prevents foreign states from supplying the wrong constant. Actual normal-spawn Helper/root tests cover both profiles, ownership directions and 320/640 coordinates; Gravity-specific hitpause scheduling tests cover current/global/lifecycle adapters. Full native persistence/pause/compiler/version fidelity and whole-controller certification remain Pending; final versioned regression and verified publication are separate gates.

## 0.25.75 — Reflection window consumers (partial)

ModifyReflection window now reaches root/Helper clipping with caller/recipient scaling, transient reset and native stage-origin/reflected-Y rules. Supported stage window literals pass through the production parser into live fallback clips; controlled queued raster tests prove inside/outside pixels. Stage intensity zero now suppresses all reflections even with positive actor overrides. Remaining stage coordinate systems, parser/compiler/version behavior and full renderer/controller compatibility remain Pending; final versioned regression and verified publication are separate gates.

## 0.25.74 — Helper reflection consumers (partial)

Visible Helpers now cast stage reflections and consume supported ModifyReflection alpha/color/geometry parameters. Normal Helper spawning initializes independent overrides; active preparation clears them during local hitpause while blocked global pause retains them. Actor-local AssertSpecial NoShadow suppresses root/Helper reflection with controller-driven visible/restored tests. Remaining reflection animation/window/shear/projection, shadow/rendering/stage/phase fidelity and whole-controller compatibility remain Pending; final versioned regression and verified publication are separate gates.

## 0.25.73 — Target operand extraction (partial)

Twelve Target controller types now share native-style integer extraction for redirect IDs, hit IDs, indices and integer payload fields. TargetDrop keepone and point-controller absolute flags use native boolean extraction. Actual root/Helper consumer tests distinguish quoted-string IDs from numeric controls through changed velocity and retained target lists, with both profile/player directions covered. Full target/native diagnostics/version semantics and whole-controller certification remain Pending; final versioned regression and verified publication are separate gates.

## 0.25.72 — Additional native redirect extraction (partial)

Twenty-one collision/drawing/input/hit/score/feedback/clipboard controller types and the legacy Helper feedback gate now share native-style integer extraction for explicit redirect IDs. Actual quoted-ID browser fixtures preserve RHS side-effect isolation in both profiles and player directions; AttackDist's adapted recipient lookup rejects disabled Characters. Remaining ID/index consumers, full parameter/native diagnostics/version behavior and whole-controller certification remain Pending. Final versioned regression and verified publication are separate gates.

## 0.25.71 — Native redirect integer extraction (partial)

Sixteen position/velocity/angle/multiplier/state-property controller types now reject numeric strings as redirect IDs and preserve signed integer extraction. Actual angle/attack/defense/state adapters also reject disabled recipients before adapting storage. Focused checks include failing-before examples and actual P1/P2 browser cases in both profiles. Remaining integer consumers, native version/compiler/diagnostic behavior and whole-controller compatibility remain Pending; final versioned regression and verified publication are separate gates.

## 0.25.70 — Character ID lookup isolation (partial)

Controller redirects, Target queries and lifecycle PlayerID/PlayerIDExist distinguish root/Helper Characters from combat projectiles and reject destroyed/disabled recipients. Forty direct and four custom adapters use the shared resolver. Actual P1/P2 tests in both profiles include a prior-resolver negative control, side-effect isolation and unchanged collision/source lookup. Complete native diagnostics, remaining adapters and all-controller certification remain Pending; final versioned regression and verified publication are separate gates.

## 0.25.69 — Root reflection override consumers (partial)

ModifyReflection root intensity, RGB, offset, signed scale, keeptransform and orthographic rotation parameters reach actual drawing, palette composition and transient preparation resets. Production stage parser output drives color/angle fallback tests; no original image/audio assets are regenerated. Both roots have real matrix, pause/reset and controlled compositor pixel coverage. Remaining animation/window/shear/projection parameters, Helper/projectile reflection drawing and full native compatibility remain Pending. Final versioned regression and verified publication are separate gates.

## 0.25.68 — Variable undefined and stored-float boundaries (partial)

Negative variable reads now return undefined and family-specific warnings, including integer-query paths. Stored float NaN and negative zero survive reads, and VarAdd preserves an existing NaN. Real parser and P1/P2 root/Helper fixtures exercise both named engine profiles and actual P1 lifecycle bindings. Complete native warning/VM/version/bounds fidelity remains Pending; final versioned regression and verified publication are separate gates.

## 0.25.67 — Variable extraction and system selectors (partial)

Variable controllers, expression assignments and read indices now preserve native string/undefined zero extraction. VarRangeSet honors value/fvalue precedence and invalid-range RHS evaluation. Legacy sysv/sysfv selectors reach system storage, and Helpers now own independent system-float arrays. Real parser and eight profile/player/root-or-Helper scenarios cover these paths. Full compiler/error-mode/overflow/VM/lifecycle compatibility remains Pending; final versioned regression and verified publication are separate gates.

## 0.25.66 — Live parent ancestry and family controllers (partial)

Parent queries now distinguish immediate Helper parents from Root and return undefined for roots or destroyed parents. Shared ancestry lookup also fixes first-generation BindToParent and supplies both variable-controller adapters. Actual P1/P2 fixtures cover two Helper generations, binding owners, ParentVarSet/RootVarSet isolation and missing-parent refusal. Native coordinate/version/diagnostic/lifecycle equivalence remains Pending; final versioned regression and verified publication are separate gates.

## 0.25.65 — PlayerID native operand scope correction (partial)

Deeper pinned compiler review corrects the 0.25.64 whole-expression scope claim: PlayerID redirects one following operand. Binary operands outside that value retain caller scope. The pinned compiler rejects nonconstant parenthesized queries inside redirection; tested constant groups remain accepted. Standalone and actual P1/P2/Helper tests cover these distinctions. Complete native compiler/diagnostic/version fidelity remains Pending; final release validation and verified publication are separate gates.

## 0.25.64 — Sprite layers, reflection phases and PlayerID (partial)

SprPriority nonzero layers and live integer LayerNo queries now reach actual roots/Helpers. Stage-controlled reflections have separate negative/zero passes, native priority/tie ordering and literal settings import. PlayerID expression redirection resolves live character instance IDs, preserves original index scope and redirects the complete expression. Focused pixels, real actors and parser tests cover these paths. Native diagnostics, full rendering/VM/version semantics and whole-controller certification remain Pending. Final versioned regression and verified publication are separate gates.

## 0.25.63 — TransformSprite window/shear consumers (partial)

TransformSprite window/xshear reach actual redirected P1/P2/Helper drawing and synchronized Explods. Tests cover caller-scoped writes, native coordinate ratios, transient preparation/pause behavior and real body/effect matrices. A failing 27-case fixture fixed native localscl versus WEB rendering-width confusion. Focallength/projection remain explicitly unsupported; compiler/diagnostic/phase/GPU equivalence and all whole-controller certifications remain Pending. Final versioned checks and verified publication are separate gates.

## 0.25.62 — Ordinary Explod window/geometry consumers (partial)

Explod window, relative facing/VFACING, angle/Y/X and xshear now reach actual clipping and affine drawing. Fixtures cover 96 stage-window, 48 screen-window, 36 rotation and 192 shear/reflection/scale cases, plus immediate/resolved clip pixels. All 218 Node checks and focused actor cases pass before versioning; complete/versioned regression and verified publication remain separate gates. Native perspective/interpolation/redirect/compiler/lifecycle/GPU equivalence and whole-controller certification remain Pending.

## 0.25.61 — Explod synchronization consumers (partial)

Ordinary Explods synchronize supported priority/facing, Trans/alpha, shared PalFX and size/AngleDraw transforms with real drawing and color-pixel coverage. Root/Helper body grouping, preparation cleanup and destroyed-Helper draw suppression have actual browser tests. All 214 Node checks and focused actor/scheduling browsers pass before versioning. Complete battle regression, final versioned gates and verified publication remain separate. Full syncparams/window/shear/projection/shader/afterimage/compiler/lifecycle semantics and all whole-controller certifications remain Pending.

## 0.25.60 — Actor/effect layer consumers (partial)

Root/Helper layers reach actual battle passes. Afterimages retain historical layers and priority clamps; ordinary Explods consume ONTOP/under/layerno and syncid/synclayer with native-style grouped ordering. All 214 Node checks, focused actor/pixel/scheduling browsers and complete battle regression pass before versioning. Final versioned regression and verified publication remain separate gates. Nonzero SprPriority and full lifecycle/compiler/ModifyExplod/syncparams/reflection/HUD semantics remain Pending; no whole-controller certification is claimed.

## 0.25.59 — Status/bound extraction and real movement consumers (partial)

DizzySet/GuardBreakSet and ScreenBound/DepthBound/PosFreeze/PlayerPush preserve native boolean extraction; reviewed redirect/priority operands reject runtime numeric strings. Status queries retain boolean arithmetic and ScreenBound camera flags commit sequentially. Root push uses each character's own widths instead of Venus constants. Actual root/Helper writes, Root XY and Helper XYZ freeze, push distances and source-backed fixture contracts have executable coverage. All 213 Node checks and focused browser cases pass before final versioning. Final versioned regression/publication remain separate gates. Full compiler/integer/vector/diagnostic/pause/native-phase/team semantics and all 163 whole-controller certifications remain Pending.

## 0.25.58 — ModifyPlayer extraction and AI query consumers (partial)

ModifyPlayer boolean/float/integer operands reject runtime string and undefined coercion. Actual root/Helper cases cover resource maxima, move-contact queries, KO/control/AI writes and timer edge cases. AILevel/MoveCountered preserve integer arithmetic; AILevelF retains float values and native noAILevel integer-zero tags. Legacy no-context AILevelF now respects the selected player. All 211 Node checks and focused actor cases pass before final versioning. Final versioned regression and verified publication remain separate gates. Full integer overflow/compiler/version/frame-phase/team/parameter semantics and all 163 whole-controller certifications remain Pending.

## 0.25.57 — Map static syntax and routing (partial)

Map controller names and reset exclusions preserve native static text instead of evaluating expressions. Embedded assignment syntax and literal whitespace have focused and real actor coverage. TeamMap now respects modified team side in the current two-player engine. Redirect operands retain caller scope and single evaluation; string/undefined IDs extract as zero and invalid targets warn without RHS writes. All 211 Node checks passed before the latest extraction/metadata changes; newer focused actor gates pass. Final versioned full regression/publication are separate gates. Simul/attached populations, complete compiler/diagnostics/native integer conversion and all 163 whole-controller certifications remain Pending.

## 0.25.56 — Map constant/default boundaries (partial)

Map controller numeric constants use the native float compilation boundary while dynamic values retain runtime tags. Typed DEF defaults now pass through all five character builders, root initialization, independent Helper maps and MapReset. Optional --language preserves source-order localized overrides; exact rational conversion avoids decimal/hex float32 double rounding. Explicit float NaN remains distinct from undefined in storage. All 209 Node checks and eight Python import checks pass before final versioning; actual Helper/browser cases and real isolated Moon builds cover nonempty data. Final versioned regression and verified publication remain separate gates. Full diagnostics/byte strings/VM/version/parameter semantics and all 163 whole-controller certifications remain Pending.

## 0.25.55 — Typed maps and CNS scheduling consumers (partial)

Map Set/Add/query/reset and literal-key := assignment preserve selected value tags through real arithmetic and redirected writes. CNS persistent/ignorehitpause use pinned literal parsing across common/root/helper/lifecycle gates. Shared trigger boolean extraction, score/EnvShake invalid operands and AngleDraw pair validation have real consumers and tests. All 207 Node checks and focused actor/scheduling suites pass before metadata changes; versioned final regression/deployment are separate gates. Complete defaults/type/VM/version/phase/parameter semantics and all 163 whole-controller certifications remain Pending. See MAP-VALUE-TYPES-WIP.md, CNS-SCHEDULING-LITERALS-WIP.md and CONTROLLER-VALUE-CONVERSION-WIP.md.

## 0.25.54 — Resource ordering and working-code versions (partial)

LifeAdd, RedLifeAdd, DizzyPointsAdd, GuardPointsAdd and TargetRedLifeAdd now preserve native operand ordering and zero-value side effects. Life/target-redlife healing uses working-code versions; self/redirected dead-life floors distinguish recipient ownership. TargetLifeAdd validates required value and boolean flags. StateDef velset extracts undefined/string operands as zero through real Helper entry. Expanded actual actor/resource/target tests and 204 Node checks pass before release metadata changes. Versioned final regression/deployment are separate gates. All 163 whole-controller certifications and broader VM/phase/type/parameter semantics remain Pending. See LIFE-EVALUATION-WIP.md and CONTROLLER-VALUE-CONVERSION-WIP.md.

## 0.25.53 — Controller extraction and native write ordering (partial)

AttackDist writes components before later expressions read guard distance. DefenceMulSet stages onhit before committing defense and uses native own/foreign code-version defaults. Selected angle/attack/defense/distance/position/velocity/target-velocity consumers map undefined/string operands at extraction, without changing expression propagation. Actual actor/query/target cases pass; 204 Node checks passed before metadata changes. Final versioned combined regression and verified publication remain separate gates. Full parameter/VM/version/scheduling/rendering compatibility and all 163 controller certifications remain Pending. See CONTROLLER-VALUE-CONVERSION-WIP.md, ATTACK-DISTANCE-EVALUATION-WIP.md and DEFENSE-EVALUATION-WIP.md.

## 0.25.52 — Angle staging and clipboard formats (partial)

AngleSet/AngleMul now sample operands before committing axes; selected Angle/XAngle/YAngle queries have float tags and respect AngleDraw enablement. Eight actual profile/player/root-or-Helper scenarios cover these consumers. Clipboard string/default/quote, integer bases, Unicode and exact float32 binary/hex formats have focused checks and actual HUD coverage. All 203 Node checks pass before version metadata changes; final versioned regression and verified deployment are separate gates. Complete formatting grammar, native version/scheduling/rendering and all 163 controller certifications remain Pending.

## 0.25.51 — Own animation queries and debug clipboard consumers (partial)

SelfAnimExist now checks the selected actor's own complete imported action inventory, independently of borrowed providers or preloaded graphics. Display/Append/ClearClipboard now execute, keep actor-isolated buffers and render in the debug HUD instead of silently doing nothing. Supported float32 formatting has exact numeric rounding and independent CRT observations. All 201 Node checks and focused actor/HUD suites pass; final complete regression/deployment are separate gates. Full printf, legacy animation/value/version/native phases and controller certifications remain Pending. See SELF-ANIMATION-QUERY-WIP.md and DEBUG-CLIPBOARD-WIP.md.

## 0.25.50 — Comparison and intrinsic query consumers (partial)

State/name comparisons and eight intrinsic query families retain native result tags through real parameters. Caller-scoped ID sampling, undefined rejection, optional defaults and nonpositive Helper/all-effect counts have actual root/Helper evidence. All 198 Node checks and focused actor suites pass; final combined regression/deployment are separate gates. Full flags/providers/arity/version/VM/native phases and controller parameter semantics remain Pending. No controller certification changes. See COMPARISON-RESULT-TYPES-WIP.md and INTRINSIC-QUERY-TYPES-WIP.md.

## 0.25.49 — Query, interval and logical undefined consumers (partial)

Forty-one existing queries now retain source-checked integer/boolean/float tags through real parameters. Typed intervals preserve promoted precision, boolean arithmetic and native runtime-versus-folded undefined behavior. Evaluated MUGEN logical undefined values no longer disappear into normal truth values. All 196 Node checks and focused root/Helper scenarios pass; final combined-browser/deployment gates are separate. Full query values, RNG timing, bottom/storage/compiler/native phases and controller parameters remain Pending. No controller is certified complete. See QUERY-NUMERIC-TYPES-WIP.md, INTERVAL-NUMERIC-WIP.md and LOGICAL-UNDEFINED-WIP.md.

## 0.25.48 — Typed math and numeric redirects (partial)

Exponentiation, unary and multi-argument math now have actual typed parameter consumers, native-profile overflow/promotion rules and caller-scoped argument evaluation. Recognized numeric redirects preserve selected actor tags through arithmetic instead of silently using JavaScript division. All 194 Node checks and eight exponent/eight expanded math actor scenarios pass; final regression and deployment are separate gates. Full undefined/query/constant-folding/native phases and all 163 controller certifications remain Pending. See EXPONENT-EXPRESSION-WIP.md and MATH-FUNCTION-TYPES-WIP.md.

## 0.25.47 — Bitwise and numeric query consumers (partial)

Actual expressions now execute ~, &, ^ and | with tested precedence, eager operands and engine-specific float handling. Selected native integer/float query tags survive enclosing arithmetic. Typed undefined arithmetic/comparisons and float modulo distinguish documented MUGEN from pinned Ikemen behavior; relational operators bind above equality. All 192 Node checks and both profile/player/root/Helper focused suites pass. Complete regression and deployment are verified separately. Full bottom/VM/query/constant-folding semantics and all 163 controller certifications remain Pending. See BITWISE-EXPRESSION-WIP.md.

## 0.25.46 — Conditional and logical expression consumers (partial)

IfElse evaluates both branches in native order; Cond selects one branch, with distinct redirected actor scopes while preserving script ownership. Selected supported int/float tags survive arithmetic. The real engine profile distinguishes normalized MUGEN results from pinned Ikemen CNS dynamic operand values; constant folds, cached ASTs and explicit grouping are covered. Logical XOR, its precedence, eager operands and assignment boundaries now execute instead of failing the lexer. All 191 Node tools and the focused actual root/Helper/controller cases pass; combined browser/deployment gates are recorded separately. No controller is certified complete. Full query/type/undefined/constant-folding semantics, ZSS, other operators, native phases and remaining parameters stay Pending. See CONDITIONAL-EXPRESSION-WIP.md, LOGICAL-PROFILES-WIP.md and LOGICAL-XOR-WIP.md.

## 0.25.45 — Reaction SelfState, animation and assignment consumers (partial)

Reaction SelfState now consumes numeric ctrl/anim/continue/readplayerid through the shared controller path, retains the recipient and executes the selected own/other program. Reaction animation headers evaluate once and retain omitted/-1 frames/age. The real parser/evaluator supports typed assignment to Var/SysVar/FVar/SysFVar, including caller-scoped redirected operands. Forty-four reaction cases, 56 root cases, Helper/Moon regressions and the complete combined browser suite pass. Required fixture metadata and native landing expectations are repaired without weakening runtime validation: all 189 Node checks pass. The separate legacy browser suite still has an unresolved Opponent/random-context fixture. No controller is certified complete; redirects/prefixes, full VM/undefined/version semantics, pause/negative/lifecycle phases and other parameters remain Pending. See REACTION-SELF-STATE-WIP.md, REACTION-ANIMATION-WIP.md and SEMANTIC-FIXTURE-CONTRACTS.md. Deployment is verified separately.

## 0.25.44 — Root current-body execution and feedback (partial)

P1 generic and P2 source/attack/locomotion state changes now execute incoming bodies in the same action, preserve old continuation schedules and advance each ending state once. Reaction transitions run the real incoming body instead of only preloading animation; the ending physics type applies its first gravity/friction update. Fifty-six root and twelve reaction cases, original Moon throws, Helper regressions and the complete Saturn browser suite provide partial evidence. ForceFeedback old/new APIs have real controller and browser motor consumers; physical hardware/remapping is not certified. Node checks pass 183/188 with five known failures; the separate legacy runtime suite still needs fixture/query updates and is not claimed passing. All 163 controllers remain uncertified. Full VM, redirects/provider ownership, pause/lifecycle/negative phases and other parameters remain Pending. See ROOT-CURRENT-BODY-WIP.md, REACTION-CURRENT-BODY-WIP.md and FORCE-FEEDBACK-WIP.md. Publication verification is recorded separately.

## 0.25.43 — Helper state-controller continuation (partial)

Helper ChangeState/SelfState consume continue with real old/new body ordering: immediate incoming body before the old tail, or eligible old-tail execution before a delayed header during hitpause/globals. Old body schedules survive nested changes and multiple tail instructions continue correctly. Thirty Helper cases, eight generic root entry/control checks, readplayerid and original Moon regressions pass. Root/special continuation, redirected stop behavior and complete VM/persistent/scheduler fidelity remain Pending; no controller is certified. See STATE-CONTINUE-WIP.md. Final browser/deployment gates are verified separately.

## 0.25.42 — General state transition phases and parameters (partial)

Helper current/same-state transitions execute the incoming Time=0 body in the same action; hitpause and global-phase changes use distinct real pending-header eligibility. Generic ChangeState/SelfState now sample numeric anim/ctrl before mutation and apply animation/control before the incoming header. SelfState readplayerid selects the requested actor's own table rather than a borrowed program. Twenty-two Helper transition cases, eight root entry/control checks and twenty read-ID cases pass; original Moon throws recover after actual legacy P2 idle-body dispatch is restored. RedirectID/continue/prefixes and complete VM/version/scheduler parity remain Pending; no controller is certified. See HELPER-GENERAL-STATE-WIP.md. Final regression/deployment gates are verified separately.

## 0.25.41 — Helper ordinary get-hit and recovery (partial)

Ordinary Helper contacts now execute imported common standing/air/fall/get-up programs with live hitshake, hit-time and down-recovery clocks. Eight actual cases include NoGetUpFromLieDown blocking/release; two simultaneous Helper landings dispatch independently. Common PlaySnd prefixes and HitFallDamage now reach real consumers, while the pinned legacy Helper ForceFeedback exclusion does not mask root/new-API output requirements. Broader KO/guard trajectories, native scheduling and complete audio/haptic/controller parity remain Pending; zero controllers are certified. See HELPER-ORDINARY-HIT-WIP.md. Full release gates/deployment are verified separately.

## 0.25.40 — Helper custom-hit recipient entry (partial)

Explicit HitDef P2StateNo contacts now enter real Helper recipient programs without requiring HitOverride, preserving old fields through hitpause before header execution. KeepState retains state/control while contact targets/counts still update. Sixteen actual spatial cases cover both slots, root/Helper sources and own/foreign snapshots, including live source pause/markers and Helper P1StateNo selection. Ordinary Helper get-hit, complete contact effects/resources, HitOverride phases and native scheduler parity remain Pending; no controller is certified. See HELPER-CUSTOM-HIT-WIP.md. Full release gates and deployment are verified separately.

## 0.25.39 — Helper own/foreign state programs (partial)

Helper TargetState now selects real own/foreign programs through deferred header initialization. Foreign P1StateNo sources retain their provider, Helper SelfState returns to its own table without altering its root, and own -2 HitDefs snapshot own-program metadata. Twelve live Helper cases and initial complete browser regression provide partial evidence. Native program identity/scaling, Helper custom-hit recipients, VM and scheduler parity remain Pending; all 163 controllers remain uncertified. See HELPER-FOREIGN-STATE-WIP.md and HELPER-TARGET-STATE-WIP.md. Final gates/deployment are verified separately.

## 0.25.38 — Root target selected-state initialization (partial)

P2StateNo and TargetState now defer real root headers through the recipient's pause, preserving old animation and velocity. Their distinct H/control selection rules have twelve actual profile/root/contact cases. Initial full browser regression, root-source checks and original Moon throws pass. Helper recipients, broader providers, general transitions and full native scheduling remain Pending; no controller is certified complete. See TARGET-STATE-CHANGE-WIP.md. Deployment is verified separately.

## 0.25.37 — Root selected-state and deferred initialization (partial)

P1/P2 P1StateNo sources now select metadata immediately but initialize their real headers after their own pauses, including reaction-origin P1 sources and post-combat execution. P2 no longer waits for P1's unrelated pause. Actual fixtures exercise incoming expression timing, Time=0, GetHit clocks, replacement, U/-1 retention, intrinsic defaults and old-cost/new-header separation. Browser regression and original Moon throws pass; Node checks pass 179/184 with five existing failures. Target/general transitions, persistent-index/-1 ordering, foreign helpers and complete native scheduler/ghvset remain Pending; all 163 controllers remain uncertified. See ROOT-STATE-CHANGE-WIP.md. Deployment is verified separately.

## 0.25.36 — Helper selected-state and deferred initialization (partial)

Helper P1StateNo now selects the state immediately but defers its real StateDef header through hitpause/global pause until a later eligible action. Old fields remain live; covered Mugen/Ikemen persistent timing, first-body Time=0, evaluated animation, U/-1 retention, replacement and intrinsic juggle reset have actual evidence. A real collision fixture distinguishes selection from header execution. Roots, target states, general hitpause transitions, exact index/provider/scaling and native scheduler completion remain Pending; all 163 controllers remain uncertified. See STATE-CHANGE-BUFFER-WIP.md. Deployment is verified separately.

## 0.25.35 — Native same-pass contact rejection (partial)

Already-hit P1StateNo sources and recipients already hit by a throw now reject prohibited same-pass contacts through real root, Helper, projectile-owner and reversal gates. Ordinary counter contacts, later passes and negative type-None contacts remain eligible; misses retain life, power, states, counters, effects and hit availability. Actual fixtures and full browser regression cover the two native rules. Contact fixtures explicitly isolate phase state without weakening expected results. Native deferred state selection, stchtmp/ghvset ordering and the unified action/collision scheduler remain Pending; all 163 controller rows remain uncertified. See HIT-CONTACT-PHASE-WIP.md. Deployment is verified separately.

## 0.25.34 — Custom contacts and live Target redirection (partial)

HitDefs with both custom StateNo parameters now use the normal root contact pipeline, retaining damage, power, pauses, facing, HitOnce, counts and juggle budgets. Target(id,index) uses live hit IDs and original caller arguments instead of stale throw pointers. Actual fixtures and original Moon throws in both root slots cover the consumers. Venus now imports archived DEF engine versions; StateDef animation expressions join the existing preload variants. Jupiter S1300 references absent original AIR actions and remains a documented failing source-asset diagnostic. Full native phases, Helper victims and broader VM/version parity remain Pending; all 163 controller rows remain uncertified. Deployment is verified separately.

## 0.25.33 — Native juggle cost and contact budgets (partial)

StateDef juggle expressions now feed real per-actor costs. Shared collision gates and accepted contacts use per-source budgets, player/projectile version rules, Helper inheritance and NoJuggleCheck; guarded/overridden contacts do not incorrectly debit cost. Source import, idle/pause reset, recovery and target-drop cleanup have executable coverage. Custom throws, exact same-frame/native phase ordering and broader version/query parity remain Pending. All 163 controllers remain uncertified. Deployment is verified separately.

## 0.25.32 — StateDef facing and turn consumers (partial)

FaceP2 now executes before velocity across actual P1/P2/reaction/Helper entry, with live assertions, selected/backup opponents, legacy distance truncation and native depth ties. Auto-turn shares target eligibility and preserves world velocity; hardcoded jump-state turning no longer replaces an omitted header. Import and browser fixtures exercise these consumers. Full StateDef/AssertSpecial/native scheduling parity remains Pending; all 163 controllers remain uncertified. Deployment is verified separately.

## 0.25.31 — StateDef priority, control and power phases (partial)

StateDef priority/control/power expressions now reach actual render order, input control and shared root power across P1/P2/reaction/Helper and Venus legacy paths. Priority precedes velocity; control/power follow animation, with power limits and round locking. Source-aware imports retain declared expressions and remove synthesized defaults; legacy control shims remain explicitly documented. Actual fixtures and full initial browser regression pass. Native layers, remaining StateDef fields and broader version/action semantics remain Pending; zero controllers are certified complete. Five existing harness setup failures remain documented. Deployment is verified separately.

## 0.25.30 — StateDef velocity expressions and entry consumers (partial)

Five importers preserve original StateDef velocity expressions instead of forcing numeric pairs. P1/P2/reaction/Helper entry evaluates XYZ sequentially before incoming control/animation, retains omitted axes and converts native units. Velocity queries use original caller units, with live per-component reads. Source comparisons, actual entry fixtures and browser regression cover these paths. Other StateDef fields/order, full expression and native/version semantics remain Pending; zero controllers are certified complete. Five existing harness setup failures remain documented. Deployment is verified separately.

## 0.25.29 — Shared XYZ movement coordinates (partial)

PosSet/Add and velocity controllers now share root/Helper XYZ coordinate bindings instead of splitting depth into a second dispatch. Foreign and own-program units, camera/ground origins and redirected facing/scales are preserved. TargetVelSet/Add use live coordinate bindings, including P1 depth and pinned cumulative target scaling; Helper fall writes use their own state provider. Actual fixtures also check single RedirectID sampling and non-actor exclusion. Bound-position phases, StateDef initialization and complete GetHit/native/version semantics remain Pending; zero controllers are certified complete. Deployment is verified separately.

## 0.25.28 — Original Velocity/Movement constants and velocity coordinates (partial)

All 85 Velocity/Movement Const names now read original root/Helper metadata with native jump inheritance, float32 values and caller units. Shared XY velocity controllers bridge borrowed-state and redirected recipient coordinates while preserving dimensionless multipliers and explicit own-program units. Original Size/motion defaults now scale to DEF localcoord before CNS overrides; guard defaults retain that scale. Source imports, actual 85-name/consumer fixtures and complete regression pass. All 138 builtin Const names have partial adapters, but native/version semantics and downstream consumers remain incomplete; zero controllers are certified complete. Deployment is verified separately.

## 0.25.27 — Size snapshots and typed numeric expressions (partial)

Five character importers/payloads now preserve original Size definitions. All 35 Size Const names have partial live evidence; Helpers retain independent Size snapshots and creation overrides, with actual collision, spark and drawing consumers. Projectile sprite scaling respects its spawning actor's scaling flag independently of collision scaling. Numeric literals retain integer/float types for supported arithmetic subtrees, correcting integer division, wrapping and float32 comparisons. Source-backed fixtures and browser regression are recorded in SIZE-DEFINITION-WIP.md and EXPRESSION-NUMERIC-TYPES-WIP.md. Broader consumers, expression typing and native/version compatibility remain Pending; zero controllers are certified complete. Deployment is verified separately.

## 0.25.26 — Original Data Const import and live queries (partial)

All eighteen Data Const names now read own-character original metadata for roots/Helpers, independently of foreign state units and live ModifyPlayer maxima/base changes. Five exporters/payloads preserve native defaults, life-dependent point defaults, blank persistence indices, integer-prefix bounds, volume transformations and reciprocal fall defence values. Only metadata was added to current payloads; existing runtime tuning remains intact. Actual source/payload comparisons, raw/browser fixtures and complete regression pass. Parser/platform/version parity and other original Data consumers remain Pending; zero controllers are certified complete. Deployment is verified separately.

## 0.25.25 — Custom Const import and reserved builtin inventory (partial)

The pinned Const compiler inventory now records 138 builtin names/aliases separately from open-ended custom names. Original first-section/first-key Constants imports feed live own-character root/Helper consumers, including foreign-state lookup, float32 numeric-prefix/sign-exponent behavior and JSON-safe nonfinite values. Missing custom names return native zero without masking unsupported reserved builtins. All five actual source builds, shared raw-CNS/browser fixtures and complete regression pass. Current characters have no custom entries and need no payload regeneration. Other builtin consumers, platform/parser extremes and version parity remain Pending; zero controllers are certified complete. Deployment is verified separately.

## 0.25.24 — Guard-distance Const ownership and global programs (partial)

Fourteen native guard-distance Const names/aliases now read actual root/Helper Size and convert to the original expression owner's units through redirection. Negative-state distance expressions use own-character program units even during borrowed states. P2 lifecycle dispatch retains its supplied context; root foreign states skip own -3, and Helper globals fetch own programs instead of the root's foreign provider. Actual foreign-unit/root/Helper/global fixtures and complete regression pass. Other Const families, full provider lifetime and cross-version/native scheduler parity remain Pending. Zero controllers are certified complete. Deployment is verified separately.

## 0.25.23 — Guard-distance source defaults and Helper snapshots (partial)

Normal/projectile guard distances now read all three Size axes with legacy/explicit width precedence. All five exporters preserve the distance fields; real source builds pass, and Venus regains two omitted scalar constants without replacing other tuning. Helpers snapshot parent Size distances at creation, retain them through state resets and pass them independently to child Helpers/projectiles. Foreign state providers no longer replace root Size defaults. Actual ownership/reset/spawn fixtures and complete regression pass. Parser dialects, coordinate/version parity, remaining Size and HitDef reset fields remain Pending. Zero controllers are certified complete. Deployment is verified separately.

## 0.25.22 — StateDef persistence import and entry consumers (partial)

All five character exporters preserve HitCountPersist, MoveHitPersist and HitDefPersist expressions. P1, P2, independent reaction and Helper entry paths evaluate them sequentially after incoming state/type initialization, without unconditional contact or HitDef clearing. Actual browser fixtures cover root/reaction idle and attack entries, live count/contact/HitDef retention and dependent resets; focused import and Helper tests also pass. Current character snapshots contain no explicit persistence fields, so no asset regeneration is needed. Foreign-state/version parity, full HitDef reset defaults and deferred entry remain Pending. Zero controllers are certified complete. Deployment is verified separately.

## 0.25.21 — Live HitAdd and native hit counters (partial)

HitAdd now changes real root/Helper counters through caller-evaluated Value/RedirectID, explicit target selection and native fallback rules. Live HitCount/UniqHitCount/ReceivedHits/ComboCount queries share contact/reset consumers; unique contacts remain distinct from NumHits, type None and projectiles. State-entry resets/persistence and int32 arithmetic were corrected without replacing custom report scoring. Root SOCD reset also clears only that side's Helper histories. Actual fixtures and full regression cover these paths. Full native phase/version/override coverage, persistence imports, Simul/Tag and native combo HUD rendering remain Pending. Zero controllers are certified complete. Deployment is verified separately.

## 0.25.20 — State -4 execution and import selection (partial)

Roots and Helpers now execute available State -4 controllers before global-pause gating; ordinary state execution stays paused and hitpause still filters controllers. Active Helper -4 execution follows the existing per-frame preparation. All five character builder selection paths include -4/-3/-2 and preserve source order and controller settings. Existing source snapshots have no -4, so no character payload regeneration is needed. Semantic/import fixtures and actual pause/resume regression cover these changes. Full preparation/creation timing, raw-source dialects, provider/deferred-state/global ordering and all-controller/version completion remain Pending. Zero controllers are certified complete. Deployment is verified separately.

## 0.25.19 — Helper input ownership and negative states (partial)

Helper keyctrl now evaluates integer permission enums and gates command access. Enabled Helpers own separate command buffers, facing and input modifiers instead of borrowing root command results; destruction/input reset cleans storage. Eligible -3/-2/-1 controllers execute before current state with player-type/ownership checks and hitpause rules. Actual fixtures cover isolation, command recognition, release, cleanup, execution order and global persistence. State -4/global pause, full numeric provider/deferred-state identity, other key-control behavior, AI/common movement and all-controller/version parity remain Pending. No controller is certified complete. Deployment is verified separately.

## 0.25.18 — Root ShiftInput and configured SOCD (partial)

ShiftInput now remaps physical root command keys after AssertInput, supports disabling/replacement and simultaneous non-chaining swaps, and preserves pinned redirected caller-reset behavior. Configured SOCD supports allow-both, first/last, U/F priority and neutral policies with independent histories. Existing default controls remain unchanged pending native configuration migration. Actual command-buffer composition and full regression cover these paths. Helper ownership, default/raw-input parity, action/pause phases, replay/network input and all-controller/version completion remain Pending. No controller is certified complete. Deployment is verified separately.

## 0.25.17 — Root AssertInput and reproducible inventory (partial)

P1/P2 AssertInput now validates flag–flag8, evaluates RedirectID, resolves physical facing on the recipient and injects one-use keys into real command buffers. Runtime fixtures trigger a real command and verify release; input reset clears pending assertions. Reversal override misses clear stale MoveHitVar(overridden). The pinned compiler inventory now records literal key bindings and finite loops, recovering AssertInput flag2–flag8: 163 controllers, 2,165 candidates, 597 distinct names and nine extraction follow-ups. Saved inventory equals regeneration in executable tests. Helper input ownership, SOCD, native input/action/pause timing and broad controller/version completion remain Pending. Zero controllers are certified complete. Deployment is verified separately.

## 0.25.16 — Reversal target order and override misses (partial)

Automatic reversal contacts now prioritize reversal recipients, then use absolute float32 X or enabled X/Z distance and actor-ID ties. Matching HitOverride default state-change misses and explicit MissOnOverride reject contact without applying state/resource effects. Actual runtime fixtures and full regression cover both changes. Updated resource/runtime import URLs prevent reuse of earlier cached module versions. Native eligibility/action phase ordering, local-coordinate arithmetic, non-miss override execution, foreign Helper tables, combo counting and all-controller/version completion remain Pending. No controller is certified complete. Deployment is verified separately.

## 0.25.15 — Automatic ReversalDef contact (partial)

Root and idle Helper ReversalDef controllers now dispatch attack-box contacts through attribute/depth/chain filters and reciprocal arbitration, without ordinary damage. Accepted contacts bind state changes, priority, source-only power, selective recipient reset, pauses and P2Facing; per-definition/actor/tick decisions suppress duplicate contact. Pending native resource queues survive selective reset and consume once. Actual root, idle Helper and simultaneous reciprocal fixtures cover these paths. Full native phase/state ordering, HitOverride combinations, foreign Helper tables, combo counting, complete visual/sound dispatch and cross-version fidelity remain Pending. No controller is certified complete. Deployment is verified separately.

## 0.25.14 — Definition-time state provider snapshot (partial)

HitDef compilation now snapshots the original state-provider table and foreign-state distinction. Root target/source entry uses that snapshot even after the source changes providers; same-character foreign state remains distinct and normal Helpers keep their own provider. Runtime fixtures execute a state absent from the actor's body table on both recipients and sources. Full numeric native statePN identity, projectile global-controller workingState, foreign Helper tables, animation persistence, complete scheduler/version semantics and ReversalDef dispatch remain Pending. No controller is certified complete. Deployment is verified separately.

## 0.25.13 — Hit state ownership and source transitions (partial)

Shared HitDef compilation now evaluates P1StateNo/P2StateNo/P2GetP1State with native implicit source-owner defaults. Root contacts respect explicit own/source tables, nonnegative target states and KeepState; explicit target state entry forces H/control false. Standalone source state changes run after root/Helper contacts and select projectile owners. Actual fixtures cover both root callbacks, spawned Helper hits, ownership and control. Legacy paired-throw damage/effects, native statePN snapshots, foreign Helper tables, complete phase/version semantics and ReversalDef dispatch remain Pending. No controller is certified complete. Deployment is verified separately.

## 0.25.12 — Hitflag and independent hit status (partial)

Ordinary collision now consumes S/C/A/L, F and plus/minus hitflag rules, exact native guard-state ranges and source NoFallHitFlag. Explicit D can reach lying-target geometry. Independent root/Helper hit-status storage preserves same-pass snapshots, hitpause-held recovery and selective reversal -1; round reset and DestroySelf clean up entries. Focused and actual imported-animation/runtime fixtures cover these paths. Complete native phase placement, general Helper collision routing and all-controller/version certification remain Pending. Deployment is verified separately.

## 0.25.11 — Shared cornerpush and parameter defaults (partial)

P1/P2/Helper movement now shares source-aware cornerpush calculation and float32 decay with native logical-width stopping thresholds. Player-type Helper HitOverride contacts update real source storage; projectile sources and ordinary Helper recipients are excluded. All ten offset/multiplier expressions compile once with pinned legacy/modern defaults, ground inheritance and native cornerpush-parameter order. Runtime fixtures cover screen-bound/SuperPause gates, logical-width changes and source ownership. Native general Helper collisions, complete scheduler/coordinates, cross-parameter order and Mugen version behavior remain Pending; no controller is certified complete. Deployment is verified separately.

## 0.25.10 — Live Helper cornerpush (partial)

Helper-to-root physical contacts now retain source cornerpush velocity and multiplier. Helper movement consumes shared target selection, corner confinement and friction; MoveHitVar queries read the live decaying value. Actual runtime tests cover NoCornerPush, projectile exclusion and spawned Helper stepping under PosFreeze. Signed queue-accumulation boundaries and float-before-negation are additionally tested. Root migration, Helper-to-Helper contact, complete phase/version/coordinate parity and all-controller certification remain Pending. Deployment is verified separately. The user has cancelled the previous 20% pause policy.

## 0.25.09 — Native hit-resource queue (partial, conditional-pause release)

The explicit Ikemen engine profile now shares one deferred resource queue between accepted contacts and GetHitVarSet. Actual Helper stepping and P1/P2 reaction CNS tests rewrite pending 20 damage to 5 and consume only 5 once; red-life/point consumption, field clearing and live HitOverride/KeepState gating are tested. Extracted native life-add execution avoids changing GetHitVar kill merely to consume queued damage. Pinned GetHitVarSet name audit covers 48 names, not complete semantics. Default Mugen WEB resource effects remain unchanged; all-profile migration, complete per-actor phase ordering, reversal integration and numeric/version edge cases remain Pending. No controller certification is added. User requested one final verified release after account remaining reached 20%, then pause.

## 0.25.08 — Complete ModifyPlayer name coverage, partial semantics

All 22 pinned ModifyPlayer parameter names now reach explicit partial runtime consumers; zero are certified complete. Added player-owned AI float/integer queries, character/Helper display metadata and explicit HUD labels, independent Alive/KO status and round decisions, team-aware hit eligibility with activation-side snapshots, root enemy roster and player-type Helper P2 selection. Indexed Enemy/EnemyNear evaluates caller indices and selected-target expressions. Actual runtime regressions cover these paths; unsupported unknown parameters still fail. Full native cache/backup, P2/body-distance queries, actionPrepare/actionFinish timing, lifebar configuration, persistence, Simul/Tag/PowerShare and cross-version parity remain Pending. Deployment is verified separately.

## 0.25.07 — ModifyPlayer live consumers (partial)

Added explicit partial ModifyPlayer dispatch: redirectid, resource maxima, Helper ID, typed contacts/counter flag, hitpause/invulnerability, attack/defence bases and pause movement allowances now reach live consumers and runtime queries. Actual browser regressions cover helper/root isolation, subsequent PowerSet clamping, NumHelper lookup, contact persistence, damage/point scaling and independent Pause/SuperPause permissions. Complete pinned parameter-name inventory: 22 names, 16 partial hooks, six unsupported, zero certified. Remaining parameter implementations, native phase/version/persistence and full single-counter hitpause behavior remain Pending. Unsupported parameters fail explicitly. Deployment is verified separately.

## 0.25.06 — Contact invulnerability and reversal spark data (partial)

Shared compilation consumes unhittabletime expressions with pinned missing-component, throw-mask and reversal defaults. Independent actor timers gate actual collision preconditions; accepted regular contacts and the staged reversal recipient callback write their respective timers. Runtime tests cover helper/root isolation, expiry, guard/KeepState/type-None exclusions and negative/zero writes. Reversal spark data follows pinned enemy-Y inheritance and selective-reset ordering. Native phase/version timing, same-pass ghvset state-change export, visual reversal dispatch and complete controller/parameter certification remain Pending. Deployment is verified separately.

## 0.25.05 — Hitpause finalization and MoveHitVar consumers (partial)

Hitpause pairs and canonical reversal fall data now compile from caller expressions; reversal pause adapters use imported version arrays and independent collision-phase flags. MoveHitVar identity/frame, source-only pending power, regular source spark offsets, live root cornerpush and committed-definition target counts have actual browser regressions. Corrected engine-wide power profiles and separate receiver/source commit lanes. All ten native MoveHitVar names have dispatch hooks, not full semantic certification; helper cornerpush, reversal/projectile sparks, full ownership/phase/version behavior and complete ReversalDef dispatch remain Pending. Final release regression passed with terminal exit 0; deployment is verified separately.

## 0.25.04 — Reversal recipient data and contact clocks (partial)

Root/helper reversal recipient adapters now neutralize the active victim HitDef and write selective source/fall data without ordinary damage/state/velocity changes. Typed MoveReversed contact clocks have actual query/pause/persistence tests and full-driver phase coverage. Corrected independent P2 source hitpause countdown/freeze; isolated a BGPalFX pixel fixture from an unrelated foreground Explod without relaxing assertions. Native complete counter eligibility, canonical ReversalDef finalization/dispatch, MoveHitVar and full scheduler/version parity remain Pending. Final release regression passed with terminal exit 0; no full controller certification is claimed.

## 0.25.03 — Chain eligibility and reversal groundwork (partial)

Shared HitDef ID/chain/nochain compilation and collision preconditions now use source identity, ordered targetedBy and activation-specific target records. Reversal geometry reads actual transformed animation attack boxes, evaluates attack depth and IgnoreReversalDef, and has an actual reciprocal-priority adapter with per-tick flags. Focused and browser regressions cover these components; live ReversalDef controller dispatch and complete counter eligibility are still not enabled. Added an incremental parameter evidence ledger with zero fully certified parameters. Full scheduler/version, juggle inheritance/cleanup and all-controller completion remain Pending. Final release regression passed with terminal exit 0; deployment is verified separately.

## 0.25.02 — Contact power and explicit score (partial)

Live contact now routes attacker/recipient power to stable root/helper owners with immediate Mugen and tick-delayed Ikemen profiles; real resource-adapter timing and helper-owned projectile tests pass. Explicit score expressions reach shared contact, independent NoScore/player-type gates, query storage and reaction/hitpause/dizzy-aware reset without duplicate native credits or changing custom bonuses. All 89 native GetHitVar names have dispatch hooks, not full semantic certification. Native scheduler/ownership/version parity, full damage calculation and all-controller certification remain Pending. Final release regression passed with terminal exit 0; publishing is verified separately.

## 0.25.01 — Spark geometry and hit information (partial)

Shared source/contact/render geometry now records recipient-relative spark queries. Fixed arithmetic pair misclassification and repeated facing/state expression reads. HitDef getpower/givepower compile using raw damage, caller constants and component defaults; informational hit/guard damage and power reach real contact, accumulation, keepstate and finish reset. Actual browser fixtures passed complete regression before final release preparation. Query-name audit has 89 names, with power and score still absent. Deferred power, native damage parity, full scheduler/version semantics and all-controller certification remain Pending.

## 0.25.00 — Hit frames and independent keepstate (partial)

GetHitVar.frame now reaches real contact/finish-phase and pause paths. HitDef.keepstate has independent root/helper state application and prior-data preservation, separate from HitOverride; actual P1/P2 callbacks and Helper collision fixtures pass full regression. Corrected HitOverride native D/F masks and idle P1 fallback ownership. Query-name inventory has 89 native names and eight absent dispatches; all full-controller certifications remain Pending. Full native scheduler, deferred damage/points, throw/override/version semantics and remaining parameters remain unfinished.

## 0.24.99 — Hit contact metadata and live adapter (partial)

Priority/KO-permission expressions, reaction/type metadata, deprecated query aliases, KO velocity deltas and NoKO/NoGuardKO now have actual source/contact/query regressions. Fixed the live entity-hit adapter dropping projectile/helper identity and scale; a full callback and real simStep recipient trajectory verifies life/state changes and retained metadata. Executable pinned GetHitVar name audit covers 89 names with 10 missing dispatches; recognized hooks are not semantic certification. Full keepstate, damage ledgers, camera/ownership/version semantics and all-controller completion remain Pending.

## 0.24.98 — Explicit parameter profiles and velocity queries (partial)

Actual contact records all fifteen ground/air/down/guard/airguard velocity-axis queries with facing and recipient/original-expression scaling. Explicit documented metadata profiles forward HitDef fall shake diradd/decay and separate GetHitVarSet hitcount from hittime; default pinned behavior remains unchanged. Actual source/contact/query/XY-step and clock fixtures pass full regression. These specific profiles are not all-version certification; full resets, deferred damage ledgers, ownership, camera projection and remaining controllers/parameters stay Pending.

## 0.24.97 — Shake presentation and hit identity (partial)

EnvShake/FallEnvShake share real XY presentation with native direction, diradd, decay, cycle multiplier, defaults and last-frame clocks. HitDef fall-shake expression/scaling consumers, guardflag queries and root/helper/projectile source identities have actual source/contact/renderer regressions. Explicit Ikemen compatibility consumes guarded shake reset and logical-width fall-Y defaults without changing the legacy profile. Native HitDef omits diradd/decay copies; those accepted parameters are not falsely counted as fully integrated. Camera projection, full reset/damage ledgers and complete controller/version parity remain Pending.

## 0.24.96 — GetHitVarSet and query consumers (partial)

Shared GetHitVarSet dispatch now writes native typed/scaled fields; the pinned compiler's 48 parameter names match the dispatcher inventory, which is not semantic certification. Actual root/helper fallback storage, scalar/attr queries, mixed-localcoord redirected write/query roundtrips and source velocity/friction consumers pass complete regression. Preserves pinned hitcount-to-hittime compiler alias, original expression owner through redirection, fall undefined sentinel and native attribute string/mask comparisons. Idle clock ownership, shake presentation, resets/version profiles and full controller parity remain Pending.

## 0.24.95 — Hit acceleration and friction (partial)

Shared HitDef source compilation and contact now consume XYZ acceleration and standing/crouching friction. Explicit logical game width drives acceleration defaults and root/helper standing cutoffs, independently of video resolution. Root/helper friction, GetHitVar and source velocity consumers have real contact/physics/hitpause fixtures with complete browser regression. Full aspect metadata export/import, GetHitVarSet, selective reset/persistence, ownership/version semantics and complete controller coverage remain Pending; this is not full certification.

## 0.24.94 — HitDef component defaults (partial)

Shared root/helper/projectile HitDef compilation now finalizes all three velocity axes with per-component guard/airguard/down inheritance and one caller-expression evaluation per supplied component. Pinned Ikemen ground.velocity n grammar and zero initialization are covered by actual compilation/contact fixtures and full regression. Original Mugen n semantics, inherited HitDef persistence, fall defaults and broader native compiler/GetHit ownership remain unfinished; this is not full HitDef/controller certification.

## 0.24.93 — HitDef Z and shared fall controllers (partial)

Guard/down vectors accept Z with native fallback factors; shared hit resolution records recipient-local Z/fall-Z velocities. Root/helper HitFallSet/HitFallVel now share target ownership, redirection and velocity dispatch, including actual source fall states. Focused and real contact/source regressions pass. The pinned compiler omits HitFallSet.zvel despite a bytecode enum; unsupported source Z is not falsely certified. Broader XY/source-coordinate conventions, full component defaults/expression handling, KO/depth clocks and native compiler/version behavior remain pending; no full controller certification is asserted.

## 0.24.92 — Z movement execution (partial)

Position/velocity controllers now consume Z through persistent root/helper bindings and redirected coordinate conversion. Real battle ticks execute Z velocity/friction, PosFreeze and hitpause gates, including the final paused frame and non-fight rounds. Fixed the normal-fight root DepthBound call-site omission. Local-unit Z expression parsing/contexts and helper source/redirection fixtures pass with full regression. Binding old-position semantics, source-state coordinate ownership, full hit Z velocities, depth movement/rendering and complete native compiler/version behavior remain pending; no full controller certification is asserted.


## 0.24.91 — Depth / DepthBound execution (partial)

Shared root/helper Depth writes independent player/edge modifiers with native precedence, empty declaration suppression, redirected units and pause resets. Projectile-to-character depth uses those fields. DepthBound gates actual Z edge clamps and stage bounds; movecamera feeds root/helper range tracking, native-style Z offset smoothing and live screen/stage projection. Actual source/contact/bound/reset/camera fixtures and full regressions pass. Complete Z physics/rendering, character HitDef depth, push/overlap consumers, camera zoom coupling and compiler/version fidelity remain unfinished; full certification remains pending.

## 0.24.90 — Projectile geometry and cancellation (partial)

Projectile collision scale/angle are source-evaluated and independent of sprite scale/root modifiers. Separate Clsn2 SAT trading consumes priority points/hits, applies survivor hitpause, sorts by distance/ID and obeys native mixed team rules. Stage-enabled depth uses attack.depth and world-coordinate conversion; zero-hit projectiles trade without damaging characters. Actual source/geometry/priority/team/depth fixtures and full Saturn regressions pass. Projectile-to-character depth, owner destruction, full Z simulation, paused timing, ModifyProjectile and other native parameters remain incomplete; no full controller certification is asserted.

## 0.24.89 — Character collision coordinates (partial)

Five character artifacts now preserve verified source localcoord metadata. Runtime collision geometry bridges character/animation-source units into the 1280-wide WEB world, scales base boxes before absolute overrides, supports helper ownclsnscale, and keeps Size/pivot conversion independent. Actual mixed-coordinate, redirected-unit and debug-canvas fixtures plus complete regressions pass. Exporters retain coordinates and full SizeBox tuples. Helper foreign-animation ownership, noncollision state coordinates, projectile geometry/proxies and exhaustive compiler/precision behavior remain unfinished; all-controller certification remains pending.

## 0.24.88 — Collision overrides and rotated contacts (partial)

OverrideClsn/TransformClsn now execute through shared root/helper dispatch. Ordered overrides delete/replace/append boxes; transforms apply signed cumulative scale and last angle/pivot. Actual attack and target groups use facing-aware rotated SAT contacts, with independent group/index filters. Root/helper reset fixtures verify hitpause clearing and global-pause retention. Focused semantic/geometry tests and complete Saturn regression pass. Native scale/source metadata, proxies, other collision consumers and exhaustive compiler/precision behavior remain pending; no controller is newly certified complete.

## 0.24.87 — Target collision groups and Height (partial)

Actual contacts now select Clsn1/Clsn2/Size/Dummy/None with presence requirements and group-specific HitBy filters. Size geometry uses native legacy/explicit boxes and signed Width/Height additions; Dummy has no invented base box. Shared root/helper Height dispatch supports caller expressions, recipient redirection and localcoord ratios. Actual fixtures verify expanded Size contacts, ordinary resets and hitpause/global-pause retention; focused tests and full Saturn regression pass. Native collision overrides/proxies, source-localcoord export, exhaustive timing/compiler behavior and ReversalDef integration remain unfinished. All 163 certification rows remain Pending; this release does not claim complete controller coverage.

## 0.24.86 — Coverage accounting checkpoint

Documentation/checkpoint release; gameplay implementation is unchanged from 0.24.85. The current inventory lists 163 controllers and 2,158 controller/parameter candidates (597 distinct parameter names). All 163 controller certification rows remain Pending: this does not mean all controllers are unimplemented. No per-parameter completion ledger exists yet, so the exact unfinished parameter count and a defensible overall completion percentage are unknown. Dynamic/delegated extraction remains incomplete. See Docs/CONTROLLER-STATUS.md. Work pauses after this requested additional release is verified.

## 0.24.85 — HitBy/NotHitBy actual slots and collision (partial)

Shared root/helper dispatch now writes independent native-style slots and consumes stack, player number/instance ID and per-Clsn2 index filters. Mugen actual attacker state, Ikemen HitDef state and projectile exception are covered by actual collision fixtures. NotHitBy uses state/attack OR; HitBy uses AND. Slot redirection, expiry, box selection and full Saturn regression tests pass. HitOverride ForceAir guard ordering, forced-guard kill ownership and helper-local defense were also corrected. Other box groups, mixed syntax/compiler diagnostics, exact timers, full Helper hit bookkeeping and signed type-None/KO semantics remain unfinished; all-controller certification remains pending. User-requested pause follows verified publication once allowance reaches 20% remaining.

## 0.24.84 — HitOverride root/helper execution (partial)

Eight slots, native attribute bitmasks/aggregate and multi-attack tokens, caller redirection, missonoverride/custom-state exclusion and Mugen versus Ikemen hitpause clocks now drive actual root/helper contacts. Root own-state, forceair/forceguard and keepstate preserve damage/GetHitVars; helper contacts apply isolated life/GetHitVars/hitpause and HitOnce acceptance. Entity keepstate preserves the existing HitDef; overridden custom states cannot overwrite defender ownership. Actual contact/ownership/timer and full Saturn regression tests pass. Helper attacker counters/power/score, normal helper hits, negative state/type-None/KO, compiler-mode propagation and exact native timing remain incomplete. This is not full HitOverride or all-controller certification.

## 0.24.83 — Native-like palette blend passes

Palette blend branches now use separate per-pass shader sources for invert-add/disable-neg and SubAdd gray/color processing. Each pass clamps source channels before blending and writes an 8-bit intermediate, matching direct WebGL reference cases. Actual branch pixels and full regressions pass. Native dithering/MSAA/indexed shader and exhaustive backend precision remain uncertified; complete controller/parameter goal remains active.

## 0.24.82 — Selected background palette rendering

BGPalFX id/index now target actual ordered background entries and render independently before/after actors. Stage configs can load compressed static sprite entries without inventing IDs for existing 3D geometry. Per-BG clocks obey Pause/SuperPause pausebg last-writer flags; global palettes remain independent. Actual selection/expiry pixel and pause regressions pass. Full native stage export/animation/parallax/tiling, palette remap/indexed shader and complete pause/compiler certification remain pending.

## 0.24.81 — Global/background palette execution

AllPalFX and global BGPalFX now execute independent clocks and actual stage/filter/sprite composition. Actor/global palette stacking retains native raw/effective inversion flags and Sub arithmetic. Removed helper BGPalFX brightness-only handling. Actual paused clocks, global grayscale and background-only blackening regressions pass. Selected BGPalFX id/index rendering remains explicitly unsupported; indexed shaders, inversion edge cases and full native certification remain pending.

## 0.24.80 — PalFX actor rendering

PalFX parameters, actor timers, root/helper ownership and shader-order RGBA adjustment now affect live sprite composition. Shared palette runtime survives parent helper removal; independent helpers allocate their own effect. Actual grayscale pixels, root redirection/expiry/hitpause and helper ownership regressions pass. Fixed normal/flipped root branches that omitted AIR/PalFX metadata; Trans Mugen Sub alpha locking and optimized composition are included. AllPalFX/BGPalFX, palette remaps/indexed shaders, inversion edge cases and full native certification remain pending.

## 0.24.79 — Trans real stage composition

Active root/helper/AfterImage Trans now presents an ordered stage-backed frame instead of relying on whole-layer opacity. Native add/sub/SubAdd pass coefficients, AIR Default precedence, reflection intensity, recorded transforms and cropped pixel regions execute. Actual controller/helper/reset/pixel/stage/presentation regressions pass. Palette shader effects, compiler/version metadata, AIR interpolation, helper reflections, precision/performance and complete native certification remain pending.

## 0.24.78 — Correct Offset hitpause reset

Pinned Mugen 1.1/Ikemen reset timing also resets Offset during hitpause. Root/helper paths and actual regressions now match this, correcting the .77 retention claim. WinMugen version metadata remains pending. Trans parameter and blend/compositor policies are tested foundations, not a completed controller or game rendering integration.

## 0.24.77 — Offset drawing execution

Offset X/Y/redirection now write root/helper drawing coordinates without physical movement or facing inversion. Ordinary reset retains hitpause. Root pixel tests, helper source controllers and afterimage snapshot tests pass; root reflections use the pinned vertical scale formula. Native helper reflections, stage ground-level/ydelta, size offsets, interpolation and compiler/version certification remain pending.

## 0.24.76 — PosFreeze execution

PosFreeze now evaluates optional value/redirection through shared root/helper dispatch. Velocity movement freezes without suppressing gravity/friction, explicit setters, bindings or cornerpush. Actual root/helper hitpause/reset/redirect/setter/binding/cornerpush regressions pass. Helper source PlayerPush now uses shared priority/team handling. Native oldPos/interpolation/camera prediction and full compatibility certification remain pending.

## 0.24.75 — PlayerPush priority and helper participation

PlayerPush now evaluates value/priority/affectteam/redirection, replacing the old root disable controller. Root/helper team filtering and priority shares affect actual ground push; normal helpers can explicitly enable pushing. Per-tick state resets retain hitpause. Actual redirected root/helper enemy/friend/disable fixtures pass; full native aerial boxes, weights, corner compensation and timing remain partial.

## 0.24.74 — ScreenBound execution

ScreenBound now evaluates value/movecamera/stagebound/redirection and replaces the no-op branch. Screen/stage limits are independent; horizontal/vertical camera tracking excludes actors per axis. Root/helper defaults reset on ordinary ticks and retain hitpause. Actual bounds/redirection/camera-axis/helper/reset regressions pass. Complete native camera/zoom/team/localcoord and player-helper certification remain partial.

## 0.24.73 — Width real modifiers

Width now evaluates edge/player/value/redirectid with native precedence and float32 scaling, replacing the no-op branch. Additive player modifiers affect root push/compensation; signed edge modifiers affect facing-aware screen bounds. Root/helper modifiers retain hitpause and reset on ordinary ticks. Actual push/edge/redirection/helper/reset regressions pass. Full character base boxes/helper collision/native localcoord and timing certification remain partial.

## 0.24.72 — BindToRoot / BindToParent execution

Both controllers now resolve live root/nested-parent ownership with caller XYZ/time/facing/redirection, replacing the old helper-only timer branch. Ordinary binds retain world velocity, support indefinite duration and own-actor pause, clear immediately at expiry and reset facing. Actual nested-helper, root redirection, pause/resume and expiry fixtures pass. Full native shared-binding identity/scales/physics and version certification remain partial.

## 0.24.71 — BindToTarget live positioning

BindToTarget now evaluates caller ID/index/time/pos/posz/redirection, moves live root/helper callers relative to their first target and registers reciprocal TargetBind. Head/mid/foot, default untouched Y/Z and caller expressions are handled; actual root/head/mid/redirection/helper fixtures pass. Complete native localcoord/depth metadata and already-bound distance parity remain partial.

## 0.24.70 — TargetBind real-target lifecycle

TargetBind now selects real target ID/index with caller time/XYZ/redirection and float32 scaling instead of the old throw-only path. Roots/helpers follow live owners with velocity synchronization, indefinite/paused/deferred timing, mutual-binding prevention, TargetDrop and finite-hit/missing-owner release. Actual root/helper entry, query and source-throw plumbing fixtures are included. Complete native timing, buffered hit identities and full character/helper trajectories remain partial.

## 0.24.69 — ScoreAdd redirection and native execution

ScoreAdd now evaluates caller float32 value and redirectid, respects NoScore, and uses native per-round float32 accumulation rather than the old unrestricted direct write. Normal helpers remain eligible, unlike TargetScoreAdd. Actual redirected roots and normal-helper fixtures cover variable evaluation and exclusion. Full team score lifecycle/queries and compiler/version certification remain partial.

## 0.24.68 — TargetScoreAdd execution

TargetScoreAdd now selects real targets with caller value/ID/index/redirection, uses float32 per-round score accumulation, and respects player-helper eligibility and NoScore. Dedicated actual root/helper fixtures cover ownership, fractional scores and exclusion. Existing game scoring remains unchanged. Complete team score lifecycle/queries and compiler/version certification remain partial.

## 0.24.67 — TargetRedLifeAdd execution

TargetRedLifeAdd selects real target ID/index with caller value/absolute/redirection, preserves native signed damage calculation and caller-MUGEN healing compatibility, and writes clamped red-life resources. Actual root/redirection/assertion fixtures pass; disabled/round gate fixtures are included. Native alive, helper/teams, version ownership and compiler certification remain partial.

## 0.24.66 — Target dizzy / guard point controllers

TargetDizzyPointsAdd and TargetGuardPointsAdd now select real targets and apply caller value/absolute/id/index/redirection with native defence, signed rounding and nonlethal limits. Actual root writes, dizzy exclusion, feature/round gates, damage assertions and redirected caller expressions have dedicated fixtures. Full helper/version/compiler certification remains pending.

## 0.24.65 — TargetPowerAdd execution

TargetPowerAdd now evaluates caller target ID/index/value/redirection and writes eligible roots/player-helper power owners with limits and round locking. Actual root/helper, custom-state PowerMax ownership and simultaneous-super regressions pass. Team sharing/global maximum-power integration, exact native lock timing and full helper lifecycle remain partial.

## 0.24.64 — DizzySet / GuardBreakSet live flags

Both controllers now evaluate caller booleans/redirection and mutate persistent root/helper flags, with Dizzy/GuardBreak queries reading live storage. State changes preserve flags, round initialization clears roots and TargetLifeAdd skips dizzy-point damage while the victim is dizzy. Actual root/helper redirection, independent queries and resource-exclusion browser fixtures pass. Missing required value fails explicitly. Full common-state/system-flag lifecycle, compiler-time validation and version parity remain partial.

## 0.24.63 — TargetLifeAdd resource execution

TargetLifeAdd now writes actual root/helper resource adapters using native defence/absolute/nonlethal/healing calculation with attack multiplier 1. Life, received damage, getHit.kill, enabled red life and dizzy resources honor their respective gates; normal/hyper conversion uses pinned float32 defaults and owner overrides. Actual P1/P2 resource, hyper, flag and nonlethal browser regressions pass. Complete native alive/finalDefense ownership, dizzy lifecycle, helper victims, buffered IDs and version parity remain partial.

## 0.24.62 — TargetState execution

TargetState now evaluates caller id/index/value/redirectid against real target lists and uses the redirected owner's current state character, with own-character selection for minus -2/-4. Root custom state transfers preserve hit data and initial victim animation ownership; P1 reaction and general source-state paths are covered. Actual root/filter/redirection/control/ownership browser regressions pass. Native queued transitions, full helper ownership/victims, invalid-state behavior and version parity remain partial.

## 0.24.61 — TargetVelSet / TargetVelAdd execution

Target velocity controllers now evaluate caller id/index/redirectid and float axis expressions, select real targets and write P1/P2/helper velocity adapters. X uses native target-facing-relative direction; P1 reaction globals synchronize correctly and non-reaction root set/add preserves the expected world direction. Policy tests cover omitted axes, evaluation order, redirection, native cumulative scaling and Z arithmetic; actual root browser regressions pass. Full local-scale metadata, root depth simulation, helper-victim collision ownership and version parity remain partial.

## 0.24.60 — TargetFacing execution

TargetFacing evaluates caller id/index/value/redirectid and selects the true target list, including native early-stop index selection. P1/P2 facing changes preserve nonzero world velocity, including P1 outside a reaction. Root contact/filter/redirection browser fixtures and policy tests cover executed paths. Full actor/target ownership, helper-victim collision integration, native target buffers and exact version parity remain partial.

## 0.24.59 — Real targets, NumTarget and TargetDrop

Accepted root/helper/projectile-owner contacts and paired throws now record real per-actor targets. NumTarget reads live hit IDs; recovered targets and destroyed helper owners are cleaned up, with round resets clearing all lists. TargetDrop executes caller expressions/redirection and native ID/keepone selection, including matching Snap/legacy throw release. Root/helper browser fixtures and policy tests cover the executed paths. Native target buffers, GetHitVar ID/drop bookkeeping, exact state-change/reversal timing and full multi-target release remain partial.

## 0.24.58 — HitDef position offsets and Snap binding

Caller Snap/MinDist/MaxDist values now drive queued root position offsets and GetHitVar offset queries. Temporal Snap follows live root/helper binders, freezes with binder pause and expires; positive-time binder-hit release returns the victim to its own 5050. Tests cover both victim directions, one-time offsets, live-facing binding and release. Native per-actor timing, target lists, local scales, version argument differences and helper victims remain partial.

## 0.24.57 — HitOnce activation consumption

Accepted root/helper hit and guard contacts consume explicit hitonce activations; caller boolean expressions and throw defaults execute. Explicit zero remains available and projectile hit budgets are unchanged. Helper HitDef trigger/persistence execution now creates a fresh activation. Actual root/helper tests and full browser regressions pass. Target-drop, buffered target timing, overrides/reversals and multi-target parity remain partial.

## 0.24.56 — Attacker HitDef facing execution

Caller-evaluated p1facing/p1getp2facing now control root/helper contact facing, including inherited-facing precedence. Received velocity uses effective contact direction; root/helper world velocity is preserved. Projectile attacker turns and guarded turns are excluded. Dedicated root/helper/projectile browser fixtures and unit tests cover these paths. Deferred timing, reversal/type-None, throws and full native parity remain partial.

## 0.24.55 — HitDef victim facing execution

Normal root/entity victim hit paths now apply caller-evaluated p2facing signs, preserving facing on zero or guard contacts and world velocity on a flip. Browser tests cover both root directions and guarded exclusion; existing counter/combat regressions are retained. Native deferred timing, p1-facing combinations and custom/throw/helper-victim ownership remain partial.

## 0.24.54 — Fall recovery eligibility execution

fall.recover/recovertime now evaluate in caller context and feed actual CanRecover/GetHitVar queries. Source fall reactions advance the recovery clock; browser tests verify threshold, paused-controller exclusion, disabled recovery and a real ChangeState driven by CanRecover. Original commented character recovery branches stay disabled. Exact native hitpause/hitshake/reset ordering and all actor paths remain partial.

## 0.24.53 — Down-hit velocity and reaction execution

Down-state HitDef contacts now use explicit/down-to-air velocity fallback, down hit/control times and grounded S5080 routing. Actual source S5081/S5030 paths consume those velocities. down.bounce=false suppresses subsequent fall velocity; lying actors are excluded from guarding and extra KO velocity. Browser/unit regressions pass; offsets, recovery, version timing and full down-hit semantics remain partial.

## 0.24.52 — HitDef forced stance routing

Caller-evaluated forcestand/forcecrouch now select standing/crouching ordinary hit reactions; omitted forcestand follows native nonzero ground-Y velocity default. Browser tests verify source reaction entries, explicit disabling and guard/trip/air precedence. Full pre-state mutation, custom/override/helper rules and native reset timing remain partial.

## 0.24.51 — Defender GetHitVar contact counts

GetHitVar(hitcount/guardcount) now reads defender physical-contact counters separately from attacker numhits-based HitCount/GuardCount and report totals. Tests verify both actual root hit/guard paths, including count 1 on the defender versus caller numhits 3/4. Full native gethit/reset scheduling and receivedHits remain partial.

## 0.24.50 — GuardCount execution

Guarded contacts now accumulate evaluated numhits into actor GuardCount without increasing HitCount or report hit totals. Root/helper expression queries expose the count. Browser tests cover both actual root guard paths alongside preserved hit-count regressions; entity tests cover helper/projectile writers. MoveHitPersist/reset coverage, receivedHits/GetHitVar guardcount and projectile-owner attribution remain partial.

## 0.24.49 — HitDef numhits execution

Caller-evaluated numhits now drives actual root/helper/entity HitCount writes and match-report hit/combo totals, defaulting to 1 instead of always adding one. Browser tests cover both root hit paths and report totals; entity runtime unit tests cover helper/projectile contacts and guard exclusion. Native guardCount/receivedHits, projectile-owner attribution and queued timing remain partial.

## 0.24.48 — Projectile proximity guard integration

Projectile guard ranges now snapshot caller expressions and imported projectile front-distance defaults at spawn. Actual InGuardDist includes active enemy projectiles; later owner AttackDist changes do not alter existing projectile ranges. Unit/browser tests verify snapshots, strict boundaries and defaults. Platform/attribute eligibility, all size/localcoord cases and full projectile behavior remain partial.

## 0.24.47 — Helper proximity guard integration

Helper HitDef now shares actor-owned guard vectors with AttackDist. Actual InGuardDist includes enemy helper proximity and queries the requesting actor rather than substituting its root. Browser tests verify helper expressions, reference identity and redirected distance changes; existing regression remains required. Projectile aggregation, repeated helper HitDef activation, custom size/defaults and full reset coverage remain partial.

## 0.24.46 — Shared root HitDef guard distances

Root HitDef guard.dist/width/height/depth now update the same vectors as AttackDist, with native alias precedence, negative-value retention and omitted second-component zero. Live root HitDef objects share the vectors used by actual InGuardDist queries. Unit/browser regression verifies behavior. Helper/projectile ownership, size/localcoord defaults and all reset paths remain partial.

## 0.24.45 — Partial AttackDist execution

AttackDist now dispatches into actor-owned guard-distance storage, and actual root InGuardDist queries use width/height/depth with native strict boundaries and same-plane safeguards. Tests cover parameter order, omission, redirects, scaling and root guard behavior. This is partial support: full live HitDef ownership/reset, custom size defaults, helper/projectile proximity aggregation and Z gameplay remain pending.

## 0.24.44 — Atomic StateTypeSet validation

StateTypeSet validates all supplied literals before modifying actor fields. Invalid later parameters no longer leave partial state-type/movement changes. Unit/browser checks verify both roots and a redirected helper, alongside existing combat regressions. Upfront whole-file native compilation and complete controller certification remain pending.

## 0.24.43 — DefenceMulSet literal compilation

DefenceMulSet multype now follows the pinned compiler's Atoi prefix parsing and 0/1 validation, not runtime expression evaluation. Unit/browser tests cover variable-looking text, numeric prefixes, overflow and redirected targets. This replaces an unpublished local change that relied only on bytecode behavior. Complete defense/controller certification remains pending.

## 0.24.42 — Imported character version defaults

Four character bundles now include definition-derived engine version metadata without changing existing state/action content. Actual guard hit-time, DefenceMulSet and LifeAdd default selection reads caller version instead of hardcoded MUGEN. Native parsing and browser tests cover both MUGEN/Ikemen branches. Full version-dependent semantics, custom-state ownership and other controllers remain pending.

## 0.24.41 — Shared resource protection window

RedLifeAdd/Set, DizzyPointsAdd/Set and GuardPointsAdd/Set now use the native post-round damage window instead of rejecting every RoundState outside 2. Explicit HitDef red-life/point consumption uses the same window. Intro and later post-round writes are allowed outside that interval. Actual browser paths and existing combat regressions verify behavior; queued hit consumption, native alive-state and complete resource recovery remain pending.

## 0.24.40 — Life controller post-round protection

LifeAdd/LifeSet now honor the native post-round no-damage time window through their actual root/helper adapters. The round clock remains continuous across result/presentation phases; over.hittime is imported from fight.def (10 ticks for this screenpack). Boundary, round-announcer and resource tests verify the gate without blocking all intro or non-fight states. Complete alive-state, HitDef queued-damage and other resource timing parity remain pending.

## 0.24.39 — KO/cornerpush assertions

NoKOFall and NoKOVelocity now independently suppress their HitDef KO reaction additions without suppressing HP damage. NoCornerPush suppresses actual root displacement while retaining and decaying stored cornerpush velocity. Unit and browser tests cover mixing, redirects, enabling/disabling and both player slots. This remains partial controller support; native alive/NoKO/global flags, complete hit reaction mappings and helper cornerpush are pending.

## 0.24.38 — Aerial guard execution

Imported character aerial guards now execute original states 154/155, airguard velocity/control/cornerpush and NoAirGuard. Unit and browser regressions cover both player slots through recovery and landing. Controller inventory now expands delegated compiler prefixes. This remains partial MUGEN/Ikemen support: Venus aerial guard data/assets, native input ordering, Z and further controllers/parameters are pending.

# 0.24.37 — Guard assertions

NoStandGuard/NoCrouchGuard now restrict the matching ground guard stance. UnGuardable prevents root/helper/projectile attacks from being guarded; projectiles use live owner assertions. Multi-flag mixing, redirects and expression reads have tests. Aerial guards and full native guard/input ordering remain pending.

# 0.24.36 — Locomotion assertions

NoWalk/NoAutoTurn now affect actual default root walking/turning and mix with the five damage assertions. enabled/redirectid and expression reads share actor-owned storage. Explicit ChangeState remains allowed. Unit/browser checks pass; exact native input ordering and other assertions remain pending.

# 0.24.35 — Damage assertions

AssertSpecial NoHitDamage/NoGuardDamage/NoRedLifeDamage/NoDizzyPointsDamage/NoGuardPointsDamage now suppress actual incoming resources. Multi-flag slots, redirectid, enabled and IsAsserted reads have tests; helper hitpause reset is verified. Other assertions, mixed legacy combinations and full compatibility remain pending.

# 0.24.34 — HitDef dizzy/guard damage

Explicit HitDef dizzypoints/guardpoints now consume actual resources using independent attack multipliers and defense. Expressions evaluate at HitDef creation; projectiles retain spawn-time factors. Unit/browser tests cover hit/guard selection, bounds and snapshots. Native defaults, queued timing and automatic stun/guard-break remain pending.

# 0.24.33 — Dizzy/guard point controllers

DizzyPointsAdd/Set and GuardPointsAdd/Set now update root/helper-owned resources with redirects, bounds, absolute/defense handling and expression reads. Unit/browser checks cover actual helper-local execution and gates. Hit consumption, automatic stun/guard-break behavior and full controller compatibility remain pending.

# 0.24.32 — Life/red-life synchronization

LifeAdd/Set clear red life on death and mirror HP when red life is disabled, matching the pinned native lifeSet behavior. Healing preserves enabled red life. Root/helper browser tests and module tests cover these rules; complete controller compatibility remains in progress.

# 0.24.31 — HitDef red-life damage

Explicit hitredlife/guardredlife now consume real red-life resources using a separate attack multiplier and defense calculation. Unit/browser checks cover damage, guard values and bounds. Native defaults, exact queued timing, recovery and full controller compatibility remain in progress.

# 0.24.30 — RedLife controllers

RedLifeAdd/Set now write real root/helper resources with redirectid, life bounds, defense rounding and absolute handling. The redlife expression reads current storage; dead actors clear it. Browser checks cover helper-local execution and round gates. Automatic hit consumption/recovery and HUD integration remain pending.

## 0.24.29 — Attack multiplier damage

AttackMulSet now owns root/helper multipliers, resolves redirectid and applies its damage factor to actual HitDef damage. Projectiles snapshot the spawning actor's multipliers. value/field precedence is tested. Red-life/dizzy/guard systems and full controller compatibility remain pending.

## 0.24.28 — Defense multiplier semantics

DefenceMulSet now keeps actor-owned defense state, resolves redirectid and supports onhit/multype with native MUGEN defaults. Damage and LifeAdd consume effective custom defense; helper-local controllers no longer alter their root. Browser damage tests cover immediate/delayed activation. Full compatibility remains in progress.

## 0.24.27 — Hit velocity redirection

HitVelSet now reads redirected target GetHit velocity, converts X by target facing and writes through shared root/reaction/helper bindings. Omitted/disabled axes remain unchanged; no MoveType H restriction is added. Actual browser target/local-helper checks cover the path. Full controller compatibility remains in progress.

## 0.24.26 — Sprite priority ownership

SprPriority now writes roots/reactions/helpers through the shared dispatcher, supports redirectid, native integer conversion and the zero default. Helper-local execution no longer changes root priority. Actual root canvas-order tests pass. Nonzero layerno and complete render ordering remain pending.

## 0.24.25 — Turn ownership / velocity

Turn now redirects to roots/helpers and flips relative X velocity with facing, preserving world motion. Helper-local Turn writes the helper rather than its root; reaction Turn uses the same dispatcher. Browser tests cover redirected and real helper-local execution. Full controller compatibility remains in progress.

## 0.24.24 — Control / state properties

CtrlSet and StateTypeSet now share root/helper redirectid writes. CtrlSet normalizes boolean values; StateTypeSet supports value/statetype precedence and movetype aliases while retaining omitted fields. Actual browser property tests and combat regressions verify the changes. Full controller compatibility remains in progress.

## 0.24.23 — Position redirection

PosSet/Add now share caller-context evaluation and root/helper redirectid writes. PosSet uses the camera X origin and ground Y origin; PosAdd X follows target facing. Module and actual browser coordinate tests cover these paths. Full movement/controller compatibility remains in progress.

## 0.24.22 — Velocity redirection

VelSet/Add/Mul now share caller-context evaluation and root/helper redirectid writes, respecting target facing and float32 velocity storage. Module tests cover local-scale arithmetic; browser tests verify actual redirected roots/helpers. Z physics and complete movement compatibility remain pending.

## 0.24.21 — Reaction ignorehitpause

Reaction controllers opted into ignorehitpause now execute during hitshake while ordinary controllers, state time, animation and physics remain frozen. P1/P2 outer pause forwarding avoids duplicate execution and timer decrements. Full controller compatibility remains in progress.

## 0.24.20 — Reaction controller scheduling

Reaction states now schedule both specialized and generic controllers with full persistent intervals and state re-entry reset, without double-consuming counters. PosAdd X follows actor facing. Browser fixtures verify conditional intervals, one-shot movement and re-entry; full controller compatibility remains in progress.

## 0.24.19 — Lifecycle scheduling

Lifecycle initialization now delegates conditional triggers to the scheduled dispatcher, so persistent intervals count eligible visits even when triggers are false. Command controllers retain their -1 origin and the native negative-state persistence exception. Full controller compatibility remains in progress.

## 0.24.18 — Angle trails / reflections

Afterimages now retain independent recorded angle, scale and pivot snapshots; stage reflections apply actor AngleDraw transforms. Rotation arithmetic and actual browser trail bounds are tested. Full controller/parameter compatibility remains in progress.

## 0.24.17 — Angle X/Y orthographic

AngleDraw now projects X/Y/Z rotations using Ikemen's native default orthographic matrix order. Independent matrix tests and actual browser pixel bounds verify axis tilt, Z rotation and reset. Perspective projection modes and full controller compatibility remain in progress.

## 0.24.16 — Angle controllers / 2D draw

AngleSet/Add/Mul and AngleDraw now share actor-owned angle state. Root/helper 2D drawing applies rotation, accumulated scale and pivot; draw flags reset each active tick. Actual root pixel-bound tests verify 90-degree rotation and reset. Ikemen X/Y-axis perspective projection remains explicitly unsupported, not silently ignored; full compatibility remains in progress.

## 0.24.15 — Ikemen Map controllers

MapSet/Add, ParentMapSet/Add, RootMapSet/Add, TeamMapSet/Add and MapReset now execute in the WEB runtime. Map expression reads, lowercase keys, numeric/string storage, helper ownership, redirect IDs and reset exclusions are tested. Full compatibility remains in progress; team modes and typed-expression/compiler parity are tracked explicitly.

## 0.24.14 — Root controller scheduling

P1/P2 controller dispatch now maintains independent persistence counters per state entry, resets on re-entry, and skips ordinary controllers during hitpause. Lifecycle -3/-2 controllers retain the MUGEN negative-state persistence exception. Full compatibility remains in progress; reaction-specialized and other execution paths are tracked separately.

## 0.24.13 — Parent / Root variables

ParentVarSet/ParentVarAdd and RootVarSet/RootVarAdd now use the shared variable dispatcher. Nested helpers write their immediate parent rather than always writing the root; float variables, redirected helper IDs and destroyed/missing parents are handled. Full compatibility remains in progress.

## 0.24.12 — Variable controller unification

VarRangeSet and VarRandom now share the root/helper/lifecycle variable dispatcher with expression evaluation and redirected ownership. Native signed integer overflow and float32 storage are tested. A reusable Ikemen sparse-variable path covers extended indices and its 2500-iteration range cap; current character imports retain MUGEN mode. Full compatibility remains in progress.

## 0.24.11 — Helper controller scheduling

Helper controllers now honor persistence intervals and once-per-state execution; ignorehitpause controllers execute during hitpause without advancing animation or state time. Scheduling and real helper-runtime tests accompany the existing combat regression. Full compatibility remains in progress.

## 0.24.10 — Life / Power controllers

Unified LifeAdd/LifeSet/PowerAdd/PowerSet execution for roots, lifecycle states and helpers, with evaluated redirect IDs, native rounding/limits and helper ownership. Focused semantic and browser regression tests are provided. Full controller compatibility remains in progress; see `Docs/CONTROLLER-PROGRESS.md` for explicit remaining work.

## 0.24.09 — Controller inventory / Variable storage

Controller compatibility remains in progress. The pinned official registry contains 163 controllers; `Docs/CONTROLLER-AUDIT.md` lists parameter candidates and unresolved extraction work, not certified complete support.

Root float/system-float variable storage is shared by state controllers, expression contexts and initialization. Variable setters/adders support native `v`/`fv` targets, expression indices and integer truncation. Lifecycle VarRandom supports single-value and reversed ranges. Focused variable tests and Saturn simultaneous-super regression are included.

## 0.24.08 — HitDef priority / parameter audit

## 0.24.07 — Saturn super multi-hit

## 0.24.06 — Saturn all states / AI

## 0.24.05 — Neptune projectile / Intro / Explod layers

## 0.24.04 — Neptune selection / ACS / Battle entry

## 0.24.03 — Neptune all states / AI

## 0.24.02 — Neptune S0–S999 / Electric hit animation

## 0.24.01 — Intro tails / Projectile cancellation / Independent pauses

## 0.24.00 — Jupiter all states / No 3DO

## 0.23.99 — Jupiter effects / Projectiles / Electric recovery

## 0.23.98 — Jupiter inputs / Helpers / Electric reactions

## 0.23.97 — Jupiter S0–S4999 / SNES

## 0.23.96 — KO state physics / Moon 5150

## 0.23.95 — Keyboard ownership / Tiara cancellation / KO state completion

## 0.23.94 — P2 Report Card / Moon throw effect / Selection input parity

## 0.23.93 — AI facing / Tiara helper collision / Moon intro pose

## 0.23.92 — Moon AI / Arcade opponent AI / Venus idle decision fix

## 0.23.91 — Mixed-character hitpause controller ownership

## 0.23.90 — Moon all non-3DO states / Venus S1200 effects

## 0.23.89 — Hit effects / Moon reaction frames / Crystal knockback

## 0.23.88 — Moon landing / Hit recovery / Skill effects fixes

## 0.23.87 — Moon idle fix / Non-3DO specials

## 0.23.86 — Moon S0–S999 / Mixed battles / 3DO disabled

## 0.23.85 — Compressed Moon assets / Battle integration pending

## 0.23.84 — Rounded notice font / 48px line height

## 0.23.83 — Important notice / Tap to start logo

## 0.23.82 — Smaller fireworks / Random particle fall

## 0.23.81 — Six random fireworks / Wider launch / Symbol rotation

## 0.23.80 — Correct firework symbols / Random size / Single-color trails

## 0.23.79 — Winner fireworks / Selection BGM / Hardware 80%

## 0.23.78 — Report fixes / Portrait continuity / Compressed menu audio

## 0.23.77 — 完整畫布／動畫接播

Venus 動畫改完整 1280×720、更新 Select／Lose 時序，ACS 接播、宣言 P2 反向；更新 Report 圖。ARCADE 不重複已擊敗對手，目前 1 場（每場先贏 2 回合）完結。

## 0.23.76 — Venus 動畫／Report Card

選角／ACS／宣言加入 Venus 對嘴動畫及新配音；勝敗宣言接全局成績表、最佳紀錄與續戰。SS 160000／S 130000／A 110000／B 90000／C 70000。

## 0.23.75 — Loading 正式啟用

移除 LOGO 後測試頁及重載／確定按鈕；直接進主頁，保留預載、正式 Loading 動畫與進度。

## 0.23.74 — LunaP 更新／循環跳彈

更新 LunaP／2x 進度條框半尺寸；NOW LOADING 循環跳彈，畫面外加入 12.5% 白底重複圖案。

## 0.23.73 — Loading 白底／高清字母

百分比置中進度條、填滿 X257–1026；2x 字母半尺寸顯示，全字常駐逐字跳彈。

## 0.23.72 — LunaP Loading 測試頁

19 圖合併 WebP 圖集、逐字 NOW LOADING、LunaP 6 TICK；與 LOGO 預載，新增重載／確定測試頁。

## 0.23.71 — SETTINGS 裝飾保留

設定按鈕直接置於原 OPTIONS 背景，四角縷花保持清晰。

## 0.23.70 — SETTINGS 彈窗／模式流程

提早白屏、主頁淡入；SNES 預設、TRAINING 雙人確認、ARCADE NEXT → ACS／對手專屬場景。

## 0.23.69 — 城堡進門／分模式選角

鏡頭推進至入口、裝飾退場；中前層光點飛出畫面。ARCADE 單人、TRAINING 雙角色單組控制、WATCH 隱藏 COMMAND。

## 0.23.68 — 選角光點／主頁前進轉場

選角光點平均分三層；ACS 同款光暈、數量減半。場景頁保留模式圖示，主頁各模式新增進門／白屏／Loading 轉場。

## 0.23.67 — 宣言入場留白

決戰／勝敗頭像停定後留白 15 TICK 才啟動宣言；所有 ROUND 旁白後保留 30 TICK。

## 0.23.66 — 旁白留白／1HP 測試

ROUND 旁白後留白 30 TICK；決戰／勝敗宣言留白 15 TICK。縮細 KILL PLAYER，新增 ALL 1HP。

## 0.23.65 — KO 動作完成／KILL PLAYER 測試

完局著地不再強制 S0；狀態循環兩次才救援，無限停格逾 1200 TICK 才重設。右上 KILL PLAYER 可選 RANDOM／P1／P2／ALL。

## 0.23.64 — 決戰／勝敗宣言

頭像高 360px，P1 (280,360)／P2 (1000,360)；宣言間隔 30 TICK，完局自動進入勝敗宣言後返回主頁。

## 0.23.62 — Logo transitions / organized assets / static selection

Assets now follow `Stage/`, `Char/`, `Data/`, `Sound/`, `Engine/` and `Tools/`. See [repository layout](Docs/repository-layout.md) for current paths and selection controls. Historical release notes below may refer to previous root-level filenames.

VS / Training / Watch now open P1 → P2 → Stage selection. Currently enabled: **Sailor Venus and Training**; unsupported choices are disabled.

---

# Palace Web — Sailor Venus

[開啟遊戲](https://cpfortune1111.github.io/palace-webp/)

## 最新版本：0.23.46 — Complete Round Flow M1

BUILD `complete-round-flow-m1-20261003-01`。待人工驗收。

- Venus 1v1 VS／Watch：5900 初始化 → 原 190／191 入場 → 1990／1991 收尾 → Round／Fight → 實戰 → KO／Double KO／Time Over → 原 180→181 勝利、175→170（來源無 175 動畫）敗北 → 下一回合。
- 按 fight.def 先勝 2 局、最多 2 局重賽和局；第三次和局結束比賽。保留分數、更新 RoundNo／RoundsExisted，每局重置 HP／座標／Timer／命令／hitpause／Projectile／Helper／Explod，來源 5900 只在首局清指定變數。
- Timer 只在實戰有效 ticks 倒數；入場／勝負／debug pause 不扣秒。KO 優先於同 tick 到時；Time Over 按即時實際 HP 判勝負，HP 同值為和局。勝負決定後禁止新傷害／操作，等 KO 倒地才進 pose，RoundState／Win／Lose／MatchOver 查詢接通。
- 比賽結束提供「再戰／主頁」。Training 維持自由練習，不自動判勝負或重开；Space 補血仍可從 5150 起身。VS／Watch 結算階段禁用補血。
- 新增原 170／181／190／191／1910／1911 無損 WebP、Fight／KO AIR 與原回合 announcer／角色入場勝負人聲；fightfx 930–935 的原控制模式圖示接入。原不存在的 936／937 不造素材。
- 仍是 Venus 1v1；非 Arcade／Continue／選角／4P。來源 slow.time 慢鏡與原 bitmap 勝負文字字型尚未實作，不混稱完整 IKEMEN 視覺移植。

## 0.23.45 — HP Front / Options Artwork M1

BUILD `hp-front-options-artwork-m1-20261003-01`。待人工驗收。

- 表層恢復 10 tick ease-out（由快至慢），中層維持已 PASS 的 HOLD 60 tick／等速 10 tick。實際 HP／KO 不延遲。
- 移除主頁 BGM 播放按鈕；保留自動播放嘗試與首次任意互動重試。
- 主頁右下 TsukinoAi+ Logo 連往 https://tsukinoaiplus.com，另開分頁。
- Options 轉獨立畫面，按 SYSTEM.DEF OptionBG 使用 200,1 背景及 1,0 Thankyou 層，保留設定功能與返回；原 bitmap 選單字型尚未接入。
- SYSTEM.SFF 非主頁場景圖片共 159 張以 lossless WebP 匯出至 system-webp/，system_webp.json 保留尺寸／axis／來源 SHA256。雲／海／主頁場景不改。

## 0.23.44 — HP Trail Hold / BGM Start M1

BUILD `hp-trail-hold-bgm-start-m1-20261003-01`。待人工驗收。

- 1v1 中層 12,1 每次受傷先 HOLD 60 simulation ticks，再以等速 10 ticks 扣至實際 HP；再次受傷重新計時。實際 damage／KO 仍即時，補血立即恢復顯示。
- 主頁立即嘗試 BGM 自動播放；被瀏覽器阻擋時顯示播放按鈕，亦接受點擊／觸控／任意按鍵啟動，不再只靠 Arrow。音量設定保留。
- 使用者回報雲／海仍未動；按要求暫緩，不視為驗收通過。主頁可改用 GLB 3D 場景，尚待提供主頁素材，今版未替換。

## 0.23.43 — Title Animation / HUD Fix M1

BUILD `title-animation-hud-fix-m1-20261003-01`。待人工驗收。

- Timer 十位 612→614（右移 2 個 logical pixels），個位 642 不變。
- 使用者確認保留 1v1 的 12,1，而非 team 的 12,2。中層保留 10 tick ease-out，前景用即時實際 HP，重新露出兩層之間的扣血區域；實際 damage／KO 邏輯不改。
- 主頁全 TitleBG 動態：原 A0 Logo 16 個 1 tick 位移／最後停留、A21 雲 150 格、A30 海 137 格，原 AIR frame duration／循環；兩組流星按 start 330,-120／1220,90、velocity -24,10、tile 1,1、addalpha 50,256。Logo 使用既有 WebP 原 sprite 的來源位移；雲／海用動畫 WebP（quality 90），避免載入逐格 atlas。原素材／axis／順序不變，WebP 顏色有高品質壓縮，不宣稱逐像素無損。
- P2 Keyboard/Numpad 的 holdup 在可控制地面 0／11／20／52 接 S40，保留受擊、空中、KO 禁止跳躍；按原 Common runner 進 50／52，不依賴 P2 出拳測試按鈕。
- 驗收：Timer 十位／個位、兩邊中層扣血區域；Logo 入場後停住、雲／海持續循環、流星移動／平鋪；Numpad8 的垂直／斜跳、著地續跳與受擊時不能跳。Menu bitmap 字型仍待補，沒有混稱為動畫完成。

## 0.23.42 — Title Menu / Options M1

BUILD `title-menu-options-m1-20261003-01`。待人工驗收。

- Timer 個位原位置 642 保留，只將十位由 584 改至 612；無限模式不畫符號。匯入 fight.sff 51,0 作兩方頭像背景，置於頭像下方，按原 P1 0／P2 1280 anchor 及面向繪製。
- 血條前景改為 10 個 simulation ticks 的 cubic ease-out（首 tick 扣最多，逐 tick 遞減，第 10 tick 精確到目標）；多段攻擊從目前顯示值重新收縮。實際 HP／damage／KO 即時處理，不延遲戰鬥判定，Space 補血立即回滿。
- 主頁取原 system.def TitleBG 順序：10,0 星空／20,0 地球／21,0 雲／25,0 宮殿／30,0 海／1,0 作者標誌／0,0 Logo；原 SFF 像素、axis，1280×720 fit。今版使用動畫首格／Logo 最後靜止姿勢，流星、雲／海動畫及原 bitmap Menu 字型仍待補，不宣稱 TitleBG 完全復刻。
- Menu：VS（雙人 keyboard，預設 99 秒，Options 可改時間）、Training（無限）、Watch（雙 AI，使用原 CMD 已支援 AI 招式／移動分支，非每隔固定時間亂出拳）、Options；遊戲 Input 的 Menu 可返回主頁。仍保持 Venus 1v1，未加選角／多人／完整新回合流程。
- Options 本機儲存：Difficulty 1–8、Timer None／15–99、Master／BGM／SFX 0–100%，Key Config 連既有雙人自訂鍵位。來源 title.bgm BGM.mp3 循環；Master×分類音量作用於主頁 BGM、角色／Common 音效。瀏覽器首次播放仍需使用者點擊。難度供 Watch 的 AILevel 來源機率使用，無人類模式 AI。
- AI 補 Helper(9999),var(n)、EnemyNear(0) 與不等 HitDefAttr redirect 的表達式路徑；原未完成 throw 不啟用。來源 AI 及對戰平衡仍需深測；沒有假稱 Round flow 已完成。
- 驗收：99→98 的十位／個位、無限空白；雙邊 51,0、各傷害 10 tick 減速收縮、連續命中／KO／Space；主頁四選項、VS 鍵盤／Training 無限／Watch 雙方攻擊；Difficulty／Timer／音量 reload 保留；Key Config 返回／儲存。原 TODO 待深測項目不自動 PASS。

## 0.23.41 — Camera Bounds / Fight HUD M1

BUILD `camera-bounds-fight-hud-m1-20261003-01`。0.23.40 使用者 PASS。本版待驗收。

- 畫面左右／底部按 StageTraining 1280×720 letterbox 可視框裁切玩家、Helper／Projectile／Explod、CLSN；頂部不裁，保留跳躍出上框效果。只裁繪製，角色世界位置、camera follow、zoom、比例及戰鬥碰撞不變。
- 匯入原 data/fight.def、fight.sff 的 1v1 血條 bg0 A1001、bg1 11,1、mid 12,1、front A1311（60 格，每格 4 ticks）、Timer 心形框 60,0；P1 anchor 0，P2 anchor 1278／反向，range 619↔161，實際 HP 剪裁。扣血延遲條採 30 ticks 後每 tick 1% 的 Web 暫定值，非已驗證來源 mid timing。
- Timer 預設 ∞，Input 內可切 99 秒；來源 framespercount=60、font6 bank3 的 timer.sff 數字。模擬 pause／step 跟隨 sim tick；命中停止／SuperPause／KO 停倒數，Space 補血亦重置時間。99 到 0 顯示剩餘 HP 勝負，仍維持 training 操作，不自動轉 Win／Lose states 或開新回合。
- 原版對比盤點：仍未完成真正 5900→190/191 intro→對戰→KO/TimeOver→Win/Lose→新回合；AI 正式選項／決策驗收；完整共同 Common runner 與 -1 尚未支援路徑；音效 helper 深測；4P 真正同場（目前只 partner 查詢）；Powerbar、姓名來源字型、回合勝利圖示、Combo／宣告；完整 HUD AS224D32 blending 與 mid timing（本版 bg0 alpha 224/255 暫代）；選角頁 Normal/Auto、主頁 settings；逐招與 IKEMEN 並排深測。投技／645／175／5500 原作者未完成，保留參考，不列引擎 bug；recovery 入口按來源停用。
- 驗收：窄畫面跳躍仍可越上框，地面 P2 腳／倒影不可穿下框；寬畫面左右不可漏出角色／特效；P1/P2 受擊／KO／Space 的 HP；∞ 不倒數、99 每 60 有效 ticks 減 1、Pause/Step、時間到判定。只更新本 README，不新增說明文件。

## 0.23.40 — Portrait Facing / Low Life Idle M1

BUILD `portrait-low-life-idle-m1-20261003-01`。待人工驗收。

- 修正 Explod 渲染漏讀 AIR 的 H／V 翻轉；P2 頭像 A925–929 使用原 H，P1 A915–919 保持原方向。頭像不隨角色轉身反轉，位置、來源 AIR 及圖像不改。
- 按原 Common S0：HP ≤ LifeMax/4 時播放 A5300（不是進入 S5300），高於門檻恢復 A0；保留 A5 轉身直至完成，不覆蓋攻擊、受擊或 KO。P1／P2 同步適用；原 A5300 的 12 個影格與時間完整匯入。
- 測試：P1／P2 血量 251、250、1、1000；低血站立、轉身、攻擊及 KO；A915–919／925–929 全部頭像翻轉。人工請測 250 HP 站立喘氣，Space 補血回 A0，再測 P2 正常、受擊、倒地、勝負頭像。
- 本版只更新 README 作版本說明；維持 Venus 1v1、來源 recovery 入口停用、鏡頭校準及 0.23.39 舞台呈現。

## 0.23.39 — KO Push / Stage Visuals M1

BUILD `ko-push-stage-visuals-m1-20261003-01`。本版待人工驗收，不將 0.23.38 整體標 PASS。

- KO 推擠：HP0 的角色不再参与 PlayerPush 配對；雙方對称適用，活角色原推擠及 Space 回 HP 後的推擠仍保留。此為使用者明確 override：IKEMEN 原引擎有 `alive || NumPartner=0` 的 1v1 相容例外，Web 不再因 1v1 而讓屍體擋路。抽出每個角色的推擠資格判定供未來多人配對共用，不宣稱已開啟 4P。
- 原 Web 額外加了 HemisphereLight（2.2）與 DirectionalLight（2.4），原 StageTraining.glb 沒有定義燈光。現移除兩盞額外燈，保留 GLB 原材質／emissive／貼圖，不用 CSS brightness 硬壓亮度、不改原 GLB。鏡頭位置、投影、zoom、角色比例不改。
- 通用 foreground filter：直接抽出 StageTraining.def `[BG Filter]` 的 SFF `1,0`，按 layerno=1／delta=0／trans=none 的來源設定，在舞台、角色及特效之上、HUD 之下繪製。原圖 3840×2160、axis 1920,1080、alpha=8；只匯出固定 1280×720 遊戲視窗實際可見的原像素區域，以無損 WebP 節省下載，解碼後逐像素一致。不是自行加灰色遮罩或更改濾鏡透明度。共用 render layer 可供往後其他舞台使用，其他舞台尚未逐一比較。
- 角色倒影：按原 `[Reflection] intensity=50`，以當前 AIR sprite、面向／offset／空中高度鏡像至地面下方，alpha=50/255，置於角色之下並剪裁在遊戲視窗；角色 KO、跳躍、轉身及動畫更新同步。保留原 sprite 像素，不另生成假倒影素材。
- 修正匯出器遇到 3840px 大 sprite 超過原 atlas 寬度而被截斷的問題；既有 Venus 圖集及所有來源檔不重寫。stage_visuals.json 記錄原 DEF／SFF／GLB hash 與裁切位置。只更新本 README，不新增說明文件。

人工請測：雙方分別 KO 後，由左右走過屍體，屍體不能被推走／阻擋；Space 回 HP 起身後正常推擠。對照原 IKEMEN 舞台較暗的顏色、濾鏡顆粒與腳下倒影；跳躍、蹲下、轉身、KO、上下鏡頭移動及手機比例亦請試。自動檢查涵蓋雙向 KO 推擠、活角色推擠、無額外燈、來源 alpha／倒影强度、濾鏡 screen-fixed、圖像 lossless 比對及舊 runtime 回歸；已檢視含實際 GLB 的預覽，不宣稱跨瀏覽器顏色完全相同。

## 0.23.38 — Source Globals / Helpers M1

BUILD `source-globals-helpers-m1-20261003-01`。本版待人工驗收，只更新此 README，不新增版本文件。

- 全部 -3（20 個）／-2（44 個）來源 controller 依序加入雙方每 tick 執行，hitpause 只執行原 ignorehitpause=1；蓄力不再由舊 chargeControllers 重複跑。保留來源 Var3／4／5／6／15／40／41、NoAirGuard、PowerSet 等條件；pause／superpause 仍停用受暫停本體的全域執行。
- 原 Helper 9999 每位玩家只建立一個，Invisible、Root／Enemy／EnemyNear 查詢、ParentVarSet、41 個原決策 controller、RoundState!=2 的 DestroySelf 已接入。包含原本看似相反的 RoundState!=2 判定，沒有自行修正原 AI。**這是決策資料基礎，不是啟用 AILevel／AI -1 自動出招。**
- 原 915／925 頭像 Helper 及 915..919／925..929 AIR／SFF 已匯出並接入：正常、受擊、低 HP、KO；原左右畫面定位、0.75 scale、removetime=-1、LoopStart／末格 -1 保留。原 950 partner helper 資料保留，NumPartner=0 時不建立。Win 圖示及 TeamMode=Simul 分支保留來源，但因尚未實作勝負／多人流程，不標為已可玩。
- -3 四組受擊人聲 10,0..3 直接抽取原 SND，依原 Time／Alive／Random 條件播放；沿用雙方獨立聲音頻道。IKEMEN 的攻擊者 hitPauseTime 與防守者 gethit shaking 分開，不能因防守者 shaking 而略過來源 Time=1 的人聲。本角色來源沒有獨立 PlaySnd 音效 Helper，不能把全域人聲誤稱為新增音效 Helper。
- 初始化模組及原 5900／190／191／1990／1991／WinLose 已編譯保留；5900 首／後回合與 var／fvar 測試通過。**目前仍用已驗收的 training 啟動：5900→Intro、自訂控制模式 F930..937、完整 round flow 尚未接上，不聲稱完成初始化 gameplay。** Draw175／Continue5500 將依使用者要求用 Lose 動畫；停用 recovery 入口及未完成投技維持原樣。
- 1v1 Partner／NumPartner／NumEnemy／TeamMode 查詢、Helper 個數及 instance ID 分離、Root／Enemy redirect、HitDefAttr、來源尺寸的 P2BodyDist／edge 距離供決策使用；不增加四人對戰。鎖定鏡頭、普通技、CMD、空中不可防禦及所有已驗收 override 不改。

自動驗證：348 項雙人 Helper／來源表達式／低 HP／KO／持續動畫／原決策觸發與清除／雙方 shaking 中受擊人聲，初始化／查詢／排程單元測試，以及舊普通技、四招必殺、聲音、取消、guard、fall、鍵盤、同時輸入回歸。未把未測分支標 PASS。人工請測兩邊頭像正常／受擊／低於 250 HP／KO／Space 回復切換；再測普通連招、Sword 蓄力與 3000 暫停，確認新全域邏輯沒有改已驗收手感。

## 0.23.37 — Guard KO Transition M1

BUILD `guard-ko-transition-m1-20261003-01`。0.23.36 使用者 PASS；本版修正致命防禦傷害，待人工驗收。

- 按 IKEMEN 的 guard KO 判定：防禦扣血足以令 HP 歸零時，不再選普通 guard reaction，直接用命中 shaking／KO fall 路徑，避免 S151／153 等到結束、返回 S0 才跌落。保留命中 hitpause，不代表取消必要定格。
- 防禦可否 KO 使用原 `guard.kill`（預設 1），不是普通 `kill`。`guard.kill=0` 仍保持防禦及至少 1 HP；未致命防禦不變。普通攻擊、Projectile、Helper 共用修正，P1／P2 同樣適用。
- 人工請測：兩位玩家分別站防／蹲防，以低 HP 防禦 3005 Helper；HP0 當下應直接進入 S5000 受擊，再按 Common 倒地至 S5150，不應經 S0。Space 回 HP／起身仍可用。鏡頭、來源 CNS、動畫、傷害及鍵位不改。
- 上一輪要求的初始化／Intro／回合／9999／AI 尚未發布；本版是獨立 bugfix，不宣稱該批功能完成。保持 Venus 1v1，partner 部分僅補來源查詢的範圍不變。

## 0.23.36 — Voice / Sound Channels M1（使用者 PASS）

BUILD `voice-sound-channels-m1-20261003-01`。0.23.35 收到三招人聲截斷回報；本版待人工聽音驗收，不將上一版整體標 PASS。

- 原 S1000／S1100／S1200 的人聲 `1000,0`／`1100,0`／`1200,0` 明確指定 channel 0；之後的 `900,0`／`900,2`／`900,3`／`900,4` 沒有指定 channel。根因是 Web runner 把未指定頻道錯當 0，後續音效因此 pause 原人聲。現把未指定／負數頻道保留為自動頻道，可與人聲及其他自動音效重疊；不改原 CNS、不延長或剪接原 WAV。
- P2 同樣修正：只有明確頻道才加玩家 offset，不能把自動 -1 轉成共用 channel 3。明確同頻道的新聲音仍替換舊聲音，原 StopSnd 不移除；沒有為三句人聲加永不停止的特例。聲音正常結束／錯誤／播放被瀏覽器拒絕時清理追蹤，舊聲音的結束事件不會刪除新聲音的頻道。

人工請測：NORMAL／AUTO、P1／P2 分別出三招，確認人聲完整播完，發射／鐵鏈音效仍同期播放；雙方同時出招的人聲互不截斷。同一玩家立即再開另一句 channel 0 人聲仍按來源替換，並非所有聲音永久重疊。瀏覽器首次需互動才能允許音訊，請實際按鍵出招聽音。

自動驗證加入三招雙人完整 simulation 的人聲／後續音效追蹤、自動頻道重疊、明確頻道替換、雙方隔離及 end/error 清理；保留上一版必殺與完整 runtime 回歸。自動檢查確認沒有錯誤 pause 呼叫，不代替人工聽音驗收。鏡頭、動畫、CMD、傷害、圖集、原始來源及所有 WAV 保持不變。

## 0.23.35 — Special Fixes / Command Modes M1（收到人聲修正回報）

BUILD `special-fixes-command-modes-m1-20261002-01`。0.23.34 四項回報已修正，本版待人工驗收；只更新此 README，不新增版本文件。

- **全部 A905 不受 hitpause 凍結**：第一格仍為原 AIR 的 4 tick，不再加上命中的 8 tick；後續影格同樣依原 AIR 推進。沒有改 sprite／AIR 時間，也沒有讓一般 Explod 忽略 Pause／SuperPause。
- **1000 根因不是普通拳排在前面**：原 -1 次序已是 3000→1200→1100→1000→100→105→普通技。本次明確按來源行號排序並測試全部啟用 controller／command 定義；未完成投技仍留參考、不啟用。真正失敗是久站後下→斜前下時，`~D,$D` 同 tick 的兩個來源步驟被當成同一方向鍵、反序處理，漏掉 `$D`；按 [IKEMEN v0.99.0 的不同 release／dollar command keys 與 IsDToB](https://github.com/ikemen-engine/Ikemen-GO/blob/v0.99.0/src/input.go) 保留此 legacy 組合的同 tick 辨識。沒有改原 CMD 指令、time=15／buffer=3，也沒有讓未完成 motion 延遲普通拳。
- **1100 輕／重 Projectile 1150 到可見鏡頭頂邊才收尾**：使用當前鏡頭 Y 和原 sprite axis／AIR offset 計可見頂部，過邊時截在頂邊、VY=0，轉原 `projhitanim=9041`；播完整段（包括來源空影格）再移除，期間 NumProjID 仍存在。普通命中／防禦仍先走命中收尾。**這是使用者要求的明確 override**：原 CNS `projremovetime=30`、世界上界 -720 不再提前終止此子彈；其他子彈期限／碰撞／移除不變，原 CNS 及鎖定鏡頭校準不改。
- Input box 新增 **Command: NORMAL／AUTO** 按鈕，目前同時切 P1／P2；與原 Input Auto（自動選鍵盤／觸控）是兩回事。直接切原 `var(52)=0／10`、套原 CMD，不另造短指令。內部支援分別設定每位玩家，方便之後放入選角頁；切換清除舊輸入／buffer，不偷偷取消進行中的招式。
- 同時修正 AUTO 輕重選擇：來源 buffer=1 的短指令不應因本版 runner 下一 tick 才執行 Time=0 Var2 而失效、變成重招。只為 1000／1100／1200 的來源 Time=0 Var2 保留入 State 當 tick 的 command 查詢快照；不延長 buffer，不影響之後的 command／取消查詢。

人工請測（兩位玩家、兩面向）：

1. 1200／普通命中或防禦，用 Scroll Lock 查 A905 第一個 sprite 只留 4 tick，命中定格期間特效繼續播。
2. **NORMAL**：站定一會後下→斜前下→前＋x／y，多次輸入 1000；最後前＋按鍵同 tick 或相隔 1–2 tick 都測，不能誤出 200／210。未完成方向指令的普通拳仍照原規則出。
3. 1100 輕重空振：兩種都上升至畫面頂邊，轉 A9041、VY=0，播完消失；跳高令鏡頭 Y 改變時亦測，命中及防禦仍可正常收尾。
4. **AUTO**：按住 L＋x／y／a＝輕 Beam／Sword／Chain；按住 R＋x／y／a＝重 Beam／Sword／Chain。L＋R（或 R＋L）＝Chain Explosive，仍需 HP≤250。原 `~d`／`~w` 釋放後短接鍵也保留；AUTO Sword 按來源不需 NORMAL 的 >40 tick 蓄力。P1 L=Q、R=W、x=Z、y=X、a=A；P2 L=Num/、R=Num*、x=Num0、y=Num.、a=Num1。切回 NORMAL，短指令不得再代替長指令。

自動測試新增：A905／一般特效 hitpause 及 Pause 區分、久站後雙人雙向輕重 Beam、1150 兩種鏡頭高度與輕重頂邊收尾、八組原 AUTO 短指令／輕重選擇、模式按鈕與來源次序；保留全部普通技／取消／guard／fall／輸入／必殺回歸。人工接觸計時未 CHECK，GetHit／HitOver／HitShakeOver／HitVelSet 仍初步 TEST、待深測，不標為全 PASS。

## 0.23.34 — Venus Specials M1（收到四項修正回報）

BUILD `venus-specials-m1-20261002-01`。0.23.33 使用者 PASS；四招同版接入，本版待人工驗收，不標為 PASS。

- 原 CNS `1200` 多段 HitDef、HitCount／Var44／Var3、輕重動畫與 Explod；`1000`／`1100` 原 Projectile、NumProjID、命中動畫／移動／期限、輕重參數及聲音。Projectile 使用自身命中／hitpause，不把子彈的接觸計時寫到本體。Sword 保留原正常模式 Var16>40 蓄力條件。
- 原 `3000→3005` 的 SuperPause／Pause、BGPalFX、左上定位的兩段全畫面 Explod、音效與 StopSnd、Var45 第二次略過開場；3055／3050／3051／3052／3056 Helper、ParentVar47、HitOverride、NoChainID、DestroySelf。**S3005 相反的兩條 MoveContact triggerall 原樣保留，傷害由 Helper 執行**，沒有偷偷解除來源條件。
- 匯出原 SFF／AIR 必殺、特效、Hard GetHit 動畫；保留 ticks／LoopStart／空影格／軸點。使用有限尺寸無損 WebP 圖集而非超高單圖，每頁解碼後逐像素與來源匯出比對一致；聲音直接由原 SND 抽取並校驗，SuperPause 的 20,0 使用原 common.snd。首次下載會比上一版多；手機效能仍需人工實測。
- 玩家 -1 依原 CMD 次序啟用四招，未完成投技仍停用；加入蓄力所需的原 -3 Var16／17 controller。保留鏡頭校準、440 使用者速度調整、NoAirGuard、停用的原 recovery 入口及所有已驗收鍵位。

人工測試（方向皆相對角色朝向；P1 x=Z、y=X，P2 x=Num0、y=Num.）：

- `1200`：前→下→斜前下＋x／y，分別輕／重。測近距離多段命中、站／蹲防禦、空振、命中取消與受擊中斷特效。
- `1000`：下→斜前下→前＋x／y。測輕重速度／傷害、子彈獨立飛行、命中後消失、雙方子彈與 NumProjID 出招限制。
- `1100`：按住下超過 40 tick，再上＋x／y。輕／重出現位置與上升速度不同，近距離不一定命中；測蓄力不足不能出、命中／防禦／到期消失。
- `3000`：HP≤250 時後→下→前→下＋y（原 CMD 時限 30 tick）。測開場定格／背景／聲音、對手暫停、Helper 傷害及防禦、同一角色再次使用略過開場；Space 回 HP 會令超必殺入口暫時不可用。

自動驗證：32 組雙人／左右朝向／近遠距離完整出招與返回，來源 command／蓄力／HP 入口、Hard／Medium 受擊與 NoAirGuard；保留上一版全套 command、普通技、取消、倒地、鍵盤與 A12 回歸。人工接觸計時未 CHECK，GetHit／HitOver／HitShakeOver／HitVelSet 仍初步 TEST、待深測。此 runner 針對上述 Venus 來源配置，並非宣稱完整通用 MUGEN 引擎；AI、未完成投技、其他 Helper／Projectile controller 尚未接入。

## 0.23.33 — Crouch Exit End Frame M1（使用者 PASS）

BUILD `crouch-exit-end-frame-m1-20261002-01`。使用者確認 0.23.32 其餘項目暫時 PASS；A12 結尾倒跳單獨修正，本版待人工驗收。

- 原 AIR A12 沒有改 ticks：`40,1,0,0,1` → `40,0,0,0,2`。根因不是 E2 被改成 1，而是動畫 age 到總長度 3 後、原 Common `AnimTime=0` ChangeState 在下一次 controller 評估前，通用播放器先回圈到 E1，產生 S12/T3/A12/E1 的錯誤邊界畫面。
- P1／P2 A12 播完時保留最後 E2，等待原 Common 的 S12→S0，不重播 E1、不延長 AIR 的 E2 duration、不改 CtrlSet(Time=1)／取消條件。邊界 HUD S12/T3 仍在 E2，下一 tick 依來源回 S0；這是顯示來源 state transition 前的尾格，不是新增第三個 AIR element。600／630 的原 LoopStart、guard／fall 特例及其他循環不改。
- 新增雙人／兩面向由 S11 放開 ↓ 的完整逐 tick fixture，核對 S12/T0/E1、T1/E2、T2/E2、T3 邊界保持 E2，然後 S0；同時檢查原 sprite pairs／ticks，以及全部 command／取消與舊版回歸。原始 AIR、atlas、鏡頭、鍵位和音效不改。

人工請測：P1 ↓／P2 Num5 蹲下後放開，用 Scroll Lock 查 A12 結尾不能再回 E1；T3 邊界需保持站起來的 E2，接著回 A0。兩面向及再蹲／收招取消仍可用。0.23.32 接觸計時與深測狀態保留，不將「其餘暫時 PASS」改標全部深測完成。

## 0.23.32 實作紀錄（除 A12 外，使用者暫時 PASS）

BUILD `command-buffer-normal-cancels-m1-20261002-01`。使用者 0.23.31 PASS；本版待人工驗收。只更新此 README，所有 atlas、原始 CNS／CMD／AIR／SFF、鏡頭及已驗收調整保持不變。

- 重新由原 Venus CMD 匯出 command 定義，保留重名 command 的全部變體與來源行號，修正舊 runtime 中過時的招式名稱。Defaults time=15／buffer.time=1；FF／BB time=10，普通按鍵 time=1／buffer=3，特殊 command 依原個別設定（含 time=30）。所有時間以 60Hz simulation tick 計，不依鍵盤 repeat 或螢幕刷新率。
- P1／P2 各自獨立但共用同一個 command runner，按 IKEMEN `src/input.go` 的 signed input、step 順序、同 tick 方向→按鍵、嚴格方向與 `$` 四方向、release／hold／AND、同方向 auto-greater、整段 time window、buffer 與 hitpause 延長／凍結處理。按住普通技不自動連發；查詢不消耗 buffer。鍵位 l／r 對原 CMD d／w；模式切換／失焦／Settings 清空輸入及 buffer，兩人不互相污染。
- `MoveContact`＝最近 hit／guard 接觸計時；`MoveHit` 僅最近命中，`MoveGuarded` 僅最近防禦，另一種為 0。接觸當 tick=1，hitpause 凍結，恢復後遞增，ChangeState（包含同 State 重入）清零。兩邊 AST、HUD 的 MC／MH／MG 與匯出 trace 均可檢查，trace 同時記錄仍有效的 command buffer。
- 已接入 states 的玩家 `-1` 使用原 controller 順序／triggerall／trigger groups：100／105 加十二個普通技。移除 State200 額外的一次按鍵 latch，P2 不再獨立猜測 dash／普通技入口；雙方正常技在原 MoveType=I 恢復窗口可以接受預先 3 tick 的按鍵。
- **原 CMD 並非任意普通技互取消**：站立 200／230 收招 MoveType=I 可重入 200／230，或接 210／240；蹲下 400／430 收招可重入 400／430，或接 410／440。需原站／蹲方向，不能在 MoveType=A 時因命中而任意串普通技，210／240／410／440 沒有額外收招取消入口；空中四招仍需 Ctrl，沒有新增空中取消。BB 依原命中／防禦與 State 範圍取消，440 另需 P2StateNo=5070。
- 3000／1200／1100／1000／801／800 的玩家 `-1` 保存為 deferred 來源 controller，不啟用尚未有完整 runtime 的必殺／超必殺／未完成投技；motion command 已可辨識，但不聲稱這些招式已可玩。AI `-1`／全量 `-2/-3`、Projectile／Helper 仍列後續。5050 註解 recovery 入口仍停用。

人工請測（P1／P2、兩面向）：200／230 收招前輕按同鍵或另一普通技鍵，應按原窗口重入／接招；按太早且 buffer 已過期不可出招，按住不連發。蹲下 400／430 接 400／410／430／440；放開 ↓ 不可當蹲技輸入；活動攻擊影格不能任意取消。FF／BB 雙擊、命中後 BB、防禦中 BB、440 命中 Trip 後 BB；whiff 不應開啟命中取消。用 Scroll Lock 查命中 MH>0／MG=0、防禦 MH=0／MG>0、hitpause 不增加、重入全歸零；兩人同 tick 按鍵仍應獨立出招。Space／LoopStart／NoAirGuard 保持舊版結果。

自動驗證新增 command 時限／buffer／hitpause／hold／duplicate／same-frame／雙人隔離及來源取消矩陣，64 組 live 收招前預輸入／同 State 重入與雙向取消，並保留全部舊版回歸。接觸計時仍未人工 CHECK；GetHit／HitOver／HitShakeOver／HitVelSet 維持初步 TEST、待深測，不以自動結果代替人工 PASS。

來源：[IKEMEN command runner](https://github.com/ikemen-engine/Ikemen-GO/blob/develop/src/input.go)、[Char 接觸計時與 input.pauseonhitpause 預設](https://github.com/ikemen-engine/Ikemen-GO/blob/develop/src/char.go)，及 repo `sources/venus/original/venus.cmd`；無新增 Web-only 取消規則。

## 0.23.31 實作紀錄（使用者 PASS）

BUILD `air-loopstart-hp-restore-m1-20261002-01`。修正使用者回報 600／630 空中倒跳抽搐；0.23.30 不標全 PASS，本版待人工驗收。

- 根因：AIR 匯出器只保留影格、漏掉 LoopStart，P1／P2 播放到尾格都重返第一格。現按原 AIR 保留零基準 loop index；600／630 原 LoopStart 在 E4，startup E1→E2→E3 只播一次，其後 E4→E5→E6→E4 循環。同步更新動畫時鐘，AnimElemTime 不因循環繼續偏離影格，也不把 State Time 重置。原影格 ticks、sprite、Clsn、招式速度及鏡頭不改。
- 右上新增 HP 按鈕，Space 同效：回復 P1／P2 全部 HP，不重置位置、不取消普通攻擊或受擊、不更改播放／暫停狀態。已在 S5150 的 KO 角色以訓練功能進原 S5120 起身，再依原 CNS 恢復；這是明確 debug override，不杜撰原 S5150 的 recovery controller，也不啟用 5050 的註解 recovery 入口。
- Space 保留為回血快捷鍵，不可設成戰鬥鍵；按住不重複觸發，Settings／文字輸入／修飾鍵不回血。暫停時亦即時更新 HUD 與畫面，起身動畫等待播放或單步推進。Pause/Break 與 Scroll Lock 保持原作用。

人工請測：原地／移動跳 600、630，暫停逐 tick 核對 E6 後回 E4，不能回 E1；P1／P2、兩面向均測。扣血後用右上 HP／Space，兩邊滿血但位置不重置；雙方 KO 到 S5150 後回血，應經 S5120 起身，可繼續操作。暫停回血不自行播放。

自動驗證涵蓋來源 LoopStart／跨三輪循環／雙人 element 與動畫時鐘、按鈕／Space／repeat／Settings 隔離、雙方 S5150→5120→可操作及暫停刷新，並保留空中四招與全部舊版回歸。人工待測；接觸計時及 GetHit 深測狀態不變。

## 0.23.30 實作紀錄

BUILD `air-attacks-air-gethit-m1-20261002-01`。使用者 0.23.29 PASS；本版待人工驗收。保持鎖定鏡頭、440 速度 override、hitshake x2 與雙人自訂鍵位。

- 按原 CNS／CMD／AIR／SFF 接入 600 跳輕拳、610 跳重拳、630 跳輕腳、640 跳重腳；保留入招速度、Physics=A 重力／著地 52、Ctrl=0 與原 MoveType 收招時間，沒有新增空中取消。P1 跳起後 Z／X／A／S；P2 Num8 跳起後 Num0／Num.／Num1／Num2。Settings 自訂鍵位優先。
- 傷害依來源：600=30、630=40；610 原 `cond(Vel X=0,90,100)`、640 原 `cond(Vel X=0,70,80)`，HitDef 建立時固定計算，不能改成命中時重算。610／640 的 `Med` 正確選 Medium GetHit，600／630 為 Light。四招原 air.velocity=-8,-28；air.hittime 未設定，採 IKEMEN 預設 20，ground／guard 時間及速度分別保持原值。
- 空中碰撞依原 hitflag=A 接入雙向命中、NoAirGuard 對手不可擋；地面對手可按原 guardflag=M 站／蹲防。地面預防禦亦可被空中攻擊威脅，仍使用原 attack.dist=640，不把跳起攻擊者誤排除。保留 132／154／155 原來源資料，不建立可玩 air guard。
- Common 5020 shaking →5030 上升 →5035 transition →5040 空中恢復；fall／KO 進既有 5050／落地彈地／5150。原 HitVelSet XY、GetHitVar(airtype/yaccel)、HitOver／HitShakeOver、range、CtrlSet／StateTypeSet 共用來源 controller；恢復控制後可依原 CMD 再出空中技，HP0 不恢復控制。
- 完成 5200→5201 ground recovery 與 5210 air recovery：原 Turn／PosFreeze／VelMul／VelAdd、方向修正、NotHitBy、Time20 CtrlSet、原 A5200／5210 與 F60。依使用者確認，5050 內註解的 recovery 入口保持停用；三個 states 以自動 fixture 驗證，不能在正常 gameplay 用 x+y 觸發，亦不宣稱人工 PASS。
- 610 原 Explod900 綁定角色、原 AIR 時間與層級、hitpause 凍結及 removeongethit 已接；新增原 S900,5／6 聲音。新增獨立 air atlas，原 atlas／原始來源不改；不啟用未完成 645。

人工請測：雙人／兩面向，原地跳及移動跳四招；空對地站防／蹲防、空對空不能防、Light／Medium 動畫、hitpause 後 XY travel、著地 52 聲音；空中受擊致死應落到 5150、不起身。630 原 AIR 攻擊盒較短，需靠近測，不能為方便命中擴大 Clsn。用 Scroll Lock 逐 tick 檢查受擊／transition 無倒跳，Pause/Break 繼續。

自動驗證：雙向四招／兩面向空對地及空對空實際碰撞、速度條件傷害／站蹲 guard／NoAirGuard 矩陣、空中 Common 鏈及 KO fall、recovery 來源 fixture、CMD Ctrl 限制、900 綁定與受擊移除；保留全部舊版回歸。接觸計時仍未人工 CHECK；GetHit／HitOver／HitShakeOver／HitVelSet 維持初步 TEST、待深測，不以自動結果代替人工驗收。

## 0.23.29 實作紀錄（使用者 PASS）

BUILD `trip-travel-debug-keys-m1-20261002-01`。使用者 0.23.28 其餘動畫修正 PASS；回報 5071→5110 的入口 tick 座標停住，本版修正並待人工驗收。

- 根因：fall controller 遇 ChangeState 提早 return，略過本 tick 最後的 X／Y velocity integration。改為停止舊 State controller 後仍完成一次位移；保留原 VelAdd 的重力結果，不再加第二次重力，PosFreeze 仍禁止移動。新 State 維持 Time=0／原尾格，下一 tick 才跑新 State controllers，因此不會重現 5070 E1／5170 E1，也不額外推進新 State 動畫。
- 圖中的 5071 VX(local)=-10、F=-1 對應 world VX=+10；VY=21.2 經原 yaccel=1.4 變成 22.6。切入 5110 當 tick 應再向後 X+10、向下 Y+22.6，而不是只改 VY 卻停在舊位置。原 5110 下一 tick 的 PosSet／VelSet 才落地。未改 AIR、440 velocity、鏡頭或資產。
- 新增 Debug 快捷鍵：Pause/Break（KeyboardEvent.code=Pause）等同 PLAY，恢復播放並清除待執行 STEP；Scroll Lock（code=ScrollLock）等同原 Pause／Step 按鈕，播放中先暫停，已暫停時再按只前進 1 tick。按住不 autorepeat；Settings 視窗／文字輸入／修飾鍵不觸發。Debug 鍵保留，不加入 P1／P2 自訂戰鬥按鍵。

自動驗證：雙 facing 切 5110 的當 tick gravity／XY travel，並保留前版尾格序列；實際 Pause／ScrollLock 鍵盤事件、loop 單步恰好 1 tick／無重播、按住不 repeat、Settings 隔離；原雙人掃腳／32 組 KO／全部回歸通過，無瀏覽器錯誤。待人工驗收。

## 0.23.28 實作紀錄

BUILD `trip-animation-continuity-m1-20261002-01`。修正 Trip 受身中多出的 A5070 E1／A5170 E1：ChangeState 進 fall states 保留原動畫 element、element tick 與 elapsed clock；只有原 ChangeAnim controller 才重置動畫。fall 動畫完成後保留尾格等待下一 tick 原 CNS AnimTime 切換，不先自動 loop 回第一格。原 AIR 時間不改，沒有插入新影格。

5071→5110 的入口維持 A5070 E4；5170 的尾格 E2 完成時仍維持 E2，下一 tick 原 controller 才改 5110。保留 440 velocity=-10,-18／-8,-18、KO、鏡頭及全部資產。本版待人工驗收，0.23.27 的 Trip 抽搐不標 PASS。

自動驗證：雙 facing 的 5071→5110 繼承 E4／動畫時鐘與 5170 尾格逐 tick 序列；原 8 組雙人掃腳、32 組 KO、HitFall、輸入／guard／跑跳／既有攻擊完整回歸通過，無瀏覽器錯誤。未改原 AIR 或 atlas，只更新本 README。

## 0.23.27 實作紀錄

BUILD `sweep-tuning-ko-fall-m1-20261002-01`。修正使用者 0.23.26 回報：440 飛起過高、200 打至 HP0 仍返回 S0。保留鏡頭及原資產。

- 只對 440 採使用者指定調整：`ground.velocity=-10,-18`、`air.velocity=-8,-18`。編譯器與 battle JSON 記錄 userOverrides；原 CNS 來源封存保持不改，其他招的 air.velocity 不受影響。未完成的空中命中路徑仍不標為已可人工測試。
- 普通命中致死按 IKEMEN 設 fall flag、fall animtype=Back。原 5000 選 5030 動畫、StateType=A，HitShakeOver 後走 `5000 → 5030 → 5035（視動畫時機）→ 5050 → 5100 → 5101 → 5110 → 5150`，不得回 S0／S11 或進 5120。440 仍保持 Trip 路徑，並非強迫改為普通 bounce。
- 補 player 預設 kovelocity：Venus CNS 沒有另設 KO velocity，所以採 IKEMEN 預設按 localcoord width=1280 放大。ground xmul=.66、add=(-10,-8)、ymin=-24；air add=(-10,-8)、ymin=-12（空中命中仍待接）。world X 按受擊方向加成；非零原 Y 保留並依引擎加成／鉗制，不能把所有招改成同一速度。原 200 ground.velocity=-16，致死 VX 為 ±20.56、VY=-24。
- 非受擊狀態發現 HP0 時按引擎 actionFinish 強制 5030、Time=1、ctrl=0，避免既有 S0／收招或起身狀態繼續操作。HitDef kill=0 保留 1 HP，不製造假 KO。5110 判斷不存活後留在 5150，完整 MatchOver／勝負回合流程仍未完成。

人工請測：200／210／230／240／400／410／430 打至 HP0 均跌倒且不再起身；P1、P2 與兩面向；440 非致死高度變低、蹲防仍可擋；440 致死依引擎另有 KO velocity，不等於非致死 -18。本版待人工驗收；前版問題不標 PASS。

自動回歸通過：雙玩家×雙 facing×八招共 32 組實際碰撞致死，檢查 HP0→5150、Y=0、不經 5120；200 KO 原速度計算、kill=0 留 1 HP、雙方 S0／HP0 的引擎強制 KO fallback；440 速度 override、原 Trip／bounce／HitFall 測試及既有完整回歸。無瀏覽器錯誤；並非人工 PASS。

## 0.23.26 實作紀錄

BUILD `sweep-fall-recovery-m1-20261002-01`。使用者 0.23.25 全 PASS；本版待人工驗收。按原 Venus CNS／CMD／AIR／SFF 加 440 蹲重腳，並接 Common 5070／5071、5030／5035、5050、5100／5101、5110、5120、5150。沿用鎖定鏡頭、attack.dist=640、hitshake x2、自訂鍵位及雙人共用 controller。

- 440：原 damage=70,0、guardflag=L、ground.type=Trip、pause=8/8、ground velocity=-10,-35、guard velocity=-32、air velocity=-8,-28、fall=1；hit 滑行／硬直 23／27、guard 24／34；cornerpush -28／-52。原 StateDef 無 velset，不強制清零；動畫、音效、收招與 CMD 完全採原來源。P1 下＋S；P2 Num5＋Num2（自訂按鍵以 Settings 為準）。站防會中，蹲防可擋。
- 必須分清兩條來源路徑：440 的 Trip 是 `5070 → 5071 → 5110 → 5120 → 11`；普通 falling 是 `5050 → 5100 → 5101 → 5110 → 5120 → 11`。不能把 Trip 強行改成普通彈地。KO 由 5110 進 5150，不起身。5150 原 priority=-3；MatchOver 尚無完整回合系統，保持 false，不假報比賽結束。
- 5070 原 ChangeAnim 每 tick 凍結動畫；5071 原 HitVelSet／GetHitVar(yaccel)，Trip groundlevel=60。5050 groundlevel=100；5100 保存 SysVar(1)、Y 歸零、PosFreeze／x*.75；5101 原 HitFallVel、bounce yaccel=1.6／groundlevel=48。5110 原 x*.85／friction threshold=.2；alive 的 liedown.time=20 計時依 IKEMEN 引擎規則進 5120，而非杜撰 CNS ChangeState。
- HitFallSet 更新 fall flag／指定速度；HitFallVel 只在 MoveType=H 套用，未指定 fall.xvelocity 保留 X，原引擎 default fall.yvelocity=-18；HitFallDamage 只消耗一次，fall.kill=0 不致死。FallEnvShake 只於來源 fall.envshake.time>0 啟動並消耗，保留引擎 freq／phase／mul／decay 的垂直震動，不改鏡頭校準。440 原未設定 fall.envshake.time，因此不擅自加畫面震。
- 5120／5150 的 SCA NotHitBy 保護；起身完成回 11，倒地不得當成站姿重新被 MA 命中。普通投技保護參數保留，但投技仍未實作。ForceFeedback 是實體控制器震動，本版未接硬件，不能誤當角色前後 hitshake。
- 原安裝 `data/common.snd` 的 F7,0／1／2 落地聲、`data/fightfx.sff`／`fightfx.air` 的 F60／61／62 地面衝擊已匯出；保持 F/common 與 S/Venus 命名空間分離，採原動畫時間、軸點、additive blend 及前後層級，無替代素材。新增獨立 fall atlas，既有角色 atlas 不改。

測試方向：P1／P2、兩面向、站防／蹲防；440 命中 70、擋住不扣血、Trip 落地起身；低血量再受 440 到 5150 不起身；角落左右測位移。5050／5100／5101 普通 falling 用來源參數自動 fixture 驗證，並非宣稱已能用尚未接入的空中攻擊觸發。完整空中命中／recoverable air reaction、spark S905、回合流程／MatchOver、硬件 ForceFeedback 仍未完成。

自動回歸通過：8 組雙玩家×雙 facing×命中／蹲防實際鍵盤 440；12 組 Trip／站蹲 guard／普通 bounce／KO；HitFallDamage 單次消耗、HitFallVel 默認保留 X／指定 XY、HitFallSet、非零 FallEnvShake 消耗／顯示／到期且不改鏡頭；原完整轉身、輸入、雙人 trade、guard、跑步後跳、站蹲攻擊回歸無瀏覽器錯誤。普通 bounce fixture 不是人工 PASS。

接觸計時仍未人工 CHECK；GetHit／HitOver／HitShakeOver／HitVelSet 維持「初步 TEST，待深測」。只更新本 README，不另建版本說明文件。

## 0.23.25 實作紀錄

BUILD `crouch-attacks-guard-levels-m1-20261002-01`。使用者 0.23.24 全 PASS。按原 CNS／CMD／AIR／SFF 加 400 蹲輕拳、410 蹲強拳、430 蹲輕踢，共用既有雙人 controller／命中 runner。原 StateDef 沒有 velset，不擅自清零入招速度；400 重複 priority 依最後有效值 `1, Hit`，不是前一行 3。

| State | Damage | GetHit | Hit 滑行／硬直 | Guard 滑行／硬直 | Hit／Guard VX | Pause |
|---|---:|---|---|---|---|---|
| 400 | 20,0 | Light／Low | 11／15 | 16／22 | -14／-14 | 8／8 |
| 410 | 100,0 | Medium／Low | 23／27 | 24／34 | -42／-42 | 8／8 |
| 430 | 30,0 | Light／Low | 11／15 | 16／22 | -16／-14 | 10／10 |

- 原 guardflag=L：站防會被這三招命中，蹲防可擋；H 只站防、L 只蹲防、M 兩者皆可。防禦分類來自 guardflag，並非 ground.type 的 High／Low；現有 200 等 M 招不能誤當只能站防。H 尚未有本切片原招使用，只以參數矩陣自動測試，不標人工 PASS。
- 站姿遭 Low／Light 選原 A5010→5015，Low／Medium 選 A5011→5016；蹲姿受擊按 IKEMEN 進 S5010／S5011，以 Common 選 A5020／5021→5025／5026、原 HitVelSet、crouch friction，最後回 S11。StateNo 與 AnimNo 不混用。新增原 S11 人類 CtrlSet 的入口評估，避免 10→11 同 tick 出現人工 ctrl=0 漏防。
- 原 CMD：按住下方向＋x／y／a →400／410／430；P1 下＋Z／X／A，P2 Num5＋Num0／Num.／Num1。原 Ctrl 或 400／430 的 MoveType=I 可蹲技重入；200／230 的 MoveType=I 只開原站技入口，不擅自讓它們接蹲技。410 收招 MoveType=I 不等於 Ctrl=1，因此不能任意重入。
- 入口依原 command 順序／holddown／StateType 判斷，不增造 MoveContact／MoveGuarded 的連招門檻：有無接觸都可以使用原指定的收招取消窗。命中 MoveContact=1、MoveGuarded=0；擋住兩者=1，hitpause 計時與切 state reset 沿用既有來源邏輯。
- 400／430 原 `AnimElem=5,2`／`4,2` 的鬆下提早回 S11 條件已支援（不是只判第一 tick）；410 原 AnimTime 完成回 S11。按住下保持蹲姿，P2 鬆下亦用 12 起身而非直接跳 0。音效沿用已匯出原 Venus WAV，無代用素材。

自動回歸：198 組來源數值／H-L-M guard／CMD 起招與重入門檻；雙玩家×雙 facing×三招×不防／站防／蹲防 36 組實際鍵盤命中，檢查 damage、GetHit 動畫、MoveContact／MoveGuarded；蹲受擊兩種動畫與 HitVelSet／回 S11、AIR element offset／鬆下提早收招；完整 0.23.24 回歸通過。人工待測：三招左右邊界／站蹲防、Light／Medium、400／430 收招接技及 200／230 原站技重入。接觸計時仍未人工 CHECK；GetHit 等初步 TEST、待深測的總體狀態保留。空中受擊／spark S905／完整 P2 CMD buffer 仍未完成；440 未接。

鏡頭、原 attack.dist=640、hitshake x2、既有鍵位 Settings 不變。Atlas 匯出器容量改為按需要擴展，不裁掉新動作或改 sprite axis／palette。

## 0.23.24 實作紀錄

BUILD `stand-attacks-jump-land-m1-20261002-01`。使用者 0.23.23 PASS。按原 CNS／CMD／AIR／SFF 接入 State 210／230／240 與相依 Action 241；State 52 原 Time=0 PlaySnd `52,0` 補回，不改 106。

- 210 強拳：原 damage=100、Medium／High、pause=8/8、ground velocity=-28、cornerpush=-46；原 AnimElemTime(4) 的 900,4 揮擊聲及 25% 200,1 聲音。
- 230 輕踢：原 damage=30、Medium／Low、ground velocity=-20、cornerpush=-32；原揮擊／機率語音。第 5 格後 MoveType=I，保留上方向→40、下方向→10 的來源取消條件。原 poweradd=11 留在 StateDef 並受原 Data power=0 上限約束，不自創能量條。
- 240 強踢：原 damage=100、Medium／Low、ground／guard velocity=-24、cornerpush=-32。第 3 格 Vy=-17.5、逐 tick 加 yaccel、StateType=A／physics=N；下降至 Y>=-10 回 S／S、轉 Action 241，當格 Vy=0／Y=0、播放 52,0，241 完成回 0。不用 State 52 代替原 241。
- StateType／physics 可由原 controller 動態改變；ChangeAnim 擁有獨立動畫起始時鐘，不把 241 誤當已播放整段 State 240。Medium／Low 依 Common 5000／5001 公式選原 5001／5006／5011／5016 等受擊動作，保留前版 Light／High 路徑。
- 四招共同使用原 CMD 人類入口與次序：x→200、y→210、a→230、b→240；不可蹲按、不可從空中起招；Ctrl 或 200／230 的 MoveType=I 可起招。AI 分支未啟用。未寫 guard.cornerpush 時按 IKEMEN 預設沿用 ground.cornerpush；Hit priority 數值比較保留，不因新招 priority=1 與 200 的 3 不同而卡死。
- 預設 P1：Z 輕拳、X 強拳、A 輕踢、S 強踢；P2：Num0／Num.／Num1／Num2。Settings 自訂鍵位繼續有效，l/r 暫留未接。

本版支援地面目標接觸。完整空中受擊／倒地 runner 仍未接入；空中目標只顯示 Clsn overlap，不套用錯誤的地面受擊 state（這是未支援能力的限制，並非原 IKEMEN 免疫規則）。air HitDef／var(3) 等來源保留，待空中受擊切片驗收；命中 spark S905 及完整 P2 CMD buffer／所有 Common 邏輯亦未宣稱完成。

自動測試：雙玩家×雙 facing×210／230／240×命中／站防，共 24 組；原傷害、240 離地／241 著地／回 0、230 上／下取消與跳後 52、52 聲音只播放一次，及完整前版回歸。人工待測：上述三招聲音／影格／Clsn、站防／蹲姿命中、角落推退、200／230 收招接強拳／踢與 240 著地。鏡頭、640 guard distance、hitshake x2 不變。接觸計時未 CHECK；GetHit／HitOver／HitShakeOver／HitVelSet 初步 TEST、待深測；range 待實際 state 接入驗收。

## 0.23.23 實作紀錄

BUILD `keyboard-settings-run-fx-m1-20261002-01`。補 State 100 腳步聲、105 原 Explod 909，重設雙人鍵位並加入 Settings → Keyboard。鏡頭、guard distance=640、hitshake x2、移動／命中規則不改。

- State 100 原 PlaySnd `100,0` 在 AnimElem 3／9 播放，每次 Action 100 循環都再觸發；雙方聲道分開。106 原 PlaySnd `52,0` 同步補上。兩個 WAV 都直接來自 Venus SND，沒有合成或代用聲音。更正上版分類：PlaySnd 未加 S 前綴不代表共用 SND，這兩項是角色音效。
- State 105 在原 `AnimElemTime(5)=0` 建立 Explod 909；原 AIR 四格各 2 ticks、原 SFF／palette／axis、P1-relative facing、vel=10,-5、sprpriority=3、ownpal=1。按 IKEMEN 預設 bindtime=1、removetime=-2；首 tick 綁 owner，之後獨立移動，8 ticks 完成移除，owner hitpause 暫停。只接此來源切片，不宣稱完整通用 Explod；106 MakeDust 仍未接。
- P1 移動：↑↓←→；x=Z、y=X、a=A、b=S、l=Q、r=W。WASD 不再作移動。
- P2 移動：Num8／Num5／Num4／Num6（上／下／左／右）；x=Num0、y=Num.、a=Num1、b=Num2、l=Num/、r=Num*。舊 J／L／U 不再控制角色，使用 physical event.code，不靠 NumLock 字元。
- 遊戲右上 Settings 開啟 Keyboard 設定：點鍵位再按新鍵、儲存／取消／恢復預設，保存在該瀏覽器。兩位玩家不可分配同一按鍵；開啟時暫停並清除 held input，關閉恢復原暫停狀態。現有原型主頁提供入口，未另造完整主選單。
- 鍵位已全部可設定及接收，不代表所有招式已完成：目前出拳仍是 x→State 200；P2 上／下及其他攻擊鍵的完整 CMD／招式 runner、l/r 來源命令映射仍待接入，不自行把 l/r 當 c/z。

自動驗證：雙人預設鍵位、取消舊移動键、重複鍵拒絕、設定儲存讀回／取消／預設；兩位玩家跑步第二圈音效及雙 facing 的 909 位置／速度／8-tick 壽命／hitpause／可見畫面，並跑完整既有回歸。人工待測：FF 持續跑時腳步聲、BB 的 909、106 著地聲，雙人 x 同時出拳及自訂鍵位重開仍保留。接觸計時仍未 CHECK；GetHit／HitOver／HitShakeOver／HitVelSet 初步 TEST、待深測；range 待實際 state 接入驗收。

## 0.23.22 實作紀錄

BUILD `run-backdash-land-m1-20261002-01`。0.23.21 防禦 transition 倒跳修正由使用者 PASS。按原 Common／CMD／AIR／SFF 接入雙方 State 100／105／106 動作切片，與既有 shared controller handlers 共用；controller 保留來源行號，AI 分支保留但 AILevel=0 不執行。

- 跑步：朝前快速點兩下（FF，原 CMD time=10）；第二下繼續按住，原 run.fwd.x=18 移動、Action 100 十二影格循環；鬆開前方向回 0，NoWalk／NoAutoTurn 保留，不會被普通行走覆蓋。
- 後跳：朝後快速點兩下（BB，time=10）；原 run.back.x=-30、run.back.y=-5，Time>0 加 yaccel×.625；105 為 physics N，但仍按原引擎移動座標。PrevStateNo=[200,440] 保留 X×1.02；原 CMD ctrl／命中取消／guard-slide 入口保留可用切片，未接入的 440／5070 不假裝可測。
- 105 facing 鎖定、ctrl=0、原每 tick NotHitBy SCA；現有 hit collision 不命中此 state。Action 105 四個 1-tick 影格後停在最後無限影格；Pos Y>2 轉 106，不改成一般 jump 的 State 52。
- 106 原 Action 106 為一個 3-tick 影格；原入口 VelSet／PosSet 令 X/Y 速度=0、Y=0，動畫完成回 0／ctrl=1。不借用原 Turn 或 guard 動畫。
- P1 使用方向鍵／WASD，P2 Keyboard 使用 J／L；全部前後方向相對 facing。兩次點按之間須鬆開；Keyboard repeat 不當第二次按鍵，失焦清除歷史。P2 這是 FF／BB 最小來源命令映射，不是完整 CMD buffer／redirect runner。
- S105,0 使用已匯出的 Venus 原 WAV。當時 100 腳步／106 著地音效、105 Explod 909、106 MakeDust 列入 deferredLocomotionEffects；前兩項當時誤判為共用音效，已於 0.23.23 核對及更正。

人工驗收待測：兩個 facing／兩位玩家分別 FF 持續跑／鬆鍵停止、BB→105→106→0、舞台左右邊界後跳、後跳中換位不翻身、106 著地無向前彈跳。保留 640 guard distance、hitshake x2、角落、互中與既有鏡頭。接觸計時未 CHECK；GetHit 系列初步 TEST、待深測的狀態不變。

自動測試 PASS：雙玩家×雙 facing 的實際雙點按入口、跑速／持續／鬆鍵、後跳初速／facing lock／著地停速／恢復 ctrl；原 prevstate 區間的 1.02 加成、105 NotHitBy；兩位玩家的 30／60／120 Hz 一致與左右邊界後跳不前彈；完整既有回歸通過，browserErrors=[]。全量 Common、P1 跑跳的額外 State 40 分支及所有 CMD 時序仍待後續，沒有以這個切片聲稱全部完成。

## 0.23.21 實作紀錄

BUILD `guard-transition-end-frame-m1-20261002-01`。修正 Action 120／121／140／141 在最後一個 tick 跳回第一格、下一 tick 才轉 state 的畫面抖動；一次性防禦 transition 保持最後格直到原 state 完成條件生效，不改 AIR ticks／素材／鏡頭或其他循環動畫。新增逐 tick element 序列檢查，不再只驗收最終 state。

重新核對 sources/venus/original/venus.cns 與作者本機角色檔案：Size attack.dist 都是 640，DEF localcoord=1280,720。使用者確認保留原 CNS 640；不自行缩成拳頭 Clsn 距離。圖中約 562／623 軸心距離在原 pre-guard 範圍內，拳頭未接觸仍會預防禦；實際命中另由 AIR Clsn 判定。

本版人工驗收待測：左右 facing 的站／蹲起防與收防，留意最後一格不再倒跳第一格；原範圍 640 不變。接觸計時未 CHECK；GetHit／HitOver／HitShakeOver／HitVelSet 初步 TEST、待深測的紀錄保留。

## 0.23.20 實作紀錄

BUILD `guard-distance-start-end-m1-20261002-01`。修正 Dummy 防禦選單把無攻擊的 P2 永久放入 guard 動作：站防未受威脅留 State 0；蹲防未受威脅留 State 11。只有對手 MoveType=A、同在地面且在攻擊者 facing-relative 前方 0 < 距離 < 640（原 Venus attack.dist）才進 State 120，站／蹲分別用原 Action 120／121；不是另創 State 121。

按原 AIR／SFF 匯入起防 120／121、收防 140／141。起防完進 130／131；對手停止攻擊、離開範圍或鬆開後防則進 140 收防，再回 0／11。Keyboard 後防亦使用此入口；hit／guard stun 不因失去距離而立即取消。640 是預防禦距離，不是拳頭 Clsn 實際命中距離；守備可在 HitDef 活躍之前的 startup 觸發。本切片僅地面 State 200，未宣稱空中／projectile／Helper GuardDist 完整支援。

人工驗收（本版待測）：Dummy 站防／蹲防下，雙方不攻擊應 S0／S11；遠距 X 應不擺防；進前方 640 範圍內 X 應起防；攻擊結束應收防；近距站防仍不扣 HP；兩邊換位置再測。接觸計時未 CHECK；GetHit／HitOver／HitShakeOver／HitVelSet 已初步 TEST、待深測；range 仍待實際 state 接入驗收，以上都未標為最終 PASS。

同時修正進入未指定 moveType 的 idle／普通 state 時錯誤繼承上一招 A 的問題，採用 StateDef 預設 I，避免停手後仍被視為攻擊。guard 起防／收防保留原 AIR ticks（6／5）。

本版自動測試 PASS：48 組雙 facing／站蹲／無攻擊或 startup／0、400、639、640、641、後方距離條件；原起防→維持→收防→idle 鏈及既有完整回歸通過，browserErrors=[]。這不是本版人工 PASS。

## 0.23.19 實作紀錄

BUILD `gethit-contact-semantics-m1-20261002-01`。0.23.18 已由使用者 PASS。

- MoveContact／MoveGuarded 從接觸的 1 開始，在非 hitpause 的邏輯 tick 增長；轉 state 重置。P2StateType 查詢對手，不共用自身資料。
- GetHitVar 支援本次地面切片的 animtype、groundtype、xvel、yvel、fall、slidetime、ctrltime、damage、guarded，以及 live hittime／hitshaketime；未知欄位明確報錯。
- HitShakeOver 是 hitshaketime <= 0；HitOver 是 hittime < 0，不是 <= 0。相較舊版，hitTime=0 時不提早恢復。
- Range expressions 支援 `[]`、`[)`、`(]`、`()`，以及 `=`／`!=`；保留原 Common 的 GetHitVar(animtype) != [3,5] 語法，不以文字替換近似。
- HitVelSet 使用原 Venus Common 的 State 151／153／5001 controller 與 Time=0 trigger；X 接通 IKEMEN world GetHitVar(xvel) → facing-relative controller velocity，Y 不乘 facing，0 不修改該軸。
- Guard CtrlSet 使用獨立 ctrltime（原 HitDef 未指定時按 IKEMEN default 使用 guard.slidetime），不混用滑動或受擊完成時間。
- 保留同步 X／U 出拳、State 200 equal-priority Hit 互中、CLSN、hitshake x2、角落推退、Turn 5／6、空中 facing lock 及鎖定鏡頭。

範圍仍是 Venus-vs-Venus 地面 State 200。尚未完成全量 Common runner、所有 GetHitVar 欄位、完整 CMD／取消鏈、空中受擊、其他 hit priority／投技／Projectile／Reversal、KO／round／AI。支援 trigger 不代表全量角色已完成。

## 控制與驗收

- P1：方向鍵移動，x=Z、y=X、a=A、b=S、l=Q、r=W；WASD 不移動。P2：Num8／5／4／6 移動，x=Num0、y=Num.、a=Num1、b=Num2、l=Num/、r=Num*；不再使用 J／L／U。Settings 可自訂，亦可切回 Dummy。
- Input 可選 Auto／Keyboard／Touch；失焦清除 held input。右上 □ 顯示 CLSN，Ⅱ 暫停／逐 tick，↓ 匯出最近 600 ticks 診斷 JSON（非 replay save）。
- 更新後確認 Prototype／READY=0.23.33、BUILD=`crouch-exit-end-frame-m1-20261002-01`。本版測試方向見最上方；Pause/Break 播放，Scroll Lock 暫停／逐 tick，Space 回復雙方 HP／KO 起身。
- 自動回歸使用 `tools/check-runtime.cjs`；Node、Playwright／Edge、遊戲資料與既有 Three.js CDN 需要可用。本次新增 range 邊界、hit timers、HitVelSet facing／axis masks、接觸計時及 pause／reset 檢查。
- 本版自動測試 PASS：40 組 range 邊界、兩個 facing 的 GetHit／HitVelSet／未知欄位拒絕、接觸 pause／reset，以及既有 448 組 expression parity、雙向 hit／guard／corner、同時 X／U／互中、鍵盤／CLSN／Turn／30-60-120 Hz 回歸；browserErrors=[]。瀏覽器人工驗收待使用者測試。

## 0.23.19 驗收清單

使用者更新：接觸計時未 CHECK；GetHit／HitOver／HitShakeOver／HitVelSet 已初步 TEST，待深測；range 尚未人工驗收。保留上方自動測試紀錄，不把自動測試或初步 TEST 當作最終 PASS。部分只有底層 evaluator 測試，不能靠目前出拳畫面驗收完整語義。

| 項目 | 目前接線／限制 | 人工驗收方法與預期 | 狀態 |
|---|---|---|---|
| 接觸計時 MoveContact／MoveGuarded | State 200 有接觸記錄與 query；HUD 未直接顯示這兩個 counter。 | P2 Dummy 不防禦：近距離 X 命中；站防再 X；拉遠 X 揮空。命中 contact=1、guarded=0；防禦兩者=1；8 ticks hitpause 不增長，之後增長，轉 state 清零。精確 counter 要用 ↓ trace 的 moveContact／moveGuarded 核對，單看 HP 不足。另需 P2→P1 對稱驗收。 | 未測試／未 PASS |
| GetHitVar 查詢 | ground slide 用 slidetime／ctrltime；HitVelSet 用 xvel。部分欄位只提供查詢，未由可玩 state 消費；現有 trace 的 getHit 是記錄，不是每個 GetHitVar 呼叫的回傳值。 | X 打 P2，再用 U 打 P1，雙方換邊各做 hit／stand guard；↓ 核對 attackerId、世界 xvel（hit ±16／guard ±24）、slidetime（11／16）、初始 hittime（15／22）。live hittime／hitshaketime 及其他欄位需 evaluator 診斷，不能以 getHit.hittime 靜態值驗收倒數。 | 初步 TEST／待深測，未最終 PASS |
| HitOver／HitShakeOver | 目前 ground reaction handler 已呼叫 evaluator；尚不是全量 Common controller runner。 | 用 Ⅱ 暫停／逐 tick：命中後 shake 結束才進 slide（5000→5001；站防 150→151），slide 結束後恢復。精確邊界：shake=0 為真，hittime=0 的 HitOver 仍是假、-1 才真；HUD 沒有 timer，邊界仍需診斷／自動測試，肉眼只能驗收動作鏈。 | 初步 TEST／待深測，未最終 PASS |
| range expressions | AST 支援四種端點；原 Common range controllers 尚未接入完整 runner。現有可玩 State 200 不足以驗收所有 range。 | 暫無完整玩家操作測法，保留未驗收。底層測試在 0／2 邊界與區間內外核對 []、[)、(]、() 及 !=；待含 range 的原始 controller 真正接入後再做遊戲驗收，不為測試新增猜測 state。 | 未測試／未 PASS；待實際 state 接入 |
| 來源 HitVelSet | 原 State 151／153／5001 的 Time=0、x=1 controller 已接入；Y／axis mask 只做底層測試，空中受擊未接入。 | 雙方換邊測 X／U 命中與站防：slide 只在入口套速度，受擊者向遠離攻擊者方向退，不每 tick 重設、不突然前移。角落另測 attacker cornerpush。153 可用 P2 Dummy 蹲防作條件測試，但若原 AIR Clsn 令拳揮空，不能聲稱測到該 state，保留待測；Y／空中分支待可用原 state。 | 初步 TEST／待深測，未最終 PASS |

建議順序：先雙向 hit／stand guard／whiff → 左右換邊 → 暫停逐 tick 的受擊鏈 → 角落 → ↓ 匯出異常 trace。看不到的 counter／timer／range 端點留待診斷頁或原 state 接入，不能因「打拳正常」就把全部項目 PASS。

## 檔案整理及往後更新規則

根目錄唯一維護文件為本 README；往後版本更新、測試結果與 TODO 都更新此檔，不再新增 NOTES／版本 README。`DUMP/` 保留舊 notes、TODO、來源盤點及相機／上傳說明，另封存明確過時的 apply_0190.py。搬移保留原 blob，不刪除歷史資料。

遊戲必需的 index.html、GLB、atlas、JSON、音效仍保留原路徑；`tools/` 與 `sources/` 仍是有效開發工具／來源，不當成垃圾搬移。根目錄不是只剩一個檔案，以免 GitHub Pages 與遊戲載入失效。未證明不再使用的 compatibility／compiler／舊素材暫保留，不憑檔名猜測。

## 來源與固定規則

來源在 `sources/venus/`：原 CNS／CMD／AIR／Helper、manifest、state／AIR inventory 及 source audit。完整 SFF／SND 保留本機來源包；尚未宣稱全量匯出上線。

本版對照 IKEMEN [char.go](https://github.com/ikemen-engine/Ikemen-GO/blob/develop/src/char.go) 的 moveContact／moveGuarded、hitOver／hitShakeOver、GetHitVar world velocity／guard ctrltime default，以及 [bytecode.go](https://github.com/ikemen-engine/Ikemen-GO/blob/develop/src/bytecode.go) 的 range、GetHitVar 與 HitVelSet。兩邊目前同為 1280 localcoord；未實作不同 localcoord 的 redirect scaling。

鏡頭 zoom=1.86、ground=660、camera X ±2850、player world ±3750 不變。視覺 hitshake x2 是使用者 override，不是原引擎原始幅度。空中不可防禦。122,0／951,99 為刻意空影格；645／投技未完成，保留參考；175／5500 未完成，沿用 lose/default fallback。

## TODO：完整 Venus Web 化

- [x] 原始來源盤點／SHA-256、133 AIR actions、SFF／SND directory、來源缺口及作者確認；67 個 WAV 原樣匯出（未全量接入播放）。
- [x] State 200 地面 hit／guard／hitpause／恢復、cornerpush、CLSN／HUD、turn／facing、input／diagnostic trace。
- [x] 兩邊共用 AST／controller handlers，P2 地面行走／後防／U 出拳，同 tick equal-priority 地面拳互中。
- [ ] GetHit／HitOver／HitShakeOver／source HitVelSet 已初步 TEST、待深測；接觸計時未 CHECK；range 待實際 state 接入。均未最終 PASS，逐項按上表驗收。
- [ ] 全量 SFF 分批 atlas／metadata：linked sprites／palettes／透明度／axis／AIR flips／Clsn default。
- [ ] 動態／外部 source references 追至 Helper／CMD；全量未知 controller／trigger／expression 報告。
- [ ] P1／P2 完整共同 fighter／Common runner；source controllers 逐條移除近似實作、timer／動畫 clock 與順序驗證。
- [x] 0.23.23 使用者 PASS：雙方 100／105／106、原跑步／著地聲、909 與鍵位設定；106 MakeDust 仍待接入。
- [x] 0.23.24 使用者全 PASS：210／230／240／241、52 著地聲；完整空中受擊仍未支援。
- [x] 0.23.25：400／410／430、High／Low guard 及蹲姿 Light／Medium GetHit，使用者全 PASS。
- [ ] 0.23.26：440／Trip、普通 falling／bounce、倒地／起身／KO 與 HitFall controllers 已接入，待人工驗收；完整空中攻擊與空中命中另列後續。
- [ ] 0.23.27：依回報調低 440 速度，補普通命中致死／HP0 強制 KO 跌倒；待人工驗收，不把 0.23.26 問題標 PASS。
- [ ] P1 跑跳 State 40 額外來源分支、全量 -1 未接入必殺／超必殺、-2／-3、可重播 input／state trace；P2 蹲／跳已接。
- [x] 0.23.31 使用者 PASS：600／630 LoopStart、雙方回血／Space 與 KO 起身。
- [ ] 0.23.32：雙人 command time／buffer、MoveHit／MoveContact／MoveGuarded、來源普通技重入／取消與可用玩家 -1 已接入，待人工驗收；必殺／投技來源 controller 保留 deferred。
- [ ] 0.23.33：A12 結尾誤回圈修正，雙人兩面向逐 tick 自動驗證，待人工驗收；0.23.32 其他項目使用者暫時 PASS，深測標記不變。
- [x] 0.23.29 使用者 PASS：Trip 動畫連續性／ChangeState tick travel、普通 KO 跌倒、Pause／Scroll Lock debug。
- [ ] 0.23.30：600／610／630／640、5020／5030／5035／5040／5050 已接入，待人工驗收；5200／5201／5210 已完成來源 fixture，recovery 入口按原註解停用。
- [ ] 其他普通技與各種 HitDef priority，按來源相依順序接入。
- [ ] Helper／Explod／Projectile／Pause／SuperPause、完整音效 channel／pause 語義、必殺技／能量／無敵／特效。
- [ ] Intro／win／taunt／KO／round／AI、完整招式表；每招與原 IKEMEN 並排比對、手機性能／输入回歸。

下個切片：驗收 0.23.41 裁切／HP／Timer，然後接真正 5900→Intro→RoundState→KO/TimeOver→Win/Lose→下一回合，再完成 Powerbar／姓名／勝利圖示與 AI 驗收。普通必殺技與 command buffer 已接入，不再當成下一個待做切片。未完成 645／投技繼續只作參考，不啟用註解 recovery 入口。

## 0.25.86 — Indexed RemapPal consumers (partial, release pending)

RemapPal now reaches actual indexed drawing, recipient palette ownership and recorded root-afterimage sources. Saturn preloads all 521 indexed battle sprites; 53 truecolor sprites retain their original path. Twenty-four actual ownership/drawing cases, all indexed pixel checks and forty controller-specific scheduling groups pass. Remaining character assets, native formats/versions and complete controller semantics remain unfinished. Final versioned regression and verified publication are pending; original SFF/SND files are not included.

