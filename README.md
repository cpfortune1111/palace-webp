# Palace Web — Sailor Venus

[開啟遊戲](https://cpfortune1111.github.io/palace-webp/)

## 最新版本：0.23.19 — GetHit / Contact Semantics M1

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
- [x] 本版 GetHit／contact queries、range AST、source HitVelSet 地面接線。
- [ ] 全量 SFF 分批 atlas／metadata：linked sprites／palettes／透明度／axis／AIR flips／Clsn default。
- [ ] 動態／外部 source references 追至 Helper／CMD；全量未知 controller／trigger／expression 報告。
- [ ] P1／P2 完整共同 fighter／Common runner；source controllers 逐條移除近似實作、timer／動畫 clock 與順序驗證。
- [ ] P2 蹲／跳／跑、完整 CMD buffer／取消鏈／-1／-2／-3、可重播 input／state trace。
- [ ] 普通技／空中受擊／倒地／起身與各種 HitDef priority，按来源相依順序接入。
- [ ] Helper／Explod／Projectile／Pause／SuperPause、完整音效 channel／pause 語義、必殺技／能量／無敵／特效。
- [ ] Intro／win／taunt／KO／round／AI、完整招式表；每招與原 IKEMEN 並排比對、手機性能／输入回歸。

下個切片：補共同 Common runner 及 P2 蹲下／站蹲切換，沿用已 PASS 的地面攻擊／防禦／角落／互中，不跳過 source 驗收。
