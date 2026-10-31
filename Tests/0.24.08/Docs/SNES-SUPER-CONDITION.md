# SNES 超必條件 — 0.24.08-r23

按作者確認，已接入 Web 試玩版的五角全部統一為：

```ini
triggerall = Life <= LifeMax/4 || TimeRemaining = [0,TimeElapsed / 5]
```

適用 Venus／Moon／Jupiter／Neptune／Saturn，包含玩家 NRML／AUTO、AI 及共用 attackCommands 副本，共15份已編譯 controller。只更改 SNES 超必的血量／時間條件；各招距離、姿勢、取消、AI機率等其他條件保留。

- Venus／Moon 原本的 `[1,600]` 已改。
- Jupiter／Neptune／Saturn 原本只有低血量限制，已補時間分支。
- Moon AI 額外一條 `Life <= LifeMax/4`、Neptune AI 額外的 `Life < Floor(LifeMax / 4.0)` 及低血量限制已合併，避免仍以 AND 阻止高血量於回合尾段使用超必。
- 判斷與共用 H951 提示一致。99秒回合的邊界是 elapsed=4950、remaining=990 tick（約剩16.5秒）；60秒回合約剩10秒、30秒回合約剩5秒。
- 時間邊界包括0；回合是否可繼續輸入仍由原 round／KO 流程決定。無限時間沒有倒數分支，仍須低血量。
- `juggle`／`movecamera` 仍按作者決定忽略，沒有接入3DO／SEGA。

測試：用實際 Web expression／controller 執行器核對五角的15份完整超必controller，NRML／AUTO各一輪，9種血量／時間情況，合共270個case通過；包含邊界前／邊界、0 tick、25% HP、超過25%、無限時間、60／30秒。亦核對不是SNES模式時這些controller仍不成立。

原生角色文件沒有直接覆寫。本次是作者確認的 Web 規則更新，記錄在各角色 runtime.source.snesSuperRequirement；下次從原檔匯入時仍須保留此作者覆寫。若同步原 CMD，請更換上述條件，並移除同段重複的純低血量 triggerall。
