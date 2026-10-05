# Venus Helper / Explod coverage audit

Static source/controller/asset audit; not a complete gameplay reachability test.

## Outstanding source effects

- F936/F937: TsukinoAi+ NORMAL/AUTO intro logos are absent from the web round-effects pack; spawnSourceExplod silently returns for missing F animations. These are not Saturn logos.
- F60/F61/F62: source ground-impact effects in S5100/S5110/S5201 are absent from the web round-effects pack. Literal F60 is silently skipped; the dynamic F(60 + ...) expression is not handled by the F-number dispatch.
- Character AIR 906 and 9061 both exist, covering both branches of the conditional S1200 Explod.
- No other Helper spawn controller or numeric character Explod animation is missing from compiled metadata/assets. This does not prove every trigger, binding, transparency, or gameplay path works correctly.

Missing literal fight animations: F936, F937, F60

## HPBarHelper 950

Original spawn requires NumPartner, and the helper only defines team slots (1–3 partners). Web 1v1 previously never displayed it. The web HUD now renders the original Venus AIR 950/951/952 sprites beside both HP bars. 951 overlays 950 at Life <= LifeMax/4, matching the source super-readiness condition; KO replaces both with 952. Healing/revival removes the KO overlay. Intentional blank frame 951,99 is preserved. Other characters need their own CNS/AIR/SFF emblem assets before this can be generalized; this change does not substitute Venus symbols for other characters.

## Interpretation

Compiled controllers are not necessarily reachable. Missing numeric character AIR means no equivalent source animation is packed, even if its controller is compiled. F-prefixed animations use the fight pack and must not be counted as missing character assets. Conditional expressions need individual branch checks. Helper states 915,925,950,9999 and 3050,3051,3052,3055,3056 exist in the compiled runtime.

