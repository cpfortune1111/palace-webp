# Venus Source Audit V1 — 下一步驗收

## 最新進度：0.23.18
修正 P2 出拳入口依賴 P1 ctrl，同 tick X/U 可同步開始；State 200 地面相同 priority=1, Hit 支援互中，雙方 hitpause／hitshake／恢復已驗證，詳見 NOTES_02318.md。完整 CMD、其他 priority／投技／空中受擊仍未實作。以下為歷史進度。
P2 新增 J/L 地面前後行與手動後防，U 出拳保留；「控制」可切回 Dummy。雙方使用同一既有 controller handlers，詳見 NOTES_02317.md。P2 蹲／跳與完整 CMD、同時命中尚未實作，下一切片按來源相依順序補齊。以下為歷史進度。
兩邊 State 200 共用 AST／trigger 評估，新增 U 單次 P2 出拳測試鍵，詳見 NOTES_02316.md。未新增 P2 移動或完整 CMD；下一切片仍為共用 controller handlers 與 P2 移動輸入。以下為歷史進度。
右上「P2 出拳測試」接通 P2→P1 地面命中／站防／恢復與角落推退，詳見 NOTES_02315.md。僅單次測試輸入，未加入 P2 移動／完整 CMD 或 simultaneous-hit 判定。下一切片應統一雙方完整 controller／input context；以下為歷史進度。
共用 ground HitDef／AIR collision context 已接入，詳見 NOTES_02314.md。此版未新增 P2 攻擊操控；下一切片仍是雙向 controller／Common runner 與 P1 受擊。保留以下歷史進度。
0.23.12 hitshake x2 已由使用者 PASS；0.23.13 新增最近 600 ticks 的 input／state／hitpause 診斷 JSON 匯出。右上「↓」下載，詳見 NOTES_02313.md。此為核對工具，不是完整重播存檔。下面保留初次來源盤點；地面防禦、cornerpush、CLSN／HUD 已有後續版本補齊，見 VENUS_TODO.md。

下一個對戰功能里程碑仍為 P1/P2 共用 fighter context、雙向 State 200；先逐項對照原 CNS／Common controllers，保留已 PASS 的角落／防禦／hitshake 行為，不跳過驗收。

## 作者確認（2026-10-02 更新，優先於下方初次盤點）
122,0 與 951,99 均是刻意空影格；Action 645／投技未完成；空中無防禦；175／5500 未完成，使用現有 lose/default fallback。匯入器已更新，現在剩餘 9 個缺圖引用全屬 Action 645。State 200 地面切片已接入 0.23.8，見 NOTES_0238.md。

日期：2026-10-02。對照基線：0.23.7。這次先完成來源缺口核對及 State 200 相依盤點，不改遊戲行為。

## 6 個靜態引用缺口

| 引用 | 來源 | 判定 |
|---|---|---|
| State 801 / 800 | venus.cmd:798 / 815 | 兩個 Throw 入口均要求 StateNo=999；不應自行創造投技。這是限制入口，不宣稱全域不可達。 |
| Action 44 | venus_Common.cns:312 | SelfAnimExist(44) guard；後續有 41/42/43 fallback。 |
| Action 175 | venus_Common.cns:960 | 前置 controller 在 Time=0 且 !SelfAnimExist(175) 時轉往 170；必須保留 controller 次序及轉 state 後停止舊 state 執行的語義。 |
| Action 5140 | venus_Common.cns:1912 | SelfAnimExist(5140) guard；另有 5110 fallback，須支援範圍比較。 |
| Action 5500 | venus_Common.cns:2132 | SelfAnimExist(5500) guard；Statedef 已給 anim=5300。 |

## AIR / SFF 缺口

初次盤點的 17 次引用中，3 次 904,-1 是刻意空影格，已修正匯入器的誤報。真正缺圖為 14 次引用、11 個不同 sprite pairs：122,0；645,0–8；951,99。

- 122,0 出現在 Action 122/132/142/152；原 SFF 沒有該 pair，不能憑外觀換成別張。
- Action 645 的 9 個 frames 缺圖；CNS 有 Anim=645 分支，仍需追動態動畫選擇，不能當作完全未使用。
- Action 9041 的 3 個 904,-1：IKEMEN src/anim.go 的 UpdateSprite 在 group 或 number=-1 時清空 sprite；屬刻意空影格，必須保留 2/3/4 ticks，不補圖、不刪時間。
- 951,99 缺圖；Helper 有多個 Explod anim=951 入口。全量 Helper 接入前須確認原引擎顯示結果。
- SFF 除 PNG format 10/12，尚有兩個非 linked format 4 壓縮 sprite。舊 turn exporter 不能當成全量匯出器使用。

## State 200 下一個實作範圍

原始 CNS 與舊 repo CNS 不同，不能只把硬編碼 damage=20 改成參數就宣稱完整。

1. 固定邏輯 tick、可重播輸入，以及兩邊共用 fighter context。
2. 保留原 CMD 的 ctrl 入口及 MoveType=I 連段／重入條件。
3. 原 CNS：AnimElem=4 HitDef；AnimElemTime(5)>0 後可按上／下轉 40/10，MoveType 改 I；AnimTime=0 回 0。
4. HitDef 必須讀原始 damage=20,0、pausetime=8,8、ground/guard velocity=-16/-24、slidetime=11/16、hittime=15/22，以及 cornerpush=-24/-28；不可沿用 P2 近似硬編碼流程。
5. 補 MoveContact / MoveGuarded / P2StateType、GetHitVar / HitShakeOver / HitOver、range expressions、HitVelSet 與防禦 states。
6. AIR 200、0、130/150 及 5000/5005 必須使用每影格來源 Clsn；雙向 hitpause 與 one-hit gate。
7. 命中／揮空／防禦、兩個 facing、corner、不同顯示幀率：同一輸入 trace 應得相同結果。

## 音效匯出

全部 67 個 SND payload 已逐一原樣匯出 WAV；SHA-256 對照、WAV headers 檢查通過。尚未接入瀏覽器播放／channel／pause 語義。

## 保護規則

不改既有 index.html、atlas、鏡頭、Turn 5/6 或空中 facing lock。source_audit.json 提供來源行號、原始 controller、逐 state 語義差異與音效索引；大 binary exports 留在本機 ZIP。

## 重跑

先用 import_venus_sources.py 建立包含完整 SND 的本機來源匯入資料夾，再將該資料夾及舊 repo 原文的 legacy-venus.cns / legacy-venus_Common.cns 交給：

```text
python tools/audit_venus_sources.py --source-import PATH/venus --legacy-dir PATH/legacy --destination PATH/audit
```
