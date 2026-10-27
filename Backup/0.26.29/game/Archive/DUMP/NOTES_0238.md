# 0.23.8 — State 200 Ground Combat M1

## 來源決定
- 投技 800/801、Action 645 未完成：保留來源，不自行完成。
- 官方復刻規則：空中無防禦。122,0 與 951,99 是作者刻意空影格；不補圖。
- 175 DRAW 與 5500 CONTINUE 尚未完成，保留原 CNS 的 lose/預設動畫 fallback。

## 本版實作
- State 200 的 8 個 controllers 由本機 canonical CNS 編譯為獨立 bundle；不覆蓋舊 repo 其他 state。
- PlaySnd 1,0／200,0、HitDef 原始參數、VarSet var(3)、MoveContact/MoveGuarded/P2StateType、up/down cancel、MoveType=I 與 AnimTime return。
- CMD 支援 ctrl 或 State 200/230 MoveType=I 的 X 重入條件；維持 source buffer 與 facing-relative command。
- P1 攻擊／P2 地面受擊驗證：damage 20、雙方 hitpause 8 ticks、擊退 -16、slidetime 11／hittime 15，5000→5001→0。
- 地面防禦測試選單：站立／蹲下／不防禦。standing guard damage 0、velocity -24、slidetime 16／hittime 22，150→151→130。
- P2 ground response adapter 讀取 HitDef 數值與 CNS common 分支；不宣稱已是全量 CNS interpreter。
- Clsn 從原 AIR 逐影格編譯；高拳打不到蹲防 body 是來源碰撞結果，不強行命中。
- AnimElem=4 在第 4 影格起點只啟動一次 HitDef；HitDef 保留至 state 切換，命中框有效期間稍後才接觸亦可命中，同一拳不重複傷害。
- 60 Hz 邏輯 tick，與畫面更新分離；Pause Step 仍一次一個邏輯 tick。
- 原 SFF 匯出 guard 130/131/150/151；4 個相關 WAV 由 SND 原樣匯出。

## 驗證
- 兩個 facing 的命中／站防／蹲防揮空、遠距揮空、一拳單次傷害、雙方 8 ticks freeze、動畫／恢復、up/down cancel、X 重入 Time=0、var(3)。
- 相同攻擊情境分別以 30/60/120 Hz 顯示步進，1 秒後 state／time／兩邊位置／HP 結果一致。
- 回歸 Turn 5/6 共 24 個 pixel orientation checks、站／蹲 turn timing、兩側 edge backward jump、keyboard。
- 鏡頭校準、既有 AIR turn facing 與空中 lock 不變。

## 仍未完成（不要當成完整角色版）
- P2 操作／攻擊及 P1 受擊尚未統一成雙向角色執行器；目前 P2 是 selectable ground test dummy。
- 空中受擊／倒地／KO、全量共同 state 及 controller 語義。
- 原 CNS cornerpush 參數已保留，但尚未完整移植 IKEMEN corner detection／friction 語義。
- spark 905／ForceFeedback、瀏覽器音效 channel 完整語義、autoplay 解鎖提示。
- -1 全量 cancel／連段、ignorehitpause controllers、完整 deterministic input replay。

## 重跑編譯／測試
`compile_state200.py` 使用 outputs/venus 的完整 canonical 匯入資料，輸出 work/venus_battle200.json。
`check-runtime.cjs` 使用本機 work 資料、Playwright 及 Edge；需可讀取 Three.js CDN。
