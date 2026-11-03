# r27 對戰修正與 AI 討論

原檔不改寫，只更新 Web 試玩版。三份 r26 LOG 以結構化方式核對，並做下列針對性重現。

## 已修正

1. Moon Tiara Action H1050 對一般 NP／SP Projectile：不能直接把 Helper HitDef priority=2 跟 Projectile projpriority=3 當同一種優先權，否則只取消月冕。今次只處理 Moon H1050 與一般 NP／SP Projectile 互撞，雙方各走自己取消流程；HP Lightning Strike 與其餘既有優先權規則保留。六組真實碰撞框測試：Venus1000／1100、Jupiter1000，Moon在P1或P2，均確認月冕進1051、另一方進projcancelanim。
2. Jupiter Lightning Strike S3005／3006：主角色 body push 只允許對手正處S120／130／131／150–155防禦流程；其他站立、空中、倒地、受擊狀態不推。這讓主角色不再先用Size／Width把對手推離Helper攻擊框。雙方向各測站立0、倒地5110、站防130、防禦硬直151，共八組通過。此為作者指定遊戲行為，不改通用角色推撞。
3. Coconut Cyclone：玩家／AI／attackCommands1100均補Pos Y < 0，避免S105後跳已跨地面但StateType仍A時，被選中1100、播放Time0人聲後立刻按原Pos Y >= 0轉52。c LOG tick1365可見S105 Y≈3、下一格直接52，符合此邊界；完整recentTrace未涵蓋該時段，不能聲稱逐指令證實。LOG中其他有記錄的完整1100均產生H1150；唯一無H1150的1100在tick14947受擊打斷，未當成缺漏發射。測試Y=-1可起手、0及3不可；保留實際空中技時序／重力／Helper資料。
4. Jupiter S20：原前進VelSet只在EnemyMoveType!=A、後退VelSet只在Enemy有AA類近身HitDef；對方處飛行技起手／發射狀態但沒有近身HitDef時，兩分支都不符合，舊速度被摩擦減至近零。c LOG第三回合tick14852起約11ticks見S20、VX≈0.096且繼續遞減。補無AA近身HitDef時的前進分支，沿用原走速；測90ticks維持6.6、位移587.4。沒有修改全角色決策頻率、隨機機率或防禦退出節奏。

## AI 抽搐：僅分析，未修改

防禦與走路由多段每tick重評估的條件決定。MoveType、InGuardDist、HitDefAttr、對手StateType、隨機數及身體距離一變，就可能在防禦／退出或前進／後退之間切換；缺少持續意圖與進出不同門檻。並非看到S140就代表已成功擋格，S140是退出防禦。

建議另開下一步：
- 防禦：依即將到達的攻擊框／飛行物與高低段判斷威脅；進入後短暫保持，威脅消失連續數tick才退出。難度的反應時間及防禦機率每次攻勢決定，不每tick抽籤。
- 移動：先決定接近／保持／後退，維持短決策窗口；接近與退出使用不同距離門檻，緊急防禦仍可打斷。不硬鎖S20，也不強制100%防禦。
- 具體窗口和門檻須作者確認後再測，今次不加入。
