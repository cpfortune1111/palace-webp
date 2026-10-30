# Moon SNES 差異結果 — 0.24.08-r21

只收錄「今次已接入／更新」、「尚未完整接入／待確認」、「非SNES暫不接入」及沿用作者要求停用的未完成段落。之前已有相同功能效果的段落不逐項列出。以下 **State 是 controller 段落，不是整個 StateDef**；有一個參數待跟進，不代表整個招式未做。

四份原文件合共10,049行，逐段讀取892個controller，並核對StateDef欄位、常數及command definitions。採用「Web有做到原效果就算接入」；容許既有專用實作及UI替代。註解不當成可執行code，重複定義、停用分支分開處理。原檔未改；原文快照及逐行核對資料保留本機。

## r21 防禦退出修正

Trace 記錄 P2 於 S150 的 hitShake 歸零後仍未退出，最後 time=263。原因是 Web 篩選錯將 `!AILevel || var(50) != 0` 當成純非 SNES 分支，漏掉 AILevel=0 的玩家路徑；原文件條件正確，毋須修改。

已還原 moon_Common.cns 的個別 controller：S120:701、S130:745、S131:796 的 trigger3；S150:884、S152:974 的 ChangeState。保留原條件、次序及 HitShakeOver，並非強制超時轉 S0。3DO／SEGA 維持停用。

驗證：P1／P2 × 玩家／AI × S150／S152 × 站／蹲共16組，均等待8tick震動後轉S151／S153，30tick內經防禦退出回S0／S11、ctrl=1。另WATCH 2,200tick、Silver Crystal完整收招、S140退出及載入文字樣式檢查通過。

## r20 已接入／更新

81個controller效果／資料段落，加兩個command definition；不是81個整招。

