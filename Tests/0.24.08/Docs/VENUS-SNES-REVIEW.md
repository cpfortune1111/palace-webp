# Venus SNES 差異結果 — 0.24.08-r22

按「Web 已做到原效果就算接入」核對，不要求改成 WASM／通用 IKEMEN。原檔保持不變。只列本次更新、需作者決定及沿用停用項；**State 指個別 controller 段落，不是整個 StateDef**。

四份原檔共 **7,064 行、653 個 controller**。初步資料比對 478 段相同、165 段需人工判斷、10 段非 SNES；文字不同不直接判為 BUG。已同步近期 AI／Common／CMD 更新，並保留現有專用戰鬥及 HUD 執行方式。

## 今次已同步及補回

- S1000／S1100／S1200 的 AI L/H 強度選擇；SNES AI 的距離、節奏、擋格、跳躍及招式條件。
- 普通／AUTO 招式取消及 Recovery 輸入；Recovery Walk 沿用先前確認的 `ctrl = 1`，跳躍等起手不強行加 Ctrl。
- S0／S10／S11／S12／S20／S40／S50／S51／S52／S57 原 Common controller；S20 AI 行走邏輯只執行一次，不與舊 aiWalkControllers 重複。
- 防禦與受擊退出：S120／S130／S131／S132／S140／S150–155；S5000／S5001／S5010／S5011／S5080／S5081。保留原 `HitShakeOver`、`HitOver`、`GetHitVar` 及玩家／AI 分支。
- 原 SNES AI Dash Back 允許在 S151／S153 擋格硬直決策；共用 AI 執行器不再先把這兩個合法分支擋掉，其餘受擊仍不能任意出招。
- S106 的 `MakeDust`；S175 同步原本直接回 S170 的段落（舊 fallback 因沒有 A175 亦會回 S170，並非整招未接）。
- 補 `TimeElapsed` 真實回合有效 tick；有限／無限時間均累計，暫停不增加。`TimeRemaining` 保持有限倒數／無限 -1。
- 新起跳音效 `S40,1` 已抽出及壓縮，戰前下載／解碼。S52 著地聲只留一個執行位置。
- 補 11 個原 AIR Action 及需要的 14 張 Sprite，合併到現有 reactions 素材；新增 WebP 約 189KB。包含空中防禦空白格、倒地受擊／反彈變體。A645 沿用未完成停用，A9089 的負數 Sprite 依原 AIR 保持空格。

## 共用 Helper：五角色統一

以目前 `venus_Helper.st` 為準，Venus／Moon／Jupiter／Neptune／Saturn 的 S915／S925／S950／S951 已同步到各個實際查找表（states／helperStates／lifecycleHelpers）。Helper 9999 保留。

- S915／S925：一般、受傷、低 HP、勝／敗頭像及 RemoveExplod 條件；防禦 S120–159 不顯示受傷頭像。已測 P1/P2。
- S950：沿用現有 Lifebar 等效繪製，SNES 單人隊伍位置 P1=(180,85)、P2=(1100,85)，正常／無 HP 角色標保持一份，**不重新產生第二個 H950**。原 TeamSize／PlayerNo 公式保存在共用資料，今次遊戲仍是 1v1。
- S951：已按作者確認，**有 A953 用 A953，沒有用 A951**。五角由現有 HUD 統一實現原低 HP／回合時段判斷，不依賴各原檔有沒有召喚 H951 的入口。提示啟用時各播自己已預載的 S980,0 一次；持續有效時不重播，死亡／條件失效時移除提示。用 channel4 所有權，不當作人聲 channel0 被受擊中止。

## r23 作者確認：SNES 超必條件統一

五角玩家／AI及共用輸入副本已統一為 `Life <= LifeMax/4 || TimeRemaining = [0,TimeElapsed / 5]`，與提示亮起條件一致。Moon／Neptune AI 額外的純低血量限制亦已合併，避免時間條件被另一個 triggerall 擋住。保留各招距離、取消、AI機率等其他條件。原檔沒有直接改寫；此為作者確認的 Web 規則更新。

Helper951 四段由同一 HUD 效果及提示音生命週期等效處理；原 anim=953 保留，依作者指示有A953用A953、沒有則用A951。

## 本次更新的個別 controller

