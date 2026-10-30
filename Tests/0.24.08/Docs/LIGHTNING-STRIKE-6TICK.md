# Lightning Strike：6 TICK 防禦間隔（r18）

Web 已量度防禦接觸於第 1、7、13 tick，三次後按原流程進 S3007。以下為對應原檔修改建議；沒有直接修改本機原檔。原生 IKEMEN 尚未實機跑此修改，下面是按其 controller 執行順序寫法，最終請以實際 contact tick 核對。

原招式 H3050 使用 `pausetime = 0,8`，沒有 `guard.pausetime`，所以防禦亦繼承8tick shake。Web 更誤將被防禦 HitDef 的 `fall = 1` 放入守方 getHit，下一擊 `hitflag = MAP` 沒有 F 而被阻擋；r18已修正 guard 的 fall=0。這是 Web 的錯誤，不用為此修改原 HitDef 的 fall/hitflag。

`guard.pausetime` 控制停頓，唔係兩次命中間隔。要固定6tick，用 contact timestamp gate，並避免8tick防禦停頓長過間隔。參考：[Elecbyte HitDef / guard.pausetime 文件](https://www.elecbyte.com/mugendocs-11b1/sctrls.html#hitdef)。

以下沿用原本 `var(47)` 三次防禦計數。`var(39)` 在今次核對的 Jupiter 頂層 CNS/CMD/Common/Helper 沒有使用，這份寫法會將它保留作最後防禦接觸時間；如之後另有用途應換一個空閒變數。不要改動原有 var(49)。

## 1. S3006：放在生成 Helper 之前

```ini
[State 3006, Initialize guard contact clock]
type = VarSet
trigger1 = Time = 0
v = 39
value = GameTime - 6
```

## 2. 原本生成 H3050 的 Helper controller：增加一項條件

保留原本 helpertype/name/ID/stateno/pos 等所有參數，只將 trigger 部分改成：

```ini
triggerall = GameTime - var(39) >= 6
trigger1 = !NumHelper(3050)
trigger1 = var(47) < 3
```

## 3. H3050：HitDef 加一行

```ini
guard.pausetime = 0,0
```

保留原本 `pausetime = 0,8`，所以真正擊中時仍有原來停頓，只有防禦時改為不停止。這裏不是設定 `guard.pausetime = 0,6`，因為停頓6tick並不等於精確重擊間隔6tick。

## 4. H3050：在 DestroySelf 之前記錄上一次接觸時間

```ini
[State 3050, Record guarded contact]
type = ParentVarSet
trigger1 = MoveGuarded
v = 39
value = GameTime - 1
persistent = 0
ignorehitpause = 1
```

這裏 `GameTime - 1` 是因為 collision 後，要到下一次執行 controller 才觀察到 MoveGuarded。若原生版本執行順序不同，請記錄 contact ticks 後校準這一處。原有 ParentVarAdd `v = 47, value = 1, persistent = 0` 保持。

## 5. H3050：取代原本共用 Time > 5 的 DestroySelf

```ini
[State 3050, Guarded helper finished]
type = DestroySelf
trigger1 = MoveGuarded
ignorehitpause = 1

[State 3050, Parent left Lightning Strike]
type = DestroySelf
triggerall = Time > 5
trigger1 = root,StateNo != 3006
```

間隔交由 S3006 的時鐘控制，唔再靠 helper 多留幾tick。離場、未接觸、暫停或雙方位置已分開時，不保證有第三次接觸；6tick是下一擊允許重新接觸的間隔，不應隔空強制造成三次傷害。

## Web 相消與音效修正

- helper 的 projectile-class HitDef（`*, *P`）與 Projectile 會在傷害套用前比較；前者用 `priority`，後者用 `projpriority`。Lightning Strike 6 對 Supreme Thunder 3，後者取消，前者不進3051。普通 root melee helper HitOverride 仍按 HitBy / NotHitBy 及 priority 檢查，沒有改成無敵。
- Equal priority Hit/Hit 會雙方取消；Miss/Dodge tie 依原 priority resolver。這是本試玩版對 helper projectile 的相消實作，不是宣稱完成所有原生 helper 交互。
- channel1新聲不再自動截斷舊聲；角色真正受擊只停自己 channel0，防禦不會停。明確 StopSnd channel1 仍停止該角色所有尚未完結的 channel1音效；換局也會清理。
- 主頁 Enter及X/Y/A/B對應鍵均可確認模式，長按不會連續觸發。
