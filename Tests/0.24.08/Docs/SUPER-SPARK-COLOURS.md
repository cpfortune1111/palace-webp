# 超必光點配色 — r24

一套裁切後中性影格＋程式色階，沿用 A951／A953 相同時序：10 格各 4 ticks，末段空白 24 ticks，合計 64 ticks。保留透明度與白色亮芯，陰影端取作者色表；Moon／SuperMoon 使用先前 Script Gold／Cyan 色階。

|角色|A953|A951|
|---|---|---|
|Moon／SuperMoon|Script Cyan|Script Gold|
|Mercury|#00EDFF|#0080FF|
|Mars|#D299FF|#FF0000|
|Jupiter|#99FFE7|#00FF67|
|Venus|#FFDA00|#FF7F00|
|Pluto|#9978FF|#FF6666|
|Neptune|#00FFEE|#00FFB6|
|Uranus|#FFFF6C|#5C9EFF|
|CMoon|#FF3B9D|#FF80C6|
|Saturn|#8D3EFF|#856CFF|
|LSwatheshia|#BCBCBC|#F86EFF|
|TuxedoMask|#FF5777|#BCBCBC|

Lifebar 角色標上方兩隊都用 A953，超必有效期間循環。角色身上由可用條件 false→true 時飄出一次：Team1 用 A951、Team2 用 A953，位置 y-300、每 tick 上移 2，24–40 ticks 淡出，64 ticks 移除。不接入 3DO POWER BAR 或其他 3DO 系統。

全部色階在戰前建好 Canvas 快取，繪製時不讀取像素。共用 WebP 256×35、2,946 bytes，26 組 Canvas 色階約 434,096 bytes；不是角色完整換色系統。新增未上場角色只有配色設定，不代表已接該角色。

Venus Lifebar 圖集由 2048×2616 改為保留原950／952的64×64；舊光點不再需要大面積透明圖集。其他角色不再為951／953下載專用舊圖集，仍保留其他動作所需頁面。

預覽：../spark-review.html。既有角色圖片、音訊及原始檔保持不變，Saturn A106 補圖另見 SATURN-SNES-REVIEW.md。