下表包括新同步資料及原效果的整理，不代表之前全部沒有功能。包括作者已確認的 S951 fallback／HUD 等效處理。

|原文件／行|Controller State|本次結果|
|---|---|---|
|`venus.cns:1079`|`[State 1000, VarSet]`|已同步原 SNES AI 強度選擇|
|`venus.cns:1216`|`[State 1100, VarSet]`|已同步原 SNES AI 強度選擇|
|`venus.cns:1335`|`[State 1200, VarSet]`|已同步原 SNES AI 強度選擇|
|`venus_Common.cns:6`|`[State 0, StopSnd]`|已同步原 Common controller；沿用現有逐幀執行|
|`venus_Common.cns:11`|`[State 0, ChangeAnim]`|已同步原 Common controller；沿用現有逐幀執行|
|`venus_Common.cns:18`|`[State 0, ChangeAnim]`|已同步原 Common controller；沿用現有逐幀執行|
|`venus_Common.cns:35`|`[State 0, StopLowVelocity]`|已同步原 Common controller；沿用現有逐幀執行|
|`venus_Common.cns:41`|`[State 0, CtrlSet]`|已同步原 Common controller；沿用現有逐幀執行|
|`venus_Common.cns:59`|`[State 10, VelMul]`|已同步原 Common controller；沿用現有逐幀執行|
|`venus_Common.cns:64`|`[State 10, CtrlSet]`|已同步原 Common controller；沿用現有逐幀執行|
|`venus_Common.cns:104`|`[State 11, CtrlSet]`|已同步原 Common controller；沿用現有逐幀執行|
|`venus_Common.cns:148`|`[State 12, CtrlSet]`|已同步原 Common controller；沿用現有逐幀執行|
|`venus_Common.cns:197`|`[State 20, SNES AI Walk target 80]`|已同步原 Common controller；沿用現有逐幀執行|
|`venus_Common.cns:204`|`[State 20, SNES AI Walk target 160]`|已同步原 Common controller；沿用現有逐幀執行|
|`venus_Common.cns:211`|`[State 20, SNES AI Walk target 320]`|已同步原 Common controller；沿用現有逐幀執行|
|`venus_Common.cns:218`|`[State 20, SNES AI Walk target 400]`|已同步原 Common controller；沿用現有逐幀執行|
|`venus_Common.cns:225`|`[State 20, SNES AI Walk target 480]`|已同步原 Common controller；沿用現有逐幀執行|
|`venus_Common.cns:232`|`[State 20, SNES AI Walk target 560]`|已同步原 Common controller；沿用現有逐幀執行|
|`venus_Common.cns:239`|`[State 20, SNES AI Walk target 800]`|已同步原 Common controller；沿用現有逐幀執行|
|`venus_Common.cns:294`|`[State 20, SNES AI Allow own decision]`|已同步原 Common controller；沿用現有逐幀執行|
|`venus_Common.cns:300`|`[State 20, SNES AI Stop movement phase]`|已同步原 Common controller；沿用現有逐幀執行|
|`venus_Common.cns:350`|`[State 40, SNES AI Jump forward]`|已同步原 Common controller；沿用現有逐幀執行|
|`venus_Common.cns:358`|`[State 40, SNES AI Jump back]`|已同步原 Common controller；沿用現有逐幀執行|
|`venus_Common.cns:372`|`[State 40, VelSet]`|已同步原 Common controller；沿用現有逐幀執行|
|`venus_Common.cns:386`|`[State 40, PlaySnd]`|已同步原 Common controller；沿用現有逐幀執行|
|`venus_Common.cns:416`|`[State 51, Null]`|已同步原 Common controller；沿用現有逐幀執行|
|`venus_Common.cns:431`|`[State 52, NotHitBy]`|已同步原 Common controller；沿用現有逐幀執行|
|`venus_Common.cns:468`|`[State 0, ChangeAnim]`|已同步原 Common controller；沿用現有逐幀執行|
|`venus_Common.cns:475`|`[State 0, VelSet]`|已同步原 Common controller；沿用現有逐幀執行|
|`venus_Common.cns:481`|`[State 51, 1]`|已同步原 Common controller；沿用現有逐幀執行|
|`venus_Common.cns:635`|`[State 120, ChangeAnim]`|已接原防禦狀態判斷／退出；保留 HitShakeOver 及玩家／AI分支|
|`venus_Common.cns:640`|`[State 120, StateTypeSet]`|已接原防禦狀態判斷／退出；保留 HitShakeOver 及玩家／AI分支|
|`venus_Common.cns:645`|`[State 120, StateTypeSet]`|已接原防禦狀態判斷／退出；保留 HitShakeOver 及玩家／AI分支|
|`venus_Common.cns:650`|`[State 120, StateTypeSet]`|已接原防禦狀態判斷／退出；保留 HitShakeOver 及玩家／AI分支|
|`venus_Common.cns:655`|`[State 120, StateTypeSet]`|已接原防禦狀態判斷／退出；保留 HitShakeOver 及玩家／AI分支|
|`venus_Common.cns:663`|`[State 120, StateTypeSet]`|已接原防禦狀態判斷／退出；保留 HitShakeOver 及玩家／AI分支|
|`venus_Common.cns:671`|`[State 120, NoAirGuard]`|已接原防禦狀態判斷／退出；保留 HitShakeOver 及玩家／AI分支|
|`venus_Common.cns:676`|`[State 120, ChangeState]`|已接原防禦狀態判斷／退出；保留 HitShakeOver 及玩家／AI分支|
|`venus_Common.cns:681`|`[State 120, ChangeState]`|已接原防禦狀態判斷／退出；保留 HitShakeOver 及玩家／AI分支|
|`venus_Common.cns:693`|`[State 130, ChangeAnim]`|已接原防禦狀態判斷／退出；保留 HitShakeOver 及玩家／AI分支|
|`venus_Common.cns:698`|`[State 130, SNES AI Crouch guard]`|已接原防禦狀態判斷／退出；保留 HitShakeOver 及玩家／AI分支|
|`venus_Common.cns:705`|`[State 130, ChangeState]`|已接原防禦狀態判斷／退出；保留 HitShakeOver 及玩家／AI分支|
|`venus_Common.cns:720`|`[State 130, ChangeState]`|已接原防禦狀態判斷／退出；保留 HitShakeOver 及玩家／AI分支|
|`venus_Common.cns:732`|`[State 131, ChangeAnim]`|已接原防禦狀態判斷／退出；保留 HitShakeOver 及玩家／AI分支|
|`venus_Common.cns:737`|`[State 131, SNES AI Stand guard]`|已接原防禦狀態判斷／退出；保留 HitShakeOver 及玩家／AI分支|
|`venus_Common.cns:752`|`[State 131, ChangeState]`|已接原防禦狀態判斷／退出；保留 HitShakeOver 及玩家／AI分支|
|`venus_Common.cns:758`|`[State 131, ChangeState]`|已接原防禦狀態判斷／退出；保留 HitShakeOver 及玩家／AI分支|
|`venus_Common.cns:772`|`[State 132, NoAirGuard]`|已接原防禦狀態判斷／退出；保留 HitShakeOver 及玩家／AI分支|
|`venus_Common.cns:782`|`[State 140, ChangeAnim]`|已接原防禦狀態判斷／退出；保留 HitShakeOver 及玩家／AI分支|
|`venus_Common.cns:787`|`[State 140, StateTypeSet]`|已接原防禦狀態判斷／退出；保留 HitShakeOver 及玩家／AI分支|
|`venus_Common.cns:792`|`[State 140, StateTypeSet]`|已接原防禦狀態判斷／退出；保留 HitShakeOver 及玩家／AI分支|
|`venus_Common.cns:797`|`[State 140, StateTypeSet]`|已接原防禦狀態判斷／退出；保留 HitShakeOver 及玩家／AI分支|
|`venus_Common.cns:802`|`[State 140, StateTypeSet]`|已接原防禦狀態判斷／退出；保留 HitShakeOver 及玩家／AI分支|
|`venus_Common.cns:809`|`[State 140, StateTypeSet]`|已接原防禦狀態判斷／退出；保留 HitShakeOver 及玩家／AI分支|
|`venus_Common.cns:822`|`[State 150, ChangeAnim]`|已接原防禦狀態判斷／退出；保留 HitShakeOver 及玩家／AI分支|
|`venus_Common.cns:827`|`[State 150, ChangeState]`|已接原防禦狀態判斷／退出；保留 HitShakeOver 及玩家／AI分支|
|`venus_Common.cns:832`|`[State 150, StateTypeSet]`|已接原防禦狀態判斷／退出；保留 HitShakeOver 及玩家／AI分支|
|`venus_Common.cns:839`|`[State 150, StateTypeSet]`|已接原防禦狀態判斷／退出；保留 HitShakeOver 及玩家／AI分支|
|`venus_Common.cns:846`|`[State 150, ForceFeedback]`|已接原防禦狀態判斷／退出；保留 HitShakeOver 及玩家／AI分支|
|`venus_Common.cns:858`|`[State 151, HitVelSet]`|已接原防禦狀態判斷／退出；保留 HitShakeOver 及玩家／AI分支|
|`venus_Common.cns:863`|`[State 151, VelSet]`|已接原防禦狀態判斷／退出；保留 HitShakeOver 及玩家／AI分支|
|`venus_Common.cns:869`|`[State 151, CtrlSet]`|已接原防禦狀態判斷／退出；保留 HitShakeOver 及玩家／AI分支|
|`venus_Common.cns:874`|`[State 151, StateTypeSet]`|已接原防禦狀態判斷／退出；保留 HitShakeOver 及玩家／AI分支|
|`venus_Common.cns:881`|`[State 151, StateTypeSet]`|已接原防禦狀態判斷／退出；保留 HitShakeOver 及玩家／AI分支|
|`venus_Common.cns:888`|`[State 151, ChangeState]`|已接原防禦狀態判斷／退出；保留 HitShakeOver 及玩家／AI分支|
|`venus_Common.cns:900`|`[State 152, 1]`|已接原防禦狀態判斷／退出；保留 HitShakeOver 及玩家／AI分支|
|`venus_Common.cns:905`|`[State 152, ChangeState]`|已接原防禦狀態判斷／退出；保留 HitShakeOver 及玩家／AI分支|
|`venus_Common.cns:910`|`[State 152, StateTypeSet]`|已接原防禦狀態判斷／退出；保留 HitShakeOver 及玩家／AI分支|
|`venus_Common.cns:917`|`[State 152, StateTypeSet]`|已接原防禦狀態判斷／退出；保留 HitShakeOver 及玩家／AI分支|
|`venus_Common.cns:924`|`[State 152, ForceFeedback]`|已接原防禦狀態判斷／退出；保留 HitShakeOver 及玩家／AI分支|
|`venus_Common.cns:936`|`[State 153, HitVelSet]`|已接原防禦狀態判斷／退出；保留 HitShakeOver 及玩家／AI分支|
|`venus_Common.cns:941`|`[State 153, VelSet]`|已接原防禦狀態判斷／退出；保留 HitShakeOver 及玩家／AI分支|
|`venus_Common.cns:947`|`[State 153, CtrlSet]`|已接原防禦狀態判斷／退出；保留 HitShakeOver 及玩家／AI分支|
|`venus_Common.cns:952`|`[State 153, StateTypeSet]`|已接原防禦狀態判斷／退出；保留 HitShakeOver 及玩家／AI分支|
|`venus_Common.cns:959`|`[State 153, StateTypeSet]`|已接原防禦狀態判斷／退出；保留 HitShakeOver 及玩家／AI分支|
|`venus_Common.cns:966`|`[State 153, ChangeState]`|已接原防禦狀態判斷／退出；保留 HitShakeOver 及玩家／AI分支|
|`venus_Common.cns:978`|`[State 154, ChangeState]`|已接原防禦狀態判斷／退出；保留 HitShakeOver 及玩家／AI分支|
|`venus_Common.cns:995`|`[State 155, VelAdd]`|已接原防禦狀態判斷／退出；保留 HitShakeOver 及玩家／AI分支|
|`venus_Common.cns:1000`|`[State 155, CtrlSet]`|已接原防禦狀態判斷／退出；保留 HitShakeOver 及玩家／AI分支|
|`venus_Common.cns:1005`|`[State 155, VarSet]`|已接原防禦狀態判斷／退出；保留 HitShakeOver 及玩家／AI分支|
|`venus_Common.cns:1010`|`[State 155, VelSet]`|已接原防禦狀態判斷／退出；保留 HitShakeOver 及玩家／AI分支|
|`venus_Common.cns:1015`|`[State 155, PosSet]`|已接原防禦狀態判斷／退出；保留 HitShakeOver 及玩家／AI分支|
|`venus_Common.cns:1020`|`[State 155, ChangeState]`|已接原防禦狀態判斷／退出；保留 HitShakeOver 及玩家／AI分支|
|`venus_Common.cns:1027`|`[State 155, ChangeState]`|已接原防禦狀態判斷／退出；保留 HitShakeOver 及玩家／AI分支|
|`venus_Common.cns:1108`|`[State 5000, ChangeAnim]`|原 Common 受擊／恢復 controller 已交由既有受擊執行器執行|
|`venus_Common.cns:1131`|`[State 5000, StateTypeSet]`|原 Common 受擊／恢復 controller 已交由既有受擊執行器執行|
|`venus_Common.cns:1155`|`[State 5000, FFB Hard]`|原 Common 受擊／恢復 controller 已交由既有受擊執行器執行|
|`venus_Common.cns:1165`|`[State 5000, ChangeState]`|原 Common 受擊／恢復 controller 已交由既有受擊執行器執行|
|`venus_Common.cns:1181`|`[State 5001, HitVelSet]`|原 Common 受擊／恢復 controller 已交由既有受擊執行器執行|
|`venus_Common.cns:1186`|`[State 5001, ChangeAnim]`|原 Common 受擊／恢復 controller 已交由既有受擊執行器執行|
|`venus_Common.cns:1191`|`[State 5001, VelMul]`|原 Common 受擊／恢復 controller 已交由既有受擊執行器執行|
|`venus_Common.cns:1196`|`[State 5001, VelSet]`|原 Common 受擊／恢復 controller 已交由既有受擊執行器執行|
|`venus_Common.cns:1201`|`[State 5001, DefenceMulSet]`|原 Common 受擊／恢復 controller 已交由既有受擊執行器執行|
|`venus_Common.cns:1206`|`[State 5001, ChangeState]`|原 Common 受擊／恢復 controller 已交由既有受擊執行器執行|
|`venus_Common.cns:1218`|`[State 5010, ChangeAnim]`|原 Common 受擊／恢復 controller 已交由既有受擊執行器執行|
|`venus_Common.cns:1241`|`[State 5010, StateTypeSet]`|原 Common 受擊／恢復 controller 已交由既有受擊執行器執行|
|`venus_Common.cns:1248`|`[State 5010, FFB Light]`|原 Common 受擊／恢復 controller 已交由既有受擊執行器執行|
|`venus_Common.cns:1255`|`[State 5010, FFB Medium]`|原 Common 受擊／恢復 controller 已交由既有受擊執行器執行|
|`venus_Common.cns:1263`|`[State 5010, FFB Hard]`|原 Common 受擊／恢復 controller 已交由既有受擊執行器執行|
|`venus_Common.cns:1271`|`[State 5010, ChangeState]`|原 Common 受擊／恢復 controller 已交由既有受擊執行器執行|
|`venus_Common.cns:1287`|`[State 5011, HitVelSet]`|原 Common 受擊／恢復 controller 已交由既有受擊執行器執行|
|`venus_Common.cns:1292`|`[State 5011, ChangeAnim]`|原 Common 受擊／恢復 controller 已交由既有受擊執行器執行|
|`venus_Common.cns:1297`|`[State 5011, VelMul]`|原 Common 受擊／恢復 controller 已交由既有受擊執行器執行|
|`venus_Common.cns:1302`|`[State 5011, VelSet]`|原 Common 受擊／恢復 controller 已交由既有受擊執行器執行|
|`venus_Common.cns:1307`|`[State 5011, DefenceMulSet]`|原 Common 受擊／恢復 controller 已交由既有受擊執行器執行|
|`venus_Common.cns:1312`|`[State 5011, ChangeState]`|原 Common 受擊／恢復 controller 已交由既有受擊執行器執行|
|`venus_Common.cns:1608`|`[State 5080, VarSet]`|原 Common 受擊／恢復 controller 已交由既有受擊執行器執行|
|`venus_Common.cns:1613`|`[State 5080, VarAdd]`|原 Common 受擊／恢復 controller 已交由既有受擊執行器執行|
|`venus_Common.cns:1620`|`[State 5080, VarSet]`|原 Common 受擊／恢復 controller 已交由既有受擊執行器執行|
|`venus_Common.cns:1627`|`[State 5080, ChangeAnim]`|原 Common 受擊／恢復 controller 已交由既有受擊執行器執行|
|`venus_Common.cns:1632`|`[State 5080, ChangeState]`|原 Common 受擊／恢復 controller 已交由既有受擊執行器執行|
|`venus_Common.cns:1638`|`[State 5080, ChangeState]`|原 Common 受擊／恢復 controller 已交由既有受擊執行器執行|
|`venus_Common.cns:1649`|`[State 5081, HitVelSet]`|原 Common 受擊／恢復 controller 已交由既有受擊執行器執行|
|`venus_Common.cns:1654`|`[State 5081, VelSet]`|原 Common 受擊／恢復 controller 已交由既有受擊執行器執行|
|`venus_Common.cns:1659`|`[State 5081, VarSet]`|原 Common 受擊／恢復 controller 已交由既有受擊執行器執行|
|`venus_Common.cns:1664`|`[State 5081, ChangeState]`|原 Common 受擊／恢復 controller 已交由既有受擊執行器執行|
|`venus.cmd:226`|`[State -1, SNES AI Dash Back]`|已同步原 SNES 輸入／AI條件；Recovery Walk沿用已確認ctrl=1|
|`venus.cmd:247`|`[State -1, SNES AI Guard]`|已同步原 SNES 輸入／AI條件；Recovery Walk沿用已確認ctrl=1|
|`venus.cmd:263`|`[State -1, SNES AI Chain Explosive]`|已同步原 SNES 輸入／AI條件；Recovery Walk沿用已確認ctrl=1|
|`venus.cmd:322`|`[State -1, SNES AI Stand LP]`|已同步原 SNES 輸入／AI條件；Recovery Walk沿用已確認ctrl=1|
|`venus.cmd:338`|`[State -1, SNES AI Stand LK]`|已同步原 SNES 輸入／AI條件；Recovery Walk沿用已確認ctrl=1|
|`venus.cmd:358`|`[State -1, SNES AI Stand HP]`|已同步原 SNES 輸入／AI條件；Recovery Walk沿用已確認ctrl=1|
|`venus.cmd:377`|`[State -1, SNES AI Stand HK]`|已同步原 SNES 輸入／AI條件；Recovery Walk沿用已確認ctrl=1|
|`venus.cmd:392`|`[State -1, SNES AI Crouch LP]`|已同步原 SNES 輸入／AI條件；Recovery Walk沿用已確認ctrl=1|
|`venus.cmd:408`|`[State -1, SNES AI Crouch LK]`|已同步原 SNES 輸入／AI條件；Recovery Walk沿用已確認ctrl=1|
|`venus.cmd:428`|`[State -1, SNES AI Crouch HP]`|已同步原 SNES 輸入／AI條件；Recovery Walk沿用已確認ctrl=1|
|`venus.cmd:447`|`[State -1, SNES AI Crouch HK]`|已同步原 SNES 輸入／AI條件；Recovery Walk沿用已確認ctrl=1|
|`venus.cmd:462`|`[State -1, SNES AI Venus Wink Chain Sword]`|已同步原 SNES 輸入／AI條件；Recovery Walk沿用已確認ctrl=1|
|`venus.cmd:483`|`[State -1, SNES AI Crescent Beam]`|已同步原 SNES 輸入／AI條件；Recovery Walk沿用已確認ctrl=1|
|`venus.cmd:503`|`[State -1, SNES AI Venus Love Me Chain]`|已同步原 SNES 輸入／AI條件；Recovery Walk沿用已確認ctrl=1|
|`venus.cmd:522`|`[State -1, SNES AI Jump LP]`|已同步原 SNES 輸入／AI條件；Recovery Walk沿用已確認ctrl=1|
|`venus.cmd:538`|`[State -1, SNES AI Jump LK]`|已同步原 SNES 輸入／AI條件；Recovery Walk沿用已確認ctrl=1|
|`venus.cmd:558`|`[State -1, SNES AI Jump HP]`|已同步原 SNES 輸入／AI條件；Recovery Walk沿用已確認ctrl=1|
|`venus.cmd:577`|`[State -1, SNES AI Jump HK]`|已同步原 SNES 輸入／AI條件；Recovery Walk沿用已確認ctrl=1|
|`venus.cmd:592`|`[State -1, SNES AI Crouch]`|已同步原 SNES 輸入／AI條件；Recovery Walk沿用已確認ctrl=1|
|`venus.cmd:605`|`[State -1, SNES AI Stand Up]`|已同步原 SNES 輸入／AI條件；Recovery Walk沿用已確認ctrl=1|
|`venus.cmd:618`|`[State -1, SNES AI Jump]`|已同步原 SNES 輸入／AI條件；Recovery Walk沿用已確認ctrl=1|
|`venus.cmd:635`|`[State -1, SNES AI Walk]`|已同步原 SNES 輸入／AI條件；Recovery Walk沿用已確認ctrl=1|
|`venus.cmd:672`|`[State -1, SNES Chain Explosive]`|已同步原 SNES 輸入／AI條件；Recovery Walk沿用已確認ctrl=1|
|`venus.cmd:689`|`[State -1, SNES Venus Love Me Chain]`|已同步原 SNES 輸入／AI條件；Recovery Walk沿用已確認ctrl=1|
|`venus.cmd:706`|`[State -1, SNES Venus Wink Chain Sword]`|已同步原 SNES 輸入／AI條件；Recovery Walk沿用已確認ctrl=1|
|`venus.cmd:725`|`[State -1, Crescent Beam]`|已同步原 SNES 輸入／AI條件；Recovery Walk沿用已確認ctrl=1|
|`venus.cmd:752`|`[State -1, Dash Back]`|已同步原 SNES 輸入／AI條件；Recovery Walk沿用已確認ctrl=1|
|`venus.cmd:803`|`[State -1, SNES Stand Light Punch]`|已同步原 SNES 輸入／AI條件；Recovery Walk沿用已確認ctrl=1|
|`venus.cmd:817`|`[State -1, Stand Strong Punch]`|已同步原 SNES 輸入／AI條件；Recovery Walk沿用已確認ctrl=1|
|`venus.cmd:945`|`[State -1, SNES PLAYER Recovery Jump]`|已同步原 SNES 輸入／AI條件；Recovery Walk沿用已確認ctrl=1|
|`venus.cmd:956`|`[State -1, SNES PLAYER Recovery Crouch]`|已同步原 SNES 輸入／AI條件；Recovery Walk沿用已確認ctrl=1|
|`venus.cmd:968`|`[State -1, SNES PLAYER Recovery Stand Up]`|已同步原 SNES 輸入／AI條件；Recovery Walk沿用已確認ctrl=1|
|`venus.cmd:980`|`[State -1, SNES PLAYER Recovery Walk]`|已同步原 SNES 輸入／AI條件；Recovery Walk沿用已確認ctrl=1|
|`venus_Helper.st:112`|`[State 915, LoseRemoveExplod]`|五角色共用定義已統一；H950／H951由現有HUD等效處理，避免重複圖層|
|`venus_Helper.st:227`|`[State 925, LoseRemoveExplod]`|五角色共用定義已統一；H950／H951由現有HUD等效處理，避免重複圖層|
|`venus_Helper.st:246`|`[State 950, NormalExplod]`|五角色共用定義已統一；H950／H951由現有HUD等效處理，避免重複圖層|
|`venus_Helper.st:260`|`[State 950, NoHPExplod]`|五角色共用定義已統一；H950／H951由現有HUD等效處理，避免重複圖層|
|`venus_Helper.st:273`|`[State 950, NormalRemoveExplod]`|五角色共用定義已統一；H950／H951由現有HUD等效處理，避免重複圖層|
|`venus_Helper.st:282`|`[State 950, NoHPRemoveExplod]`|五角色共用定義已統一；H950／H951由現有HUD等效處理，避免重複圖層|
|`venus_Helper.st:301`|`[State 951, PlaySnd]`|五角色共用定義已統一；H950／H951由現有HUD等效處理，避免重複圖層|
|`venus_Helper.st:309`|`[State 951, SuperExplod]`|五角色共用定義已統一；H950／H951由現有HUD等效處理，避免重複圖層|
|`venus_Helper.st:327`|`[State 950, GetHitRemoveExplod]`|五角色共用定義已統一；H950／H951由現有HUD等效處理，避免重複圖層|
|`venus_Helper.st:337`|`[State 950, DestroySelf]`|五角色共用定義已統一；H950／H951由現有HUD等效處理，避免重複圖層|
|`venus_Common.cns:619`|`[State 54, MakeDust]`|已補 S106 MakeDust，Time=2 產生原共用塵效|
|`venus_Common.cns:1037`|`[State 175, ChangeState]`|已同步 S175 直接回 S170；原 fallback 同樣因缺 A175 回 S170，非整個狀態缺失|

