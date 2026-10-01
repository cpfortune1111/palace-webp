# Venus Palace Web — Source Import V1 / TODO

盤點日期：2026-10-02。遊戲基線：0.23.7；本次不修改可玩版本或鏡頭。

## 已完成
- [x] 按 SailorVenus.def 追齊 9 個實際檔案；cns / st 指向同一檔案，已去重。
- [x] 原檔完整本機匯入及 SHA-256 清單，包含 SFF / SND；完整來源包見 venus-source-import-v1.zip。
- [x] 85 個 Statedef 區段、661 個 controller 區段、39 個 Command 區段，保留來源行號與原始表達式。
- [x] 133 個 AIR actions，保留影格、offset、flip、時長、LoopStart / Clsn 原文。
- [x] SFF 760 個 sprite directory entries、708 個 palette entries；SND 67 個 sound entries。
- [x] 對照目前 index.html 的 controller handlers，分開「有 handler」與「完整支援」。
- [x] 靜態 state / action / sound 引用檢查；動態或外部引用另列，未假裝已解析。

## P0 — 來源一致性及匯入驗收
- [x] 對照 IKEMEN 確認 3 個 904,-1 為刻意空影格；匯入器已修正誤報，保留影格時間。
- [ ] 餘下 14 個缺失 sprite 引用、11 個不同 pair；已定位來源，仍需與原 IKEMEN 並排確認，不自行補圖。
- [ ] 核對 referenceChecks 所列 missing / dynamic-or-external-review；追至 CNS、Helper、CMD 的觸發條件。
- [x] 逐 state 比對舊 repo 與本機來源：venus.cns 20 個共同 state 改變、增 2／刪 1；Common 3 個 state 改變。State 200 確有差異，不直接覆蓋。
- [x] 全部 6 個靜態缺失引用完成條件核對：3 個 SelfAnimExist guard、2 個 State 999 限制入口、1 個有序 fallback。
- [x] 匯出並驗證全部 67 個原樣 WAV payload；尚未接入瀏覽器播放。
- [ ] 建立全量 SFF→分批 atlas / metadata 及 SND→音效匯出器，驗證 linked sprite / palette、透明度、axis、AIR flip 與 Clsn default 生效範圍。
- [ ] 全量編譯器對未知 controller / trigger / expression 明確報告；不靜默忽略。

## P1 — 最小完整對戰閉環（下一個可玩里程碑）
- [ ] 固定 60 Hz 邏輯 tick，與顯示幀率分離；建立可重播 input / state trace。
- [ ] State 200：CMD→State→AIR Clsn→原始 HitDef→命中／防禦→hitpause→damage／擊退→恢復。
- [ ] P1 / P2 同一套角色執行器，Venus vs Venus；移除 P2 硬編碼受擊數值。
- [ ] 逐項補足 State 200 所需 trigger、HitDef 欄位及共同受擊／防禦 state controllers。
- [ ] 驗收：命中、揮空、防禦各可重播；兩邊可互相受擊；數值對照原 CNS 與 IKEMEN。

## P2 — 普通動作及普通技
- [ ] 站立／蹲下／空中攻擊，跑步／後跳、防禦、倒地／起身，按來源相依順序接入。
- [ ] -1 / -2 / -3、VarAdd / VarRangeSet 等變數操作及完整 CMD 時序／buffer／轉向。
- [ ] 回歸：Turn 5 / 6、空中 facing lock、stage edge、local VX / world velocity、atlas 裁切。

## P3 — Venus 必殺、特效與音效
- [ ] Helper / ParentVarSet / BindToRoot / DestroySelf，含 root / parent / helper trigger redirects。
- [ ] Explod / RemoveExplod / Projectile、Pause / SuperPause、PlaySnd / StopSnd。
- [ ] 按實際招式依賴補完生命／能量、hit override / invulnerability、取消技及特效透明混合。

## P4 — 完整角色驗收
- [ ] 勝負／回合、intro／win／taunt、AI、完整招式表、音效及性能／手機輸入回歸。
- [ ] 每招與原 IKEMEN 並排對照；差異逐條留在 TODO，不以 Web 特有猜測補行為。

## 邊界
- 原始文字來源與 JSON inventory 提交 GitHub 的 sources/venus；完整 SFF/SND 留在本機來源包，尚未上傳 GitHub。
- 這是來源匯入，不是已完成全量角色執行；有 handler 不等於語義完整。
- 鎖定既有鏡頭校準；不以本機 StageTraining.def 改寫現有 Web 鏡頭。
- 暫不加入其他角色或擴充舞台。下一步先做 P0 缺口核對，再落實 P1 State 200 閉環。
