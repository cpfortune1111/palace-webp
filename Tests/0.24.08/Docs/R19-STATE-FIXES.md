# r19：Moon S801／Neptune S140、S20

## Moon Headbutt S801

用戶 trace 中，Moon 在 S801 VX=0 仍每tick位移約11。TargetBind 令 target 固定距離106，但兩人的 ground size 合計大於106；舊 Web 每幀又做 body push，將兩人推開，再重新 bind，造成持續漂移。今次在有效 TargetBind 綁定期間，跳過該對角色之間嘅 body push；不擅自改 VX，不改原 Throw timeline、TargetBind offset 或原 Width edge。仍保留 stage/screen clamp。綁定完結後恢復互推。

兩邊玩家、左右方向、中央及近 stage edge 共8個測試，各在綁定期間抽樣97幀，初始Width edge clamp完成後持續位移為0。正常未綁定角色繼續使用舊 body push。

## Neptune Guard End S140

S140 在原 common 文件沒有 ChangeState，這本身不屬於原檔缺漏。固定版本 IKEMEN GO src/char.go actionFinish 會在 S140 動畫結束後，自動轉到 standing0、crouching11 或 aerial51。舊 Web 的 Neptune source-state 執行路徑繞過了原有 generic guard-exit fallback，導致停在140。

今次在 source-state controller 執行後補上對應 engine transition。角色可以先由其 controller 轉走；不以任意timeout強制S0。也正確處理 StateDef type/physics=U 作為「保持原設定」，避免 P2 退防時丟失 crouching type。

站防、蹲防及P1/P2均驗證動畫結束後正常進入0/11、CTRL=1。完整空中防禦仍屬既有相容性限制，今回沒有宣稱完成。

## Neptune SNES Recovery Walk S20

trace 顯示 P1 由 S230 T11/12 直接轉到 S20，CTRL仍為0。來源為 neptune.cmd 約911行的 `[State -1, SNES PLAYER Recovery Walk]`：它在 S200/230、MoveType=I 且按住水平鍵時，執行 ChangeState20，但沒有指定ctrl；S20亦沒有human用的CtrlSet，所以繼承攻擊期CTRL=0。舊P2入口碰巧另有ctrl1處理，令問題更易只在P1出現。

Web 僅在這條已復原的SNES walk cancel路徑加 `ctrl=1`；不把全部S20或所有state強制設成可控制，不更改 AI 指定控權的邏輯。恢復自動轉身及離開行走後的正常操作。

本機原檔未改。若要同步原IKEMEN檔，為該條特定controller加一行：

```ini
[State -1, SNES PLAYER Recovery Walk]
type = ChangeState
value = 20
ctrl = 1
; 保留原有全部 triggerall / trigger1
```

## 保留

今次只更新試玩版。r18音效channel規則、Lightning Strike6tick節奏、圖像及壓縮素材保持原樣；沒有重新接入3DO、WASM或修改本機人物原檔。