## 刻意不接／保持停用

- `DisplayToClipboard`：按作者要求不需要；不是遊戲 BUG。
- `juggle`／`airjuggle`／`ScreenBound.movecamera`：按作者已確認設計忽略，不列待辦。
- Venus CMD 兩段 Throw AI 帶 `triggerall = 0`，另一 Throw 入口要求 `StateNo = 999`；原本就不可用，保持停用。沒有把未完成 Throw 開放給玩家／AI。
- A645 為既有未完成素材，保持停用。S800／S810 不因核對而新啟用。
- 3DO／SEGA 分支不接；以下只列原 controller 位置。

|原文件／行|非 SNES controller|
|---|---|
|`venus_Common.cns:180`|`[State 20, VelSet]`|
|`venus_Common.cns:188`|`[State 20, VelSet]`|
|`venus_Common.cns:260`|`[State 20, CtrlSet]`|
|`venus_Common.cns:267`|`[State 20, CtrlSet]`|
|`venus_Common.cns:284`|`[State 20, ChangeState]`|
|`venus_Common.cns:327`|`[State 40, VarSet]`|
|`venus_Common.cns:336`|`[State 40, VarSet]`|
|`venus_Common.cns:379`|`[State 40, ChangeState]`|
|`venus_Common.cns:712`|`[State 130, ChangeState]`|
|`venus_Common.cns:744`|`[State 131, ChangeState]`|

