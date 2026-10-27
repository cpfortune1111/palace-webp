# 五個角色的 B1–B9 實際使用檢查（R2）

先前候選清單係根據原引擎邏輯對照及之後修正紀錄整理，並非聲稱五個角色已經全部重現。今次按舊版實際載入的 Venus、Moon、Jupiter、Neptune、Saturn 匯出資料及舊版執行分支重新檢查；原始候選掃描記錄見 [B1-9-AUDIT.json](B1-9-AUDIT.json)。同一 Source 可出現於多個匯出表，記錄數不等於 Bug 數。

| 項目 | 五個角色的實際情況 | 今次決定 |
|---|---|---|
| B1 PosAdd Facing | 五人只在 S5101 用到 X PosAdd，讀取 down.bounce.offset.x；五人現值全部為 0，所以朝向乘法差異不造成位移差異。 | 不改。以後非零值再測。 |
| B2 Helper Turn | 現有 Helper State 表冇 Turn Controller。Root／reaction 的 Turn 不等同呢項候選錯誤。 | 不改。 |
| B3 Helper SprPriority | 現有 Helper Controller 冇 SprPriority；StateDef 的 sprpriority 由原本入 State 分支處理，不能混為同一錯誤。 | 不改。 |
| B4 reaction ignorehitpause | 現有 5xxx reaction Controller 冇要求 ignorehitpause=1 的項目；亦冇在 guard 路徑找到對應使用。Helper 的 ignorehitpause 不屬於呢個 reaction 跳過問題。 | 不改。 |
| B5 persistent | 檢查到的現有 Controller 使用預設／0／1，冇非預設間隔計數的使用；未證實有候選的間隔／同 State 重入缺陷。 | 不搬通用排程器。 |
| B6 Parent／Root 變數 | 現有會執行 ParentVarSet/Add 的 Helper 都由 Root 建立或沿同一 Helper ChangeState；Helper State 表冇再建 Helper，變數目標亦全部係整數 var。實際 Parent 就係 Root，未碰到候選的巢狀 Parent／fvar 錯配。 | 保留現有路徑。 |
| B7 HitVelSet | 現有使用係讀自己 GetHit，冇 redirectid；舊分支接收自己受擊 context，冇發現借錯另一角色速度的實際用法。 | 不改。 |
| B8 DefenceMulSet | Moon／Jupiter／Neptune／Saturn 在 S5001／5011 使用 value=1，自身重設防禦倍率；冇 Helper／redirect 用法。 | 不搬通用倍率系統。 |
| B9 殘影角度快照 | Moon／Jupiter／Saturn 在 S105 使用 AfterImage；現有資料冇 AngleDraw／AngleSet／AngleAdd／AngleMul，未碰到候選的角度／縮放被後續改寫問題。呢項不等於已驗證所有殘影顏色／透明度參數。 | 不改。 |

結論：未發現五個角色現有資料會觸發先前列出的 B1–B9 缺陷，今次沒有套用九組通用修正。呢個係使用範圍檢查，唔係「整隻遊戲零 Bug」證明；當新增角色／Mode／參數用法，先為該路徑補重現測試。

檢查工具只喺開發時執行，冇將審核掃描加到遊戲每幀循環。R2 只修復已重現的狀態鏈跳轉，以及補回各角色原檔已有但 Web 未匯出的投技受招 Sprite。