- 更新SNES AI21段、行走距離節奏／跳躍方向、出招L/H強度選擇。
- 同步普通／AUTO輸入、SNES復原取消；Recovery Walk特定路徑補ctrl=1，其餘起手Ctrl沿原檔，避免長按跳躍反覆重入S40。
- Moon改用原Common的SNES防禦判斷，包含隨對手蹲姿切換130/131及防禦後退。沿用r19原引擎S140完成規則。
- 補TimeRemaining實際查詢：跟Lifebar剩餘tick，無限時間=-1；沒有用固定值頂替。參照[IKEMEN官方TimeRemaining說明](https://github.com/ikemen-engine/Ikemen-GO/wiki/Triggers-%28new%29#timeremaining)。
- Sonic Cry人聲channel=0及原L/H動畫選擇同步；E905 random偏移不再被bindtime=1覆蓋。

|文件／行|Controller State 段落|今次結果|
|---|---|---|
|`moon_Common.cns:59`|`[State 10, VelMul]`|今次已接入／同步原條件及參數|
|`moon_Common.cns:64`|`[State 10, SNES AI Control]`|今次已接入／同步原條件及參數|
|`moon_Common.cns:151`|`[State 20, SNES AI Walk Forward]`|今次已接入／同步原條件及參數|
|`moon_Common.cns:159`|`[State 20, SNES AI Walk Back]`|今次已接入／同步原條件及參數|
|`moon_Common.cns:200`|`[State 20, SNES AI Walk Control]`|今次已接入／同步原條件及參數|
|`moon_Common.cns:208`|`[State 20, SNES AI Stop Walk]`|今次已接入／同步原條件及參數|
|`moon_Common.cns:241`|`[State 40, VarSet]`|今次已接入／同步原條件及參數|
|`moon_Common.cns:246`|`[State 40, SNES AI Jump Forward]`|今次已接入／同步原條件及參數|
|`moon_Common.cns:256`|`[State 40, SNES AI Jump Back]`|今次已接入／同步原條件及參數|
|`moon_Common.cns:675`|`[State 120, StateTypeSet]`|今次已接入／同步原條件及參數|
|`moon_Common.cns:683`|`[State 120, StateTypeSet]`|今次已接入／同步原條件及參數|
|`moon_Common.cns:701`|`[State 120, ChangeState]`|今次已接入／同步原條件及參數|
|`moon_Common.cns:734`|`[State 130, ChangeState]`|今次已接入／同步原條件及參數|
|`moon_Common.cns:745`|`[State 130, ChangeState]`|今次已接入／同步原條件及參數|
|`moon_Common.cns:778`|`[State 131, ChangeState]`|今次已接入／同步原條件及參數|
|`moon_Common.cns:796`|`[State 131, ChangeState]`|今次已接入／同步原條件及參數|
|`moon_Common.cns:850`|`[State 140, StateTypeSet]`|今次已接入／同步原條件及參數|
|`moon_Common.cns:858`|`[State 140, StateTypeSet]`|今次已接入／同步原條件及參數|
|`moon_Common.cns:877`|`[State 150, SNES AI Stand Guard Recoil]`|今次已接入／同步原條件及參數|
|`moon_Common.cns:890`|`[State 150, StateTypeSet]`|今次已接入／同步原條件及參數|
|`moon_Common.cns:898`|`[State 150, StateTypeSet]`|今次已接入／同步原條件及參數|
|`moon_Common.cns:934`|`[State 151, StateTypeSet]`|今次已接入／同步原條件及參數|
|`moon_Common.cns:942`|`[State 151, StateTypeSet]`|今次已接入／同步原條件及參數|
|`moon_Common.cns:967`|`[State 152, SNES AI Stand Guard Recoil]`|今次已接入／同步原條件及參數|
|`moon_Common.cns:980`|`[State 152, StateTypeSet]`|今次已接入／同步原條件及參數|
|`moon_Common.cns:988`|`[State 152, StateTypeSet]`|今次已接入／同步原條件及參數|
|`moon_Common.cns:1024`|`[State 153, StateTypeSet]`|今次已接入／同步原條件及參數|
|`moon_Common.cns:1032`|`[State 153, StateTypeSet]`|今次已接入／同步原條件及參數|
|`moon_Common.cns:1128`|`[State 175, ChangeState]`|今次已接入／同步原條件及參數|
|`moon.cns:1254`|`[State 1000, SNES AI Strength]`|今次已接入原強度公式；原式有cond兩分支同為0的地方亦照原式保留|
|`moon.cns:1346`|`[State 1100, SNES AI Strength]`|今次已接入原強度公式；原式有cond兩分支同為0的地方亦照原式保留|
|`moon.cns:1492`|`[State 1200, PlaySnd]`|今次已接入／同步原條件及參數|
|`moon.cns:1498`|`[State 1200, VarSet]`|今次已接入原強度公式；原式有cond兩分支同為0的地方亦照原式保留|
|`moon.cns:1505`|`[State 1200, SNES AI Strength]`|今次已接入原強度公式；原式有cond兩分支同為0的地方亦照原式保留|
|`moon.cns:1514`|`[State 1200, ChangeAnim]`|今次已接入／同步原條件及參數|
|`moon.cmd:327`|`[State -1, SNES AI Guard]`|今次已接入／同步原條件及參數|
|`moon.cmd:346`|`[State -1, SNES AI Backdash]`|今次已接入／同步原條件及參數|
|`moon.cmd:365`|`[State -1, SNES AI Silver Crystal Operation]`|今次已接入；包含TimeRemaining條件|
|`moon.cmd:389`|`[State -1, SNES AI Headbutt]`|今次已接入／同步原條件及參數|
|`moon.cmd:410`|`[State -1, SNES AI Stand LP]`|今次已接入／同步原條件及參數|
|`moon.cmd:433`|`[State -1, SNES AI Crouch LP]`|今次已接入／同步原條件及參數|
|`moon.cmd:456`|`[State -1, SNES AI Jump LP]`|今次已接入／同步原條件及參數|
|`moon.cmd:479`|`[State -1, SNES AI Stand LK]`|今次已接入／同步原條件及參數|
|`moon.cmd:501`|`[State -1, SNES AI Crouch LK]`|今次已接入／同步原條件及參數|
|`moon.cmd:523`|`[State -1, SNES AI Jump LK]`|今次已接入／同步原條件及參數|
|`moon.cmd:543`|`[State -1, SNES AI Stand HK]`|今次已接入／同步原條件及參數|
|`moon.cmd:566`|`[State -1, SNES AI Crouch HK]`|今次已接入／同步原條件及參數|
|`moon.cmd:589`|`[State -1, SNES AI Jump HK]`|今次已接入／同步原條件及參數|
|`moon.cmd:612`|`[State -1, SNES AI Moon Tiara Action]`|今次已接入／同步原條件及參數|
|`moon.cmd:637`|`[State -1, SNES AI Moon Spiral Heart Attack]`|今次已接入／同步原條件及參數|
|`moon.cmd:659`|`[State -1, SNES AI Sonic Cry]`|今次已接入／同步原條件及參數|
|`moon.cmd:682`|`[State -1, SNES AI Dash Jump]`|今次已接入／同步原條件及參數|
|`moon.cmd:703`|`[State -1, SNES AI Movement Jump]`|今次已接入／同步原條件及參數|
|`moon.cmd:722`|`[State -1, SNES AI Walk]`|今次已接入／同步原條件及參數|
|`moon.cmd:744`|`[State -1, SNES AI Crouch]`|今次已接入／同步原條件及參數|
|`moon.cmd:764`|`[State -1, SNES AI Stand Up]`|今次已接入／同步原條件及參數|
|`moon.cmd:1293`|`[State -1, Super Silver Crystal]`|今次已接入；包含TimeRemaining條件|
|`moon.cmd:1311`|`[State -1, Moon Tiara Action]`|今次已接入／同步原條件及參數|
|`moon.cmd:1330`|`[State -1, Moon Spiral Heart Attack]`|今次已接入／同步原條件及參數|
|`moon.cmd:1345`|`[State -1, Sonic Cry]`|今次已接入／同步原條件及參數|
|`moon.cmd:1361`|`[State -1, Rabbit Jump]`|今次已接入／同步原條件及參數|
|`moon.cmd:1378`|`[State -1, Run Back]`|今次已接入／同步原條件及參數|
|`moon.cmd:1394`|`[State -1, SNES PLAYER Headbutt]`|今次已接入／同步原條件及參數|
|`moon.cmd:1415`|`[State -1, Stand Light Punch]`|今次已接入／同步原條件及參數|
|`moon.cmd:1432`|`[State -1, Stand Strong Punch]`|今次已接入／同步原條件及參數|
|`moon.cmd:1449`|`[State -1, Stand Light Kick]`|今次已接入／同步原條件及參數|
|`moon.cmd:1466`|`[State -1, Standing Strong Kick]`|今次已接入／同步原條件及參數|
|`moon.cmd:1483`|`[State -1, Crouching Light Punch]`|今次已接入／同步原條件及參數|
|`moon.cmd:1500`|`[State -1, Crouching Strong Punch]`|今次已接入／同步原條件及參數|
|`moon.cmd:1517`|`[State -1, Crouching Light Kick]`|今次已接入／同步原條件及參數|
|`moon.cmd:1534`|`[State -1, Crouching Strong Kick]`|今次已接入／同步原條件及參數|
|`moon.cmd:1551`|`[State -1, Jump Light Punch]`|今次已接入／同步原條件及參數|
|`moon.cmd:1564`|`[State -1, Jump Strong Punch]`|今次已接入／同步原條件及參數|
|`moon.cmd:1577`|`[State -1, Jump Light Kick]`|今次已接入／同步原條件及參數|
|`moon.cmd:1590`|`[State -1, Jump Strong Kick]`|今次已接入／同步原條件及參數|
|`moon.cmd:1603`|`[State -1, SNES PLAYER Recovery Jump]`|今次已接入／同步原條件及參數|
|`moon.cmd:1614`|`[State -1, SNES PLAYER Recovery Crouch]`|今次已接入／同步原條件及參數|
|`moon.cmd:1626`|`[State -1, SNES PLAYER Recovery Stand]`|今次已接入／同步原條件及參數|
|`moon.cmd:1638`|`[State -1, SNES PLAYER Recovery Walk]`|今次已接入；Web為此路徑補ctrl=1，原檔未改|
|`moon.cns:978`|`[State 801, Explod]`|今次已接入：random偏移於綁定後保留|
|`moon.cns:925`|`[State 800, HitDef]`|今次已接入：guard.dist=0不再被共用防禦距離取代|

兩個command definition：

- `moon.cmd:53` `[Command] name = S_SNES_AUTO_SilverCrystal`：今次已同步command／buffer設定。
- `moon.cmd:177` `[Command] name = NHHJ`：今次已同步command／buffer設定。

## 尚未完整接入／待確認：1個controller段落

### moon_Common.cns：[State 105, AfterImage]（約599行）

拖影time/timegap/length已有效果；仍欠原`palcolor = 128`的半灰階色彩處理。`palbright = 0,0,0`、`palcontrast = 256,256,256`為中性值；不能因有拖影就宣稱全部色彩參數已完成。今次沒有新增整套色彩加工，這段列為未完整，**不是整個S105未接**。

```ini
[State 105, AfterImage]
type = AfterImage
trigger1 = Time = 0
time = 10
TimeGap = 1
length = 9
palcolor = 128
palBright = 0,0,0			;200,-100,-50	;add
palContrast = 256,256,256	;mul
trans = addalpha
alpha = 128,128
```

## 作者確認不需接入

`juggle`／`airjuggle`：Moon Palace不使用空中追打額度，無視相關扣額，不列為BUG或待接入。原有受擊無敵幀照舊。

`ScreenBound.movecamera`：作者接受現有鏡頭效果，無視此參數，不列為待接入。


## 非SNES暫不接入

以下逐個controller列位置；包括明確var(50)=1/2、!=0的分支及其專用State。共用controller只取SNES有效trigger組，唔會因同一段包含另一mode就整段當未接。

|文件／行|Controller State 段落|結果|
|---|---|---|
|`moon.cns:1231`|`[State 1000, VarAdd]`|非SNES暫不接入（3DO／SEGA或其meter／combo準備）|
|`moon.cns:1246`|`[State 1000, VarSet]`|非SNES暫不接入（3DO／SEGA或其meter／combo準備）|
|`moon.cns:1263`|`[State 1000, VarSet]`|非SNES暫不接入（3DO／SEGA或其meter／combo準備）|
|`moon.cns:1618`|`[State 1300, VarAdd]`|非SNES暫不接入（3DO／SEGA或其meter／combo準備）|
|`moon.cns:1626`|`[State 1300, PlaySnd]`|非SNES暫不接入（3DO／SEGA或其meter／combo準備）|
|`moon.cns:1633`|`[State 1300, PlayerPush]`|非SNES暫不接入（3DO／SEGA或其meter／combo準備）|
|`moon.cns:1640`|`[State 1300, VarSet]`|非SNES暫不接入（3DO／SEGA或其meter／combo準備）|
|`moon.cns:1648`|`[State 1300, VarSet]`|非SNES暫不接入（3DO／SEGA或其meter／combo準備）|
|`moon.cns:1656`|`[State 1300, ChangeAnim]`|非SNES暫不接入（3DO／SEGA或其meter／combo準備）|
|`moon.cns:1661`|`[State 1300, VelSet]`|非SNES暫不接入（3DO／SEGA或其meter／combo準備）|
|`moon.cns:1668`|`[State 1300, PlaySnd]`|非SNES暫不接入（3DO／SEGA或其meter／combo準備）|
|`moon.cns:1675`|`[State 1300, HitDef]`|非SNES暫不接入（3DO／SEGA或其meter／combo準備）|
|`moon.cns:1706`|`[State 1300, VarSet]`|非SNES暫不接入（3DO／SEGA或其meter／combo準備）|
|`moon.cns:1714`|`[State 1300, ChangeAnim]`|非SNES暫不接入（3DO／SEGA或其meter／combo準備）|
|`moon.cns:1722`|`[State 1300, VelSet]`|非SNES暫不接入（3DO／SEGA或其meter／combo準備）|
|`moon.cns:1730`|`[State 1300, VelSet]`|非SNES暫不接入（3DO／SEGA或其meter／combo準備）|
|`moon.cns:1744`|`[State 1300, StateTypeSet]`|非SNES暫不接入（3DO／SEGA或其meter／combo準備）|
|`moon.cns:1760`|`[State 1400, VarAdd]`|非SNES暫不接入（3DO／SEGA或其meter／combo準備）|
|`moon.cns:1767`|`[State 1400, VarSet]`|非SNES暫不接入（3DO／SEGA或其meter／combo準備）|
|`moon.cns:1774`|`[State 1400, VarSet]`|非SNES暫不接入（3DO／SEGA或其meter／combo準備）|
|`moon.cns:1782`|`[State 1400, ChangeAnim]`|非SNES暫不接入（3DO／SEGA或其meter／combo準備）|
|`moon.cns:1787`|`[State 1400, NotHitBy]`|非SNES暫不接入（3DO／SEGA或其meter／combo準備）|
|`moon.cns:1794`|`[State 1400, PlaySnd]`|非SNES暫不接入（3DO／SEGA或其meter／combo準備）|
|`moon.cns:1801`|`[State 1400, PlaySnd]`|非SNES暫不接入（3DO／SEGA或其meter／combo準備）|
|`moon.cns:1807`|`[State 1400, PlaySnd]`|非SNES暫不接入（3DO／SEGA或其meter／combo準備）|
|`moon.cns:1814`|`[State 1400, StateTypeSet]`|非SNES暫不接入（3DO／SEGA或其meter／combo準備）|
|`moon.cns:1821`|`[State 1400, VelSet]`|非SNES暫不接入（3DO／SEGA或其meter／combo準備）|
|`moon.cns:1828`|`[State 1400, VelAdd]`|非SNES暫不接入（3DO／SEGA或其meter／combo準備）|
|`moon.cns:1834`|`[State 1400, VelMul]`|非SNES暫不接入（3DO／SEGA或其meter／combo準備）|
|`moon.cns:1840`|`[State 1400, HitDef1]`|非SNES暫不接入（3DO／SEGA或其meter／combo準備）|
|`moon.cns:1869`|`[State 1100, HitDef2]`|非SNES暫不接入（3DO／SEGA或其meter／combo準備）|
|`moon.cns:1900`|`[State 1400, VarSet]`|非SNES暫不接入（3DO／SEGA或其meter／combo準備）|
|`moon.cns:1908`|`[State 1400, StateTypeSet]`|非SNES暫不接入（3DO／SEGA或其meter／combo準備）|
|`moon.cns:1914`|`[State 1400, ChangeAnim]`|非SNES暫不接入（3DO／SEGA或其meter／combo準備）|
|`moon.cns:1920`|`[State 1400, StateTypeSet]`|非SNES暫不接入（3DO／SEGA或其meter／combo準備）|
|`moon.cns:1927`|`[State 1400, VelSet]`|非SNES暫不接入（3DO／SEGA或其meter／combo準備）|
|`moon.cns:1933`|`[State 1400, PosSet]`|非SNES暫不接入（3DO／SEGA或其meter／combo準備）|
|`moon.cns:1938`|`[State 1400, ChangeState]`|非SNES暫不接入（3DO／SEGA或其meter／combo準備）|
|`moon.cns:2176`|`[State 3100, ChangeState]`|非SNES暫不接入（3DO／SEGA或其meter／combo準備）|
|`moon.cns:2181`|`[State 3100, ChangeState]`|非SNES暫不接入（3DO／SEGA或其meter／combo準備）|
|`moon.cns:2187`|`[State 3100, ScreenBound]`|非SNES暫不接入（3DO／SEGA或其meter／combo準備）|
|`moon.cns:2193`|`[State 3100, SuperPause]`|非SNES暫不接入（3DO／SEGA或其meter／combo準備）|
|`moon.cns:2204`|`[State 3100, Pause]`|非SNES暫不接入（3DO／SEGA或其meter／combo準備）|
|`moon.cns:2211`|`[State 3100, BGPalFX]`|非SNES暫不接入（3DO／SEGA或其meter／combo準備）|
|`moon.cns:2217`|`[State 3100, Explod]`|非SNES暫不接入（3DO／SEGA或其meter／combo準備）|
|`moon.cns:2228`|`[State 3100, Explod]`|非SNES暫不接入（3DO／SEGA或其meter／combo準備）|
|`moon.cns:2239`|`[State 3100, Explod]`|非SNES暫不接入（3DO／SEGA或其meter／combo準備）|
|`moon.cns:2250`|`[State 3100, Explod]`|非SNES暫不接入（3DO／SEGA或其meter／combo準備）|
|`moon.cns:2261`|`[State 3100, PlaySnd]`|非SNES暫不接入（3DO／SEGA或其meter／combo準備）|
|`moon.cns:2267`|`[State 3100, PlaySnd]`|非SNES暫不接入（3DO／SEGA或其meter／combo準備）|
|`moon.cns:2273`|`[State 3100, PlaySnd]`|非SNES暫不接入（3DO／SEGA或其meter／combo準備）|
|`moon.cns:2279`|`[State 3100, PlaySnd]`|非SNES暫不接入（3DO／SEGA或其meter／combo準備）|
|`moon.cns:2285`|`[State 3100, PlaySnd]`|非SNES暫不接入（3DO／SEGA或其meter／combo準備）|
|`moon.cns:2291`|`[State 3100, PlaySnd]`|非SNES暫不接入（3DO／SEGA或其meter／combo準備）|
|`moon.cns:2297`|`[State 3100, ChangeState]`|非SNES暫不接入（3DO／SEGA或其meter／combo準備）|
|`moon.cns:2312`|`[State 3101, VarSet]`|非SNES暫不接入（3DO／SEGA或其meter／combo準備）|
|`moon.cns:2317`|`[State 3101, Explod]`|非SNES暫不接入（3DO／SEGA或其meter／combo準備）|
|`moon.cns:2328`|`[State 3101, Explod]`|非SNES暫不接入（3DO／SEGA或其meter／combo準備）|
|`moon.cns:2338`|`[State 3101, Explod]`|非SNES暫不接入（3DO／SEGA或其meter／combo準備）|
|`moon.cns:2348`|`[State 3105, Helper]`|非SNES暫不接入（3DO／SEGA或其meter／combo準備）|
|`moon.cns:2361`|`[State 3101, StateTypeSet]`|非SNES暫不接入（3DO／SEGA或其meter／combo準備）|
|`moon.cns:2366`|`[State 3101, CtrlSet]`|非SNES暫不接入（3DO／SEGA或其meter／combo準備）|
|`moon.cns:2371`|`[State 3101, StateTypeSet]`|非SNES暫不接入（3DO／SEGA或其meter／combo準備）|
|`moon.cns:2377`|`[State 3101, ChangeState]`|非SNES暫不接入（3DO／SEGA或其meter／combo準備）|
|`moon.cns:2393`|`[State 3105, PlaySnd]`|非SNES暫不接入（3DO／SEGA或其meter／combo準備）|
|`moon.cns:2399`|`[State 3105, Explod]`|非SNES暫不接入（3DO／SEGA或其meter／combo準備）|
|`moon.cns:2409`|`[State 3105, PlaySnd]`|非SNES暫不接入（3DO／SEGA或其meter／combo準備）|
|`moon.cns:2415`|`[State 3105, StateTypeSet]`|非SNES暫不接入（3DO／SEGA或其meter／combo準備）|
|`moon.cns:2421`|`[State 3105, Explod]`|非SNES暫不接入（3DO／SEGA或其meter／combo準備）|
|`moon.cns:2431`|`[State 3105, PlaySnd]`|非SNES暫不接入（3DO／SEGA或其meter／combo準備）|
|`moon.cns:2437`|`[State 3105, Explod]`|非SNES暫不接入（3DO／SEGA或其meter／combo準備）|
|`moon.cns:2447`|`[State 3105, Helper]`|非SNES暫不接入（3DO／SEGA或其meter／combo準備）|
|`moon.cns:2460`|`[State 3105, StateTypeSet]`|非SNES暫不接入（3DO／SEGA或其meter／combo準備）|
|`moon.cns:2465`|`[State 3105, CtrlSet]`|非SNES暫不接入（3DO／SEGA或其meter／combo準備）|
|`moon.cns:2470`|`[State 3105, StateTypeSet]`|非SNES暫不接入（3DO／SEGA或其meter／combo準備）|
|`moon.cns:2476`|`[State 3105, ChangeState]`|非SNES暫不接入（3DO／SEGA或其meter／combo準備）|
|`moon.cns:2488`|`[State 3160, SelfState]`|非SNES暫不接入（3DO／SEGA或其meter／combo準備）|
|`moon.cns:2493`|`[State 3160, AssertSpecial]`|非SNES暫不接入（3DO／SEGA或其meter／combo準備）|
|`moon.cns:2498`|`[State 3160, ChangeAnim2]`|非SNES暫不接入（3DO／SEGA或其meter／combo準備）|
|`moon.cns:2504`|`[State 3160, PlaySnd]`|非SNES暫不接入（3DO／SEGA或其meter／combo準備）|
|`moon.cns:2511`|`[State 3160, SprPriority]`|非SNES暫不接入（3DO／SEGA或其meter／combo準備）|
|`moon.cns:2516`|`[State 3160, VelSet]`|非SNES暫不接入（3DO／SEGA或其meter／combo準備）|
|`moon.cns:2523`|`[State 3160, ChangeAnim]`|非SNES暫不接入（3DO／SEGA或其meter／combo準備）|
|`moon.cns:2529`|`[State 3160, ChangeAnim]`|非SNES暫不接入（3DO／SEGA或其meter／combo準備）|
|`moon.cns:2535`|`[State 3160, VelAdd]`|非SNES暫不接入（3DO／SEGA或其meter／combo準備）|
|`moon.cns:2540`|`[State 3160, HitVelSet]`|非SNES暫不接入（3DO／SEGA或其meter／combo準備）|
|`moon.cns:2547`|`[State 3160, SelfState]`|非SNES暫不接入（3DO／SEGA或其meter／combo準備）|
|`moon.cns:2560`|`[State -2, Explod]`|非SNES暫不接入（3DO／SEGA或其meter／combo準備）|
|`moon.cns:2577`|`[State -2, Explod]`|非SNES暫不接入（3DO／SEGA或其meter／combo準備）|
|`moon.cns:2649`|`[State -2, PowerBarExplod]`|非SNES暫不接入（3DO／SEGA或其meter／combo準備）|
|`moon.cns:2668`|`[State -2, PowerBarExplodBG]`|非SNES暫不接入（3DO／SEGA或其meter／combo準備）|
|`moon.cns:2687`|`[State -2, PowerBarExplod]`|非SNES暫不接入（3DO／SEGA或其meter／combo準備）|
|`moon.cns:2706`|`[State -2, PowerBarExplodBG]`|非SNES暫不接入（3DO／SEGA或其meter／combo準備）|
|`moon.cns:2725`|`[State -2, PowerBarExplod]`|非SNES暫不接入（3DO／SEGA或其meter／combo準備）|
|`moon.cns:2744`|`[State -2, PowerBarExplodBG]`|非SNES暫不接入（3DO／SEGA或其meter／combo準備）|
|`moon.cns:2763`|`[State -2, PowerBarExplod]`|非SNES暫不接入（3DO／SEGA或其meter／combo準備）|
|`moon.cns:2782`|`[State -2, PowerBarExplodBG]`|非SNES暫不接入（3DO／SEGA或其meter／combo準備）|
|`moon.cns:2801`|`[State -2, PowerBarExplod]`|非SNES暫不接入（3DO／SEGA或其meter／combo準備）|
|`moon.cns:2820`|`[State -2, PowerBarExplodBG]`|非SNES暫不接入（3DO／SEGA或其meter／combo準備）|
|`moon.cns:2839`|`[State 950, PowerBarExplod]`|非SNES暫不接入（3DO／SEGA或其meter／combo準備）|
|`moon.cns:2858`|`[State 950, PowerBarExplodBG]`|非SNES暫不接入（3DO／SEGA或其meter／combo準備）|
|`moon.cns:2877`|`[State -2, PowerBarExplod]`|非SNES暫不接入（3DO／SEGA或其meter／combo準備）|
|`moon.cns:2896`|`[State -2, PowerBarExplodBG]`|非SNES暫不接入（3DO／SEGA或其meter／combo準備）|
|`moon.cns:2915`|`[State -2, PowerBarExplod]`|非SNES暫不接入（3DO／SEGA或其meter／combo準備）|
|`moon.cns:2934`|`[State -2, PowerBarExplodBG]`|非SNES暫不接入（3DO／SEGA或其meter／combo準備）|
|`moon.cns:3941`|`[State -3, HPBarHelper]`|非SNES暫不接入（3DO／SEGA或其meter／combo準備）|
|`moon_Common.cns:137`|`[State 20, VelSet]`|非SNES暫不接入（3DO／SEGA或其meter／combo準備）|
|`moon_Common.cns:144`|`[State 20, VelSet]`|非SNES暫不接入（3DO／SEGA或其meter／combo準備）|
|`moon_Common.cns:181`|`[State 20, CtrlSet]`|非SNES暫不接入（3DO／SEGA或其meter／combo準備）|
|`moon_Common.cns:193`|`[State 20, CtrlSet]`|非SNES暫不接入（3DO／SEGA或其meter／combo準備）|
|`moon_Common.cns:219`|`[State 20, ChangeState]`|非SNES暫不接入（3DO／SEGA或其meter／combo準備）|
|`moon_Common.cns:272`|`[State 40, VarSet]`|非SNES暫不接入（3DO／SEGA或其meter／combo準備）|
|`moon_Common.cns:281`|`[State 40, VarSet]`|非SNES暫不接入（3DO／SEGA或其meter／combo準備）|
|`moon_Common.cns:308`|`[State 40, ChangeState]`|非SNES暫不接入（3DO／SEGA或其meter／combo準備）|
|`moon_Helper.st:838`|`[State 1050, VelSet]`|非SNES暫不接入（3DO／SEGA或其meter／combo準備）|
|`moon_Helper.st:1254`|`[State 3150, NoShadow]`|非SNES暫不接入（3DO／SEGA或其meter／combo準備）|
|`moon_Helper.st:1259`|`[State 3150, StateTypeSet]`|非SNES暫不接入（3DO／SEGA或其meter／combo準備）|
|`moon_Helper.st:1265`|`[State 3150, StateTypeSet]`|非SNES暫不接入（3DO／SEGA或其meter／combo準備）|
|`moon_Helper.st:1272`|`[State 3150, PlayerPush]`|非SNES暫不接入（3DO／SEGA或其meter／combo準備）|
|`moon_Helper.st:1279`|`[State 3150, HitOverride]`|非SNES暫不接入（3DO／SEGA或其meter／combo準備）|
|`moon_Helper.st:1286`|`[State 3150, HitBy]`|非SNES暫不接入（3DO／SEGA或其meter／combo準備）|
|`moon_Helper.st:1292`|`[State 3150, PlaySnd]`|非SNES暫不接入（3DO／SEGA或其meter／combo準備）|
|`moon_Helper.st:1298`|`[State 3150, HitDef]`|非SNES暫不接入（3DO／SEGA或其meter／combo準備）|
|`moon_Helper.st:1328`|`[State 3150, TargetState]`|非SNES暫不接入（3DO／SEGA或其meter／combo準備）|
|`moon_Helper.st:1336`|`[State 3150, Explod]`|非SNES暫不接入（3DO／SEGA或其meter／combo準備）|
|`moon_Helper.st:1350`|`[State 3150, Explod]`|非SNES暫不接入（3DO／SEGA或其meter／combo準備）|
|`moon_Helper.st:1364`|`[State 3150, ChangeState]`|非SNES暫不接入（3DO／SEGA或其meter／combo準備）|
|`moon_Helper.st:1369`|`[State 3150, Invisible]`|非SNES暫不接入（3DO／SEGA或其meter／combo準備）|
|`moon_Helper.st:1376`|`[State 3150, DestroySelf]`|非SNES暫不接入（3DO／SEGA或其meter／combo準備）|
|`moon_Helper.st:1395`|`[State 3151, NoShadow]`|非SNES暫不接入（3DO／SEGA或其meter／combo準備）|
|`moon_Helper.st:1401`|`[State 3151, DestroySelf]`|非SNES暫不接入（3DO／SEGA或其meter／combo準備）|
|`moon.cmd:788`|`[State -1, 3DO AI Super Moon Spiral Heart Attack]`|非SNES暫不接入（3DO／SEGA或其meter／combo準備）|
|`moon.cmd:812`|`[State -1, AI Guard]`|非SNES暫不接入（3DO／SEGA或其meter／combo準備）|
|`moon.cmd:830`|`[State -1, AI Stand Light Punch]`|非SNES暫不接入（3DO／SEGA或其meter／combo準備）|
|`moon.cmd:861`|`[State -1, AI Stand strong Punch]`|非SNES暫不接入（3DO／SEGA或其meter／combo準備）|
|`moon.cmd:899`|`[State -1, AI Stand Light Kick]`|非SNES暫不接入（3DO／SEGA或其meter／combo準備）|
|`moon.cmd:932`|`[State -1, AI Standing Strong Kick]`|非SNES暫不接入（3DO／SEGA或其meter／combo準備）|
|`moon.cmd:968`|`[State -1, AI 5]`|非SNES暫不接入（3DO／SEGA或其meter／combo準備）|
|`moon.cmd:996`|`[State -1, AI 2]`|非SNES暫不接入（3DO／SEGA或其meter／combo準備）|
|`moon.cmd:1029`|`[State -1, AI 9]`|非SNES暫不接入（3DO／SEGA或其meter／combo準備）|
|`moon.cmd:1068`|`[State -1, AI 8]`|非SNES暫不接入（3DO／SEGA或其meter／combo準備）|
|`moon.cmd:1103`|`[State -1, AI Jump Light Punch]`|非SNES暫不接入（3DO／SEGA或其meter／combo準備）|
|`moon.cmd:1121`|`[State -1, AI Jump Strong Punch]`|非SNES暫不接入（3DO／SEGA或其meter／combo準備）|
|`moon.cmd:1139`|`[State -1, AI Jump Light Kick]`|非SNES暫不接入（3DO／SEGA或其meter／combo準備）|
|`moon.cmd:1157`|`[State -1, AI Jump medium Kick]`|非SNES暫不接入（3DO／SEGA或其meter／combo準備）|
|`moon.cmd:1173`|`[State -1, AI Moon Screw Punch]`|非SNES暫不接入（3DO／SEGA或其meter／combo準備）|
|`moon.cmd:1198`|`[State -1, AI Swinging Marshmallow]`|非SNES暫不接入（3DO／SEGA或其meter／combo準備）|
|`moon.cmd:1216`|`[state -1, AI Jump]`|非SNES暫不接入（3DO／SEGA或其meter／combo準備）|
|`moon.cmd:1229`|`[State -1, AI Run]`|非SNES暫不接入（3DO／SEGA或其meter／combo準備）|
|`moon.cmd:1252`|`[State -1, AI Walk]`|非SNES暫不接入（3DO／SEGA或其meter／combo準備）|
|`moon.cmd:1266`|`[State -1, AI Dash Back]`|非SNES暫不接入（3DO／SEGA或其meter／combo準備）|
|`moon.cmd:1670`|`[State -1, Super Moon Spiral Heart Attack]`|非SNES暫不接入（3DO／SEGA或其meter／combo準備）|
|`moon.cmd:1689`|`[State -1, Moon Screw Punch]`|非SNES暫不接入（3DO／SEGA或其meter／combo準備）|
|`moon.cmd:1705`|`[State -1, Moon Tiara Action]`|非SNES暫不接入（3DO／SEGA或其meter／combo準備）|
|`moon.cmd:1723`|`[State -1, Body Attack]`|非SNES暫不接入（3DO／SEGA或其meter／combo準備）|
|`moon.cmd:1741`|`[State -1, Run Back]`|非SNES暫不接入（3DO／SEGA或其meter／combo準備）|
|`moon.cmd:1774`|`[State -1, Stand Light Punch]`|非SNES暫不接入（3DO／SEGA或其meter／combo準備）|
|`moon.cmd:1791`|`[State -1, Stand Strong Punch]`|非SNES暫不接入（3DO／SEGA或其meter／combo準備）|
|`moon.cmd:1808`|`[State -1, Stand Light Kick]`|非SNES暫不接入（3DO／SEGA或其meter／combo準備）|
|`moon.cmd:1825`|`[State -1, Standing Strong Kick]`|非SNES暫不接入（3DO／SEGA或其meter／combo準備）|
|`moon.cmd:1842`|`[State -1, Crouching Light Punch]`|非SNES暫不接入（3DO／SEGA或其meter／combo準備）|
|`moon.cmd:1859`|`[State -1, Crouching Strong Punch]`|非SNES暫不接入（3DO／SEGA或其meter／combo準備）|
|`moon.cmd:1876`|`[State -1, Crouching Light Kick]`|非SNES暫不接入（3DO／SEGA或其meter／combo準備）|
|`moon.cmd:1893`|`[State -1, Crouching Strong Kick]`|非SNES暫不接入（3DO／SEGA或其meter／combo準備）|
|`moon.cmd:1910`|`[State -1, Jump Light Punch]`|非SNES暫不接入（3DO／SEGA或其meter／combo準備）|
|`moon.cmd:1919`|`[State -1, Jump Strong Punch]`|非SNES暫不接入（3DO／SEGA或其meter／combo準備）|
|`moon.cmd:1928`|`[State -1, Jump Light Kick]`|非SNES暫不接入（3DO／SEGA或其meter／combo準備）|
|`moon.cmd:1937`|`[State -1, Jump Strong Kick]`|非SNES暫不接入（3DO／SEGA或其meter／combo準備）|
|`moon.cns:2606`|`[State -2, VarSet]`|非SNES暫不接入（3DO／SEGA或其meter／combo準備）|
|`moon.cns:2612`|`[State -2, VarSet]`|非SNES暫不接入（3DO／SEGA或其meter／combo準備）|
|`moon.cns:2618`|`[State -2, ModifyExplod]`|非SNES暫不接入（3DO／SEGA或其meter／combo準備）|
|`moon.cns:2625`|`[State -2, VarAdd]`|非SNES暫不接入（3DO／SEGA或其meter／combo準備）|
|`moon.cns:2633`|`[State -2, VarSet]`|非SNES暫不接入（3DO／SEGA或其meter／combo準備）|
|`moon.cns:2638`|`[State -2, VarSet]`|非SNES暫不接入（3DO／SEGA或其meter／combo準備）|
|`moon.cns:2643`|`[State -2, VarAdd]`|非SNES暫不接入（3DO／SEGA或其meter／combo準備）|
|`moon.cmd:1655`|`[State -1, VarSet]`|非SNES暫不接入（3DO／SEGA或其meter／combo準備）|
|`moon.cmd:1660`|`[State -1, VarSet]`|非SNES暫不接入（3DO／SEGA或其meter／combo準備）|

## 原檔未完成：沿用停用

按之前作者確認，第二組重複S801及其未完成throw分支暫不啟用；195等未完成素材／入口不因今次核對而自動啟用。以下只列具體controller段落。

|文件／行|Controller State 段落|結果|
|---|---|---|
|`moon.cns:243`|`[State 195, CtrlSet]`|原檔未完成／重複unused分支，保持停用|
|`moon.cns:248`|`[State 195, ChangeState]`|原檔未完成／重複unused分支，保持停用|
|`moon.cns:1057`|`[State 801, VarSet]`|原檔未完成／重複unused分支，保持停用|
|`moon.cns:1063`|`[State 801, VarSet]`|原檔未完成／重複unused分支，保持停用|
|`moon.cns:1069`|`[State 801, HitDef]`|原檔未完成／重複unused分支，保持停用|
|`moon.cns:1085`|`[State 801, ChangeState]`|原檔未完成／重複unused分支，保持停用|
|`moon.cns:1098`|`[State 811, VarSet]`|原檔未完成／重複unused分支，保持停用|
|`moon.cns:1106`|`[State 811, PlaySnd]`|原檔未完成／重複unused分支，保持停用|
|`moon.cns:1112`|`[State 811, PlaySnd]`|原檔未完成／重複unused分支，保持停用|
|`moon.cns:1118`|`[State 811, PlaySnd]`|原檔未完成／重複unused分支，保持停用|
|`moon.cns:1124`|`[State 811, TargetBind]`|原檔未完成／重複unused分支，保持停用|
|`moon.cns:1129`|`[State 810, Bind 1]`|原檔未完成／重複unused分支，保持停用|
|`moon.cns:1134`|`[State 810, Bind 1]`|原檔未完成／重複unused分支，保持停用|
|`moon.cns:1139`|`[State 810, Width]`|原檔未完成／重複unused分支，保持停用|
|`moon.cns:1144`|`[State 810, TargetBind]`|原檔未完成／重複unused分支，保持停用|
|`moon.cns:1149`|`[State 810, TargetLifeAdd]`|原檔未完成／重複unused分支，保持停用|
|`moon.cns:1154`|`[State 810, TargetState]`|原檔未完成／重複unused分支，保持停用|
|`moon.cns:1159`|`[State 810, ChangeState]`|原檔未完成／重複unused分支，保持停用|
|`moon.cns:1172`|`[State 822, ChangeAnim2]`|原檔未完成／重複unused分支，保持停用|
|`moon.cns:1177`|`[State 822, ScreenBound]`|原檔未完成／重複unused分支，保持停用|
|`moon.cns:1183`|`[State 822, SelfState]`|原檔未完成／重複unused分支，保持停用|
|`moon.cns:1196`|`[State 823, VelAdd]`|原檔未完成／重複unused分支，保持停用|
|`moon.cns:1201`|`[State 823, SelfState]`|原檔未完成／重複unused分支，保持停用|
|`moon.cns:1208`|`[State 823, ChangeState]`|原檔未完成／重複unused分支，保持停用|
|`moon.cns:1213`|`[State 823, SelfState]`|原檔未完成／重複unused分支，保持停用|

## 檢查範圍及驗證

- 原檔hash及精確行數見下；註解／空白不執行。既定UI替代、作者指定不需debug／H950及未完成停用規則沿用，不重複列成漏接。
- 有讀取同資料夾.def及.air核對依賴；已存在Web AIR資料共215個action、3,311個frame的sprite reference／offset／tick與目前AIR相同。這不是逐像素比較，也沒有重新壓縮／匯出圖片音訊。
- WATCH Moon/Moon 2,200tick、240個controller條件執行檢查、防禦退出P1/P2站／蹲、random綁定左右方向均通過；Silver Crystal實際跑過3000→3001→3002→52→0。TimeRemaining核對99秒=5940tick、倒數及暫停、無限時間=-1。測試涵蓋的路徑不代表所有random分支與對戰情況均窮舉。
- 本機可讀所需依賴，暫時不需要額外上傳檔案。

|文件|行數|SHA256|
|---|---:|---|
|moon.cns|4023|`5b5ff92022c17a138b94252dc68b44696bd3550c2878c600896563f848e4ff18`|
|moon_Common.cns|2321|`57942fee6c8ec31b0dd2d75c342029da9bb9eabee7ea7cf2e8946c1b7b7b7885`|
|moon_Helper.st|1761|`acf324cf12b11ca278d64bd8aa75b71a8b2de64180e13dbcae86b3ddc32966d1`|
|moon.cmd|1944|`a3cf787e2f1374c00bbfd97a5f7c510110b5ca5899461319078b64afa0064a0a`|
