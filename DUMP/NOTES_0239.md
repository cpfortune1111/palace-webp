# 0.23.9 — Combat Debug / Priority Fix M1

## 修正
- CLSN viewer 移除 VENUS_ACTION0_CLSN2 殘留引用。P1/P2 都讀原 AIR 的當前 action/element boxes，並用各自 facing 轉世界座標；缺少某 action boxes 不會阻止另一邊顯示。
- 編譯原 CNS Statedef sprpriority；未指定時保留既有值。200=2，IKEMEN HitDef 未指定 p1sprpriority 時保持攻擊方層級，p2sprpriority 預設 0。兩張角色 canvas 按 priority 排層，不再由 DOM 次序永遠把 P2 蓋在上面。
- 5001 保留 inherited A5000，依原 AIR 4+4 ticks 完成後依 CNS 換 A5005。A5000 結尾不再先跳回 5000,0 一幀再換至 5000,10。
- 保留正常 source sequence：A5000 的 5000,0→5000,10；A5005 的 5000,10 六 ticks→5000,0 無限影格，再按 HitOver 回 State 0。並非把 source recovery 動畫鎖死。
- 統一 HUD：P1/P2 各一行 P_S_T_A_E_F_X_Y_VX_VY_HP。F/X/Y/VX/VY 明確帶正負號；VX 兩邊都顯示 CNS/local 值，P2 由 world VX 按 facing 換算；P1 HP 仍是尚未接入受擊的 source life=1000。
- Pause/Step 的 P2 HUD、sprite、CLSN 與 P1 共用同一 logical snapshot，不再混用另一邊的 live animation/time。

## 驗證
- 開啟 CLSN 後執行兩 facing、命中/防禦、轉身、stage edge、Pause/Step 測試：無 browser error。
- Priority 200=2 / 受擊方=0，canvas 層級正確；原 24 個 turn pixel checks 通過。
- 5001 sprite trace 只有 0→10→0，最後一次 0 屬 A5005 的正常 recovery，沒有 10→0→10 的一幀回圈。
- Pause HUD 精確檢查 P1 S200 A200 E4、P2 S5001 A5000 E2，包含 signed position/velocity；CLSN screenshot 已檢視。
- 原 State 200 命中／guard／hitpause、cancel、重入、30/60/120 Hz 回歸通過。

鏡頭校準、空中 facing lock、無空中防禦規則、未完成招式及上一版未完成項目保持不變。