## 測試與限制

- 實際瀏覽器 Venus/Venus WATCH 2,200 tick，無 runtime error／NaN；P1/P2 × 玩家/AI × S150/S152 × 站/蹲 16 組防禦退出通過。
- P1/P2 各自測普通／空中／必殺／超必共 32 組出招，主體動畫沒有缺 Sprite；S3000→S3005→原收招→S0 正常。這是覆蓋上述路徑，不是宣稱所有隨機對局零 BUG。
- P1/P2 頭像正常／防禦／受擊／低 HP／勝／敗共12組，防禦不誤用受傷頭像，正常 RemoveExplod。
- TimeElapsed／TimeRemaining：99秒=[0,5940]，6有效tick後=[6,5934]，無限模式1有效tick=[1,-1]，暫停不增加。
- AIR 132 個 Action、1,258 個影格的 Sprite reference／offset／tick 與原檔一致；只剩作者未完成 A645 沿用排除。沒有重新匯出整套角色圖，沒有改原 SFF／SND。
- 不是單靠「輸出 JSON 內有 controller」判完成：對應執行路徑、圖片／音訊依賴及上述動作有實際檢查。S951 以作者已確認的 A953→A951 fallback 與 HUD 入口等效處理。

- 共用 H951 額外驗證：Jupiter 使用已存在 A953；其餘四角使用 A951。四角原有 S980,0 均可預先解碼，與 Venus 一同完整覆蓋五角。純邏輯檢查通過低血量／倒數門檻、無限時間、KO移除、持續條件不重播及條件重新成立可再播。

## 原檔版本

|文件|行數|SHA256|
|---|---:|---|
|venus.cns|2796|`3ffe46c94eabba8218c07e224fc3338970ae69feb295f91fdbb3aeece5490705`|
|venus_Common.cns|2223|`8f242125b6da2beb18d72f9b3b74a6dbafd5bcaec71e8f2973c3a1197ef5f658`|
|venus_Helper.st|1047|`50110ab0443349f15c36ea07c6231e8a67f7255f12e952e996abcaf77554eb0a`|
|venus.cmd|998|`9b67d69e98ddddaf4afaeb9d65627041b970232717f99a8c9daea29bda2cd533`|

音訊壓縮：

- `S40,1`：83,272 → 6,627 bytes。
- `S980,0`：118,018 → 23,373 bytes。
