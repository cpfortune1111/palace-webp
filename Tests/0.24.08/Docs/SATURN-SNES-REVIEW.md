# Saturn SNES 核對 — 0.24.08-r24

以原效果是否完成判斷接入，不要求改用通用 IKEMEN。核對 saturn.cns、saturn_Common.cns、saturn_Helper.st、saturn.cmd 共 7,889 行／680 個 controller；AIR 另核對 128 個 Action、1,057 格。原檔未改寫。以下只列本次變更、差異及排除項，State 指個別 controller 段落。

## 今次已接入／同步

共同步 82 個差異 controller 段落，沿用現有執行器。

- saturn.cns：S200／210／230／240／400／410／430／440 的 Recovery `StateTypeSet`（`movetype = I`）；S1000／1100／1200 的 AI L/H `VarSet`。
- saturn_Common.cns：S10／20／40、S120／130／131／140／150／151／152／153 的輸入、防禦與退出 controller；啟用既有 sourceGuardStates 路徑，S20 不再重複執行舊 aiWalkControllers。
- saturn.cmd：SNES 玩家及 AI 各 22 個 ChangeState 段落，更新距離、取消、Recovery 及機率條件。Recovery Walk 保留先前確認的 `ctrl = 1`。超必沿用作者指定 `Life <= LifeMax/4 || TimeRemaining = [0,TimeElapsed / 5]`。
- S52：移除重複 PlaySnd 路徑，沿用既有 landingSound。
- A106：原 AIR 重複兩次，按作者「重複只用第一個」規則，改回 `105,4,0,0,1`／`105,5,0,0,2`；補原 SFF 兩張圖並壓縮 WebP，還原兩格原 Clsn2。原第二個 A106 引用不存在的 11,0，今次不採用。Saturn 其餘 AIR／StateDef 未發現重複定義。
- 超必光點改用共用中性圖及作者色表，詳見 SUPER-SPARK-COLOURS.md。

## 尚未啟用，未發現實際 SNES 故障

- saturn.cmd:1254 `[State -1, VarSet]`：每次執行設 root `var(1) = 0`。
- saturn.cmd:1259 `[State -1, VarSet]`：符合站立可控／普通攻擊取消條件時設 root `var(1) = 1`。

目前輸入執行器讀 ChangeState，這兩段需額外處理有順序的非轉狀態段落。現有 root var(1) 預設 0；Common S131 判斷 `< 50`，原本 0／1 及目前 0 均符合，因此不能據此判定已有可見 BUG。Helper 內 var(1) 屬獨立實體。先記錄，不為這兩段重寫五角色的共用輸入流程。

## 沿用效果／暫不接入

- S175：原直接回 S170；現有缺 A175 時 fallback 同樣回 S170，效果等同。
- S190：維持現有 1v1 順序宣言，額外組隊／PlayerID 分支不套入本試玩版。
- 43 個非 SNES 段落、12 個原本 triggerall=0／StateNo=999 的未完成入口保持停用。
- S-2 的 8 個模式切換／UI VarSet／VarAdd 由鎖定 SNES 的現有選單取代。
- DisplayToClipboard、juggle／airjuggle、movecamera 按作者要求不接；Helper9999 保留。
- HitDef／Projectile、Helper、globalControllers、command 定義未在本次整批改寫。

## 驗證及限制

- Saturn 對 Saturn WATCH 2,200 ticks：無 runtime error／NaN，見普通技、三種必殺及防禦流程。
- 251 次 controller 條件求值無錯；16 組 P1／P2、玩家／AI、站立／蹲下防禦退出通過，另 4 組 S140 退出通過。
- 光點 26 組配色快取、Team1／Team2 選色、上飄及 64 ticks 後移除通過。
- 以上不是所有隨機對戰與所有招式組合零 BUG 的保證；未實測的原檔疑點不當作已重現故障。
