# 大頭像動畫時間表

Moon.air、Jupiter.air、Neptune.air、Saturn.air 分別列出四人的完整動畫。

每行是 `圖片組,影格,0,0,持續 TICK`，每秒 60 TICK。`loopstart` 表示從該行後開始循環；`-1` 表示永久停留。`PLAYSND` 寫在註解中，表示在該位置開始播放語音，`duration` 是語音長度。修改之前的影格時間，匯入時語音起點亦會跟住改。

9000 選角／ACS、9010 決戰準備、9011／9012 決戰宣言、9019 勝敗準備、9020／9021 勝利、9030／9031 KO 敗北、9040／9041 Time Over 敗北。

Moon 喊的動畫仍然循環喊，沒有對口；Moon／Jupiter 勝利仍然轉完 Pose 才講話。

循環動畫播咗一段時間之後先出現的語音（例如 Moon TLose 第二句）會用 `; @sound` 列出絕對 `tick`，因為 AIR 的循環影格只列一次；這種情況請直接改該 `tick`。

可以將修改好嘅 `.air` 交返我，我會匯入、重建介面包再發佈。

自行處理的話，在本測試資料夾執行 `python Tools/quote-timelines.py import Moon`（角色名可換成 Jupiter、Neptune 或 Saturn），再執行 `python Tools/build-presentation-pack.py` 重建介面包，之後更新讀取器內的包大小、雜湊及路徑清單，再發佈。AIR 格式檔是方便編輯的原稿，網頁實際讀取的是重新打包後的時間表。
