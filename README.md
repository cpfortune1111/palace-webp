# Palace Web — Sailor Venus

[開啟遊戲](https://cpfortune1111.github.io/palace-webp/)

## 最新版本：0.23.23 — Keyboard Settings / Run FX M1

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

- P1：方向鍵／WASD 移動，X 出拳。P2：J／L 移動、U 單次出拳；按 J／L 自動切 Keyboard，可切回 Dummy 防禦測試。
- Input 可選 Auto／Keyboard／Touch；失焦清除 held input。右上 □ 顯示 CLSN，Ⅱ 暫停／逐 tick，↓ 匯出最近 600 ticks 診斷 JSON（非 replay save）。
- 更新後確認 Prototype、BUILD、READY 都是 0.23.19。測試命中／連續站防／揮空、兩個 facing、同時 X／U、角落推退與受擊恢復。
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
- [ ] 0.23.22 雙方 100／105／106 動作已接入、自動回歸通過；使用者人工驗收待測。共用音效及煙塵特效待接入。
- [ ] P2 蹲／跳、P1 跑跳 State 40 額外來源分支、完整 CMD buffer／取消鏈／-1／-2／-3、可重播 input／state trace。
- [ ] 普通技／空中受擊／倒地／起身與各種 HitDef priority，按来源相依順序接入。
- [ ] Helper／Explod／Projectile／Pause／SuperPause、完整音效 channel／pause 語義、必殺技／能量／無敵／特效。
- [ ] Intro／win／taunt／KO／round／AI、完整招式表；每招與原 IKEMEN 並排比對、手機性能／输入回歸。

下個切片：補共同 Common runner 及 P2 蹲下／站蹲切換，沿用已 PASS 的地面攻擊／防禦／角落／互中，不跳過 source 驗收。