| Source | State | Type | Reference | Controller coverage | Asset coverage |
|---|---|---|---|---|---|
| venus.cns:924 | 610 | Explod | anim = 900; id = 900 | compiled (not proof of reachability) | character AIR present |
| venus.cns:1132 | 1000 | Explod | anim = 901; id = 901 | compiled (not proof of reachability) | character AIR present |
| venus.cns:1145 | 1000 | Explod | anim = 901; id = 901 | compiled (not proof of reachability) | character AIR present |
| venus.cns:1157 | 1000 | Explod | anim = 9011; id = 9011 | compiled (not proof of reachability) | character AIR present |
| venus.cns:1284 | 1100 | Explod | anim = 903; id = 903 | compiled (not proof of reachability) | character AIR present |
| venus.cns:1295 | 1100 | Explod | anim = 9042; id = 9042 | compiled (not proof of reachability) | character AIR present |
| venus.cns:1404 | 1200 | Explod | anim = cond(var(2) = 1, 9061, 906); id = 906 | compiled (not proof of reachability) | conditional AIR: review |
| venus.cns:1607 | 3000 | Explod | anim = 4001; id = 4000 | compiled (not proof of reachability) | character AIR present |
| venus.cns:1618 | 3000 | Explod | anim = 4000; id = 4000 | compiled (not proof of reachability) | character AIR present |
| venus.cns:1732 | 3005 | Helper | ID =  3050; stateno = 3055 | compiled (not proof of reachability) | helper state |
| venus.cns:1745 | 3005 | Helper | ID =  3050; stateno = 3050 | compiled (not proof of reachability) | helper state |
| venus.cns:2339 | -2 | Explod | id = 930; anim = F930 | compiled (not proof of reachability) | fight AIR / expression: review |
| venus.cns:2355 | -2 | Explod | id = 931; anim = F931 | compiled (not proof of reachability) | fight AIR / expression: review |
| venus.cns:2371 | -2 | Explod | id = 932; anim = F932 | compiled (not proof of reachability) | fight AIR / expression: review |
| venus.cns:2387 | -2 | Explod | id = 933; anim = F933 | compiled (not proof of reachability) | fight AIR / expression: review |
| venus.cns:2403 | -2 | Explod | id = 934; anim = F934 | compiled (not proof of reachability) | fight AIR / expression: review |
| venus.cns:2419 | -2 | Explod | id = 935; anim = F935 | compiled (not proof of reachability) | fight AIR / expression: review |
| venus.cns:2435 | -2 | Explod | id = 936; anim = F936 | compiled (not proof of reachability) | fight AIR / expression: review |
| venus.cns:2451 | -2 | Explod | id = 937; anim = F937 | compiled (not proof of reachability) | fight AIR / expression: review |
| venus.cns:2546 | -2 | Helper | ID = 9999; stateno = 9999 | compiled (not proof of reachability) | helper state |
| venus.cns:2671 | -3 | Helper | stateno = 915; id = 915 | compiled (not proof of reachability) | helper state |
| venus.cns:2688 | -3 | Helper | stateno = 925; id = 925 | compiled (not proof of reachability) | helper state |
| venus.cns:2705 | -3 | Helper | stateno = 950; id = 950 | compiled (not proof of reachability) | helper state |
| venus_Common.cns:527 | 105 | Explod | anim = 909; id = 909 | compiled (not proof of reachability) | character AIR present |
| venus_Common.cns:1645 | 5100 | Explod | anim = F(60 + (sysvar(1) > Const720p(20)) + (sysvar(1) > Const720p(56))) | compiled (not proof of reachability) | fight AIR / expression: review |
| venus_Common.cns:1774 | 5110 | Explod | anim = F(60 + (sysvar(1) > Const720p(20)) + (sysvar(1) > Const720p(56))) | compiled (not proof of reachability) | fight AIR / expression: review |
| venus_Common.cns:2010 | 5201 | Explod | anim = F60 | compiled (not proof of reachability) | fight AIR / expression: review |
| venus_Helper.st:11 | 915 | Explod | id = 916; anim = 916 | compiled (not proof of reachability) | character AIR present |
| venus_Helper.st:26 | 915 | Explod | anim = 919; id = 919 | compiled (not proof of reachability) | character AIR present |
| venus_Helper.st:40 | 915 | Explod | anim = 917; id = 917 | compiled (not proof of reachability) | character AIR present |
| venus_Helper.st:54 | 915 | Explod | anim = 918; id = 918 | compiled (not proof of reachability) | character AIR present |
| venus_Helper.st:69 | 915 | Explod | anim = 915; id = 915 | compiled (not proof of reachability) | character AIR present |
| venus_Helper.st:125 | 925 | Explod | id = 926; anim = 926 | compiled (not proof of reachability) | character AIR present |
| venus_Helper.st:140 | 925 | Explod | anim = 929; id = 929 | compiled (not proof of reachability) | character AIR present |
| venus_Helper.st:154 | 925 | Explod | anim = 927; id = 927 | compiled (not proof of reachability) | character AIR present |
| venus_Helper.st:168 | 925 | Explod | anim = 928; id = 928 | compiled (not proof of reachability) | character AIR present |
| venus_Helper.st:183 | 925 | Explod | anim = 925; id = 925 | compiled (not proof of reachability) | character AIR present |
| venus_Helper.st:242 | 950 | Explod | id = 950; anim = 950 | HUD adaptation | character AIR present |
| venus_Helper.st:258 | 950 | Explod | id = 951; anim = 951 | HUD adaptation | character AIR present |
| venus_Helper.st:272 | 950 | Explod | id = 952; anim = 952 | HUD adaptation | character AIR present |
| venus_Helper.st:286 | 950 | Explod | id = 950; anim = 950 | HUD adaptation | character AIR present |
| venus_Helper.st:302 | 950 | Explod | id = 951; anim = 951 | HUD adaptation | character AIR present |
| venus_Helper.st:316 | 950 | Explod | id = 952; anim = 952 | HUD adaptation | character AIR present |
| venus_Helper.st:330 | 950 | Explod | id = 950; anim = 950 | HUD adaptation | character AIR present |
| venus_Helper.st:346 | 950 | Explod | id = 951; anim = 951 | HUD adaptation | character AIR present |
| venus_Helper.st:360 | 950 | Explod | id = 952; anim = 952 | HUD adaptation | character AIR present |
| venus_Helper.st:375 | 950 | Explod | id = 950; anim = 950 | HUD adaptation | character AIR present |
| venus_Helper.st:391 | 950 | Explod | id = 951; anim = 951 | HUD adaptation | character AIR present |
| venus_Helper.st:405 | 950 | Explod | id = 952; anim = 952 | HUD adaptation | character AIR present |
| venus_Helper.st:420 | 950 | Explod | id = 950; anim = 950 | HUD adaptation | character AIR present |
| venus_Helper.st:436 | 950 | Explod | id = 951; anim = 951 | HUD adaptation | character AIR present |
| venus_Helper.st:450 | 950 | Explod | id = 952; anim = 952 | HUD adaptation | character AIR present |
| venus_Helper.st:465 | 950 | Explod | id = 950; anim = 950 | HUD adaptation | character AIR present |
| venus_Helper.st:481 | 950 | Explod | id = 951; anim = 951 | HUD adaptation | character AIR present |
| venus_Helper.st:495 | 950 | Explod | id = 952; anim = 952 | HUD adaptation | character AIR present |
| venus_Helper.st:574 | 3050 | Explod | anim = 9080; id = 9080 | compiled (not proof of reachability) | character AIR present |
| venus_Helper.st:586 | 3050 | Explod | anim = 9081; id = 9081 | compiled (not proof of reachability) | character AIR present |
| venus_Helper.st:652 | 3051 | Explod | anim = 9081; id = 9081 | compiled (not proof of reachability) | character AIR present |
| venus_Helper.st:679 | 3052 | Explod | anim = 9082; id = 9082 | compiled (not proof of reachability) | character AIR present |

