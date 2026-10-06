# 0.23.73 — Loading 白底／高清字母

百分比置中進度條、填滿 X257–1026；2x 字母半尺寸顯示，全字常駐逐字跳彈。

## 0.23.72 — LunaP Loading 測試頁

19 圖合併 WebP 圖集、逐字 NOW LOADING、LunaP 6 TICK；與 LOGO 預載，新增重載／確定測試頁。

## 0.23.71 — SETTINGS 裝飾保留

設定按鈕直接置於原 OPTIONS 背景，四角縷花保持清晰。

## 0.23.70 — SETTINGS 彈窗／模式流程

提早白屏、主頁淡入；SNES 預設、TRAINING 雙人確認、ARCADE NEXT → ACS／對手專屬場景。

## 0.23.69 — 城堡進門／分模式選角

鏡頭推進至入口、裝飾退場；中前層光點飛出畫面。ARCADE 單人、TRAINING 雙角色單組控制、WATCH 隱藏 COMMAND。

## 0.23.68 — 選角光點／主頁前進轉場

選角光點平均分三層；ACS 同款光暈、數量減半。場景頁保留模式圖示，主頁各模式新增進門／白屏／Loading 轉場。

## 0.23.67 — 宣言入場留白

決戰／勝敗頭像停定後留白 15 TICK 才啟動宣言；所有 ROUND 旁白後保留 30 TICK。

## 0.23.66 — 旁白留白／1HP 測試

ROUND 旁白後留白 30 TICK；決戰／勝敗宣言留白 15 TICK。縮細 KILL PLAYER，新增 ALL 1HP。

## 0.23.65 — KO 動作完成／KILL PLAYER 測試

完局著地不再強制 S0；狀態循環兩次才救援，無限停格逾 1200 TICK 才重設。右上 KILL PLAYER 可選 RANDOM／P1／P2／ALL。

## 0.23.64 — 決戰／勝敗宣言

頭像高 360px，P1 (280,360)／P2 (1000,360)；宣言間隔 30 TICK，完局自動進入勝敗宣言後返回主頁。

## 0.23.62 — Logo transitions / organized assets / static selection

Assets now follow `Stage/`, `Char/`, `Data/`, `Sound/`, `Engine/` and `Tools/`. See [repository layout](Docs/repository-layout.md) for current paths and selection controls. Historical release notes below may refer to previous root-level filenames.

VS / Training / Watch now open P1 → P2 → Stage selection. Currently enabled: **Sailor Venus and Training**; unsupported choices are disabled.

---

# Palace Web — Sailor Venus

[開啟遊戲](https://cpfortune1111.github.io/palace-webp/)

## 最新版本：0.23.46 — Complete Round Flow M1

BUILD `complete-round-flow-m1-20261003-01`。待人工驗收。

- Venus 1v1 VS／Watch：5900 初始化 → 原 190／191 入場 → 1990／1991 收尾 → Round／Fight → 實戰 → KO／Double KO／Time Over → 原 180→181 勝利、175→170（來源無 175 動畫）敗北 → 下一回合。
- 按 fight.def 先勝 2 局、最多 2 局重賽和局；第三次和局結束比賽。保留分數、更新 RoundNo／RoundsExisted，每局重置 HP／座標／Timer／命令／hitpause／Projectile／Helper／Explod，來源 5900 只在首局清指定變數。
- Timer 只在實戰有效 ticks 倒數；入場／勝負／debug pause 不扣秒。KO 優先於同 tick 到時；Time Over 按即時實際 HP 判勝負，HP 同值為和局。勝負決定後禁止新傷害／操作，等 KO 倒地才進 pose，RoundState／Win／Lose／MatchOver 查詢接通。
- 比賽結束提供「再戰／主頁」。Training 維持自由練習，不自動判勝負或重开；Space 補血仍可從 5150 起身。VS／Watch 結算階段禁用補血。
- 新增原 170／181／190／191／1910／1911 無損 WebP、Fight／KO AIR 與原回合 announcer／角色入場勝負人聲；fightfx 930–935 的原控制模式圖示接入。原不存在的 936／937 不造素材。
- 仍是 Venus 1v1；非 Arcade／Continue／選角／4P。來源 slow.time 慢鏡與原 bitmap 勝負文字字型尚未實作，不混稱完整 IKEMEN 視覺移植。

## 0.23.45 — HP Front / Options Artwork M1

BUILD `hp-front-options-artwork-m1-20261003-01`。待人工驗收。

- 表層恢復 10 tick ease-out（由快至慢），中層維持已 PASS 的 HOLD 60 tick／等速 10 tick。實際 HP／KO 不延遲。
- 移除主頁 BGM 播放按鈕；保留自動播放嘗試與首次任意互動重試。
- 主頁右下 TsukinoAi+ Logo 連往 https://tsukinoaiplus.com，另開分頁。
- Options 轉獨立畫面，按 SYSTEM.DEF OptionBG 使用 200,1 背景及 1,0 Thankyou 層，保留設定功能與返回；原 bitmap 選單字型尚未接入。
- SYSTEM.SFF 非主頁場景圖片共 159 張以 lossless WebP 匯出至 system-webp/，system_webp.json 保留尺寸／axis／來源 SHA256。雲／海／主頁場景不改。

## 0.23.44 — HP Trail Hold / BGM Start M1

BUILD `hp-trail-hold-bgm-start-m1-20261003-01`。待人工驗收。

- 1v1 中層 12,1 每次受傷先 HOLD 60 simulation ticks，再以等速 10 ticks 扣至實際 HP；再次受傷重新計時。實際 damage／KO 仍即時，補血立即恢復顯示。
- 主頁立即嘗試 BGM 自動播放；被瀏覽器阻擋時顯示播放按鈕，亦接受點擊／觸控／任意按鍵啟動，不再只靠 Arrow。音量設定保留。
- 使用者回報雲／海仍未動；按要求暫緩，不視為驗收通過。主頁可改用 GLB 3D 場景，尚待提供主頁素材，今版未替換。

## 0.23.43 — Title Animation / HUD Fix M1

BUILD `title-animation-hud-fix-m1-20261003-01`。待人工驗收。

- Timer 十位 612→614（右移 2 個 logical pixels），個位 642 不變。
- 使用者確認保留 1v1 的 12,1，而非 team 的 12,2。中層保留 10 tick ease-out，前景用即時實際 HP，重新露出兩層之間的扣血區域；實際 damage／KO 邏輯不改。
- 主頁全 TitleBG 動態：原 A0 Logo 16 個 1 tick 位移／最後停留、A21 雲 150 格、A30 海 137 格，原 AIR frame duration／循環；兩組流星按 start 330,-120／1220,90、velocity -24,10、tile 1,1、addalpha 50,256。Logo 使用既有 WebP 原 sprite 的來源位移；雲／海用動畫 WebP（quality 90），避免載入逐格 atlas。原素材／axis／順序不變，WebP 顏色有高品質壓縮，不宣稱逐像素無損。
- P2 Keyboard/Numpad 的 holdup 在可控制地面 0／11／20／52 接 S40，保留受擊、空中、KO 禁止跳躍；按原 Common runner 進 50／52，不依賴 P2 出拳測試按鈕。
- 驗收：Timer 十位／個位、兩邊中層扣血區域；Logo 入場後停住、雲／海持續循環、流星移動／平鋪；Numpad8 的垂直／斜跳、著地續跳與受擊時不能跳。Menu bitmap 字型仍待補，沒有混稱為動畫完成。

## 0.23.42 — Title Menu / Options M1

BUILD `title-menu-options-m1-20261003-01`。待人工驗收。

- Timer 個位原位置 642 保留，只將十位由 584 改至 612；無限模式不畫符號。匯入 fight.sff 51,0 作兩方頭像背景，置於頭像下方，按原 P1 0／P2 1280 anchor 及面向繪製。
- 血條前景改為 10 個 simulation ticks 的 cubic ease-out（首 tick 扣最多，逐 tick 遞減，第 10 tick 精確到目標）；多段攻擊從目前顯示值重新收縮。實際 HP／damage／KO 即時處理，不延遲戰鬥判定，Space 補血立即回滿。
- 主頁取原 system.def TitleBG 順序：10,0 星空／20,0 地球／21,0 雲／25,0 宮殿／30,0 海／1,0 作者標誌／0,0 Logo；原 SFF 像素、axis，1280×720 fit。今版使用動畫首格／Logo 最後靜止姿勢，流星、雲／海動畫及原 bitmap Menu 字型仍待補，不宣稱 TitleBG 完全復刻。
- Menu：VS（雙人 keyboard，預設 99 秒，Options 可改時間）、Training（無限）、Watch（雙 AI，使用原 CMD 已支援 AI 招式／移動分支，非每隔固定時間亂出拳）、Options；遊戲 Input 的 Menu 可返回主頁。仍保持 Venus 1v1，未加選角／多人／完整新回合流程。
- Options 本機儲存：Difficulty 1–8、Timer None／15–99、Master／BGM／SFX 0–100%，Key Config 連既有雙人自訂鍵位。來源 title.bgm BGM.mp3 循環；Master×分類音量作用於主頁 BGM、角色／Common 音效。瀏覽器首次播放仍需使用者點擊。難度供 Watch 的 AILevel 來源機率使用，無人類模式 AI。
- AI 補 Helper(9999),var(n)、EnemyNear(0) 與不等 HitDefAttr redirect 的表達式路徑；原未完成 throw 不啟用。來源 AI 及對戰平衡仍需深測；沒有假稱 Round flow 已完成。
- 驗收：99→98 的十位／個位、無限空白；雙邊 51,0、各傷害 10 tick 減速收縮、連續命中／KO／Space；主頁四選項、VS 鍵盤／Training 無限／Watch 雙方攻擊；Difficulty／Timer／音量 reload 保留；Key Config 返回／儲存。原 TODO 待深測項目不自動 PASS。

## 0.23.41 — Camera Bounds / Fight HUD M1

BUILD `camera-bounds-fight-hud-m1-20261003-01`。0.23.40 使用者 PASS。本版待驗收。

- 畫面左右／底部按 StageTraining 1280×720 letterbox 可視框裁切玩家、Helper／Projectile／Explod、CLSN；頂部不裁，保留跳躍出上框效果。只裁繪製，角色世界位置、camera follow、zoom、比例及戰鬥碰撞不變。
- 匯入原 data/fight.def、fight.sff 的 1v1 血條 bg0 A1001、bg1 11,1、mid 12,1、front A1311（60 格，每格 4 ticks）、Timer 心形框 60,0；P1 anchor 0，P2 anchor 1278／反向，range 619↔161，實際 HP 剪裁。扣血延遲條採 30 ticks 後每 tick 1% 的 Web 暫定值，非已驗證來源 mid timing。
- Timer 預設 ∞，Input 內可切 99 秒；來源 framespercount=60、font6 bank3 的 timer.sff 數字。模擬 pause／step 跟隨 sim tick；命中停止／SuperPause／KO 停倒數，Space 補血亦重置時間。99 到 0 顯示剩餘 HP 勝負，仍維持 training 操作，不自動轉 Win／Lose states 或開新回合。
- 原版對比盤點：仍未完成真正 5900→190/191 intro→對戰→KO/TimeOver→Win/Lose→新回合；AI 正式選項／決策驗收；完整共同 Common runner 與 -1 尚未支援路徑；音效 helper 深測；4P 真正同場（目前只 partner 查詢）；Powerbar、姓名來源字型、回合勝利圖示、Combo／宣告；完整 HUD AS224D32 blending 與 mid timing（本版 bg0 alpha 224/255 暫代）；選角頁 Normal/Auto、主頁 settings；逐招與 IKEMEN 並排深測。投技／645／175／5500 原作者未完成，保留參考，不列引擎 bug；recovery 入口按來源停用。
- 驗收：窄畫面跳躍仍可越上框，地面 P2 腳／倒影不可穿下框；寬畫面左右不可漏出角色／特效；P1/P2 受擊／KO／Space 的 HP；∞ 不倒數、99 每 60 有效 ticks 減 1、Pause/Step、時間到判定。只更新本 README，不新增說明文件。

## 0.23.40 — Portrait Facing / Low Life Idle M1

BUILD `portrait-low-life-idle-m1-20261003-01`。待人工驗收。

- 修正 Explod 渲染漏讀 AIR 的 H／V 翻轉；P2 頭像 A925–929 使用原 H，P1 A915–919 保持原方向。頭像不隨角色轉身反轉，位置、來源 AIR 及圖像不改。
- 按原 Common S0：HP ≤ LifeMax/4 時播放 A5300（不是進入 S5300），高於門檻恢復 A0；保留 A5 轉身直至完成，不覆蓋攻擊、受擊或 KO。P1／P2 同步適用；原 A5300 的 12 個影格與時間完整匯入。
- 測試：P1／P2 血量 251、250、1、1000；低血站立、轉身、攻擊及 KO；A915–919／925–929 全部頭像翻轉。人工請測 250 HP 站立喘氣，Space 補血回 A0，再測 P2 正常、受擊、倒地、勝負頭像。
- 本版只更新 README 作版本說明；維持 Venus 1v1、來源 recovery 入口停用、鏡頭校準及 0.23.39 舞台呈現。

## 0.23.39 — KO Push / Stage Visuals M1

BUILD `ko-push-stage-visuals-m1-20261003-01`。本版待人工驗收，不將 0.23.38 整體標 PASS。

- KO 推擠：HP0 的角色不再参与 PlayerPush 配對；雙方對称適用，活角色原推擠及 Space 回 HP 後的推擠仍保留。此為使用者明確 override：IKEMEN 原引擎有 `alive || NumPartner=0` 的 1v1 相容例外，Web 不再因 1v1 而讓屍體擋路。抽出每個角色的推擠資格判定供未來多人配對共用，不宣稱已開啟 4P。
- 原 Web 額外加了 HemisphereLight（2.2）與 DirectionalLight（2.4），原 StageTraining.glb 沒有定義燈光。現移除兩盞額外燈，保留 GLB 原材質／emissive／貼圖，不用 CSS brightness 硬壓亮度、不改原 GLB。鏡頭位置、投影、zoom、角色比例不改。
- 通用 foreground filter：直接抽出 StageTraining.def `[BG Filter]` 的 SFF `1,0`，按 layerno=1／delta=0／trans=none 的來源設定，在舞台、角色及特效之上、HUD 之下繪製。原圖 3840×2160、axis 1920,1080、alpha=8；只匯出固定 1280×720 遊戲視窗實際可見的原像素區域，以無損 WebP 節省下載，解碼後逐像素一致。不是自行加灰色遮罩或更改濾鏡透明度。共用 render layer 可供往後其他舞台使用，其他舞台尚未逐一比較。
- 角色倒影：按原 `[Reflection] intensity=50`，以當前 AIR sprite、面向／offset／空中高度鏡像至地面下方，alpha=50/255，置於角色之下並剪裁在遊戲視窗；角色 KO、跳躍、轉身及動畫更新同步。保留原 sprite 像素，不另生成假倒影素材。
- 修正匯出器遇到 3840px 大 sprite 超過原 atlas 寬度而被截斷的問題；既有 Venus 圖集及所有來源檔不重寫。stage_visuals.json 記錄原 DEF／SFF／GLB hash 與裁切位置。只更新本 README，不新增說明文件。

人工請測：雙方分別 KO 後，由左右走過屍體，屍體不能被推走／阻擋；Space 回 HP 起身後正常推擠。對照原 IKEMEN 舞台較暗的顏色、濾鏡顆粒與腳下倒影；跳躍、蹲下、轉身、KO、上下鏡頭移動及手機比例亦請試。自動檢查涵蓋雙向 KO 推擠、活角色推擠、無額外燈、來源 alpha／倒影强度、濾鏡 screen-fixed、圖像 lossless 比對及舊 runtime 回歸；已檢視含實際 GLB 的預覽，不宣稱跨瀏覽器顏色完全相同。

## 0.23.38 — Source Globals / Helpers M1

BUILD `source-globals-helpers-m1-20261003-01`。本版待人工驗收，只更新此 README，不新增版本文件。

- 全部 -3（20 個）／-2（44 個）來源 controller 依序加入雙方每 tick 執行，hitpause 只執行原 ignorehitpause=1；蓄力不再由舊 chargeControllers 重複跑。保留來源 Var3／4／5／6／15／40／41、NoAirGuard、PowerSet 等條件；pause／superpause 仍停用受暫停本體的全域執行。
- 原 Helper 9999 每位玩家只建立一個，Invisible、Root／Enemy／EnemyNear 查詢、ParentVarSet、41 個原決策 controller、RoundState!=2 的 DestroySelf 已接入。包含原本看似相反的 RoundState!=2 判定，沒有自行修正原 AI。**這是決策資料基礎，不是啟用 AILevel／AI -1 自動出招。**
- 原 915／925 頭像 Helper 及 915..919／925..929 AIR／SFF 已匯出並接入：正常、受擊、低 HP、KO；原左右畫面定位、0.75 scale、removetime=-1、LoopStart／末格 -1 保留。原 950 partner helper 資料保留，NumPartner=0 時不建立。Win 圖示及 TeamMode=Simul 分支保留來源，但因尚未實作勝負／多人流程，不標為已可玩。
- -3 四組受擊人聲 10,0..3 直接抽取原 SND，依原 Time／Alive／Random 條件播放；沿用雙方獨立聲音頻道。IKEMEN 的攻擊者 hitPauseTime 與防守者 gethit shaking 分開，不能因防守者 shaking 而略過來源 Time=1 的人聲。本角色來源沒有獨立 PlaySnd 音效 Helper，不能把全域人聲誤稱為新增音效 Helper。
- 初始化模組及原 5900／190／191／1990／1991／WinLose 已編譯保留；5900 首／後回合與 var／fvar 測試通過。**目前仍用已驗收的 training 啟動：5900→Intro、自訂控制模式 F930..937、完整 round flow 尚未接上，不聲稱完成初始化 gameplay。** Draw175／Continue5500 將依使用者要求用 Lose 動畫；停用 recovery 入口及未完成投技維持原樣。
- 1v1 Partner／NumPartner／NumEnemy／TeamMode 查詢、Helper 個數及 instance ID 分離、Root／Enemy redirect、HitDefAttr、來源尺寸的 P2BodyDist／edge 距離供決策使用；不增加四人對戰。鎖定鏡頭、普通技、CMD、空中不可防禦及所有已驗收 override 不改。

自動驗證：348 項雙人 Helper／來源表達式／低 HP／KO／持續動畫／原決策觸發與清除／雙方 shaking 中受擊人聲，初始化／查詢／排程單元測試，以及舊普通技、四招必殺、聲音、取消、guard、fall、鍵盤、同時輸入回歸。未把未測分支標 PASS。人工請測兩邊頭像正常／受擊／低於 250 HP／KO／Space 回復切換；再測普通連招、Sword 蓄力與 3000 暫停，確認新全域邏輯沒有改已驗收手感。

## 0.23.37 — Guard KO Transition M1

BUILD `guard-ko-transition-m1-20261003-01`。0.23.36 使用者 PASS；本版修正致命防禦傷害，待人工驗收。

- 按 IKEMEN 的 guard KO 判定：防禦扣血足以令 HP 歸零時，不再選普通 guard reaction，直接用命中 shaking／KO fall 路徑，避免 S151／153 等到結束、返回 S0 才跌落。保留命中 hitpause，不代表取消必要定格。
- 防禦可否 KO 使用原 `guard.kill`（預設 1），不是普通 `kill`。`guard.kill=0` 仍保持防禦及至少 1 HP；未致命防禦不變。普通攻擊、Projectile、Helper 共用修正，P1／P2 同樣適用。
- 人工請測：兩位玩家分別站防／蹲防，以低 HP 防禦 3005 Helper；HP0 當下應直接進入 S5000 受擊，再按 Common 倒地至 S5150，不應經 S0。Space 回 HP／起身仍可用。鏡頭、來源 CNS、動畫、傷害及鍵位不改。
- 上一輪要求的初始化／Intro／回合／9999／AI 尚未發布；本版是獨立 bugfix，不宣稱該批功能完成。保持 Venus 1v1，partner 部分僅補來源查詢的範圍不變。

## 0.23.36 — Voice / Sound Channels M1（使用者 PASS）

BUILD `voice-sound-channels-m1-20261003-01`。0.23.35 收到三招人聲截斷回報；本版待人工聽音驗收，不將上一版整體標 PASS。

- 原 S1000／S1100／S1200 的人聲 `1000,0`／`1100,0`／`1200,0` 明確指定 channel 0；之後的 `900,0`／`900,2`／`900,3`／`900,4` 沒有指定 channel。根因是 Web runner 把未指定頻道錯當 0，後續音效因此 pause 原人聲。現把未指定／負數頻道保留為自動頻道，可與人聲及其他自動音效重疊；不改原 CNS、不延長或剪接原 WAV。
- P2 同樣修正：只有明確頻道才加玩家 offset，不能把自動 -1 轉成共用 channel 3。明確同頻道的新聲音仍替換舊聲音，原 StopSnd 不移除；沒有為三句人聲加永不停止的特例。聲音正常結束／錯誤／播放被瀏覽器拒絕時清理追蹤，舊聲音的結束事件不會刪除新聲音的頻道。

人工請測：NORMAL／AUTO、P1／P2 分別出三招，確認人聲完整播完，發射／鐵鏈音效仍同期播放；雙方同時出招的人聲互不截斷。同一玩家立即再開另一句 channel 0 人聲仍按來源替換，並非所有聲音永久重疊。瀏覽器首次需互動才能允許音訊，請實際按鍵出招聽音。

自動驗證加入三招雙人完整 simulation 的人聲／後續音效追蹤、自動頻道重疊、明確頻道替換、雙方隔離及 end/error 清理；保留上一版必殺與完整 runtime 回歸。自動檢查確認沒有錯誤 pause 呼叫，不代替人工聽音驗收。鏡頭、動畫、CMD、傷害、圖集、原始來源及所有 WAV 保持不變。

## 0.23.35 — Special Fixes / Command Modes M1（收到人聲修正回報）

BUILD `special-fixes-command-modes-m1-20261002-01`。0.23.34 四項回報已修正，本版待人工驗收；只更新此 README，不新增版本文件。

- **全部 A905 不受 hitpause 凍結**：第一格仍為原 AIR 的 4 tick，不再加上命中的 8 tick；後續影格同樣依原 AIR 推進。沒有改 sprite／AIR 時間，也沒有讓一般 Explod 忽略 Pause／SuperPause。
- **1000 根因不是普通拳排在前面**：原 -1 次序已是 3000→1200→1100→1000→100→105→普通技。本次明確按來源行號排序並測試全部啟用 controller／command 定義；未完成投技仍留參考、不啟用。真正失敗是久站後下→斜前下時，`~D,$D` 同 tick 的兩個來源步驟被當成同一方向鍵、反序處理，漏掉 `$D`；按 [IKEMEN v0.99.0 的不同 release／dollar command keys 與 IsDToB](https://github.com/ikemen-engine/Ikemen-GO/blob/v0.99.0/src/input.go) 保留此 legacy 組合的同 tick 辨識。沒有改原 CMD 指令、time=15／buffer=3，也沒有讓未完成 motion 延遲普通拳。
- **1100 輕／重 Projectile 1150 到可見鏡頭頂邊才收尾**：使用當前鏡頭 Y 和原 sprite axis／AIR offset 計可見頂部，過邊時截在頂邊、VY=0，轉原 `projhitanim=9041`；播完整段（包括來源空影格）再移除，期間 NumProjID 仍存在。普通命中／防禦仍先走命中收尾。**這是使用者要求的明確 override**：原 CNS `projremovetime=30`、世界上界 -720 不再提前終止此子彈；其他子彈期限／碰撞／移除不變，原 CNS 及鎖定鏡頭校準不改。
- Input box 新增 **Command: NORMAL／AUTO** 按鈕，目前同時切 P1／P2；與原 Input Auto（自動選鍵盤／觸控）是兩回事。直接切原 `var(52)=0／10`、套原 CMD，不另造短指令。內部支援分別設定每位玩家，方便之後放入選角頁；切換清除舊輸入／buffer，不偷偷取消進行中的招式。
- 同時修正 AUTO 輕重選擇：來源 buffer=1 的短指令不應因本版 runner 下一 tick 才執行 Time=0 Var2 而失效、變成重招。只為 1000／1100／1200 的來源 Time=0 Var2 保留入 State 當 tick 的 command 查詢快照；不延長 buffer，不影響之後的 command／取消查詢。

人工請測（兩位玩家、兩面向）：

1. 1200／普通命中或防禦，用 Scroll Lock 查 A905 第一個 sprite 只留 4 tick，命中定格期間特效繼續播。
2. **NORMAL**：站定一會後下→斜前下→前＋x／y，多次輸入 1000；最後前＋按鍵同 tick 或相隔 1–2 tick 都測，不能誤出 200／210。未完成方向指令的普通拳仍照原規則出。
3. 1100 輕重空振：兩種都上升至畫面頂邊，轉 A9041、VY=0，播完消失；跳高令鏡頭 Y 改變時亦測，命中及防禦仍可正常收尾。
4. **AUTO**：按住 L＋x／y／a＝輕 Beam／Sword／Chain；按住 R＋x／y／a＝重 Beam／Sword／Chain。L＋R（或 R＋L）＝Chain Explosive，仍需 HP≤250。原 `~d`／`~w` 釋放後短接鍵也保留；AUTO Sword 按來源不需 NORMAL 的 >40 tick 蓄力。P1 L=Q、R=W、x=Z、y=X、a=A；P2 L=Num/、R=Num*、x=Num0、y=Num.、a=Num1。切回 NORMAL，短指令不得再代替長指令。

自動測試新增：A905／一般特效 hitpause 及 Pause 區分、久站後雙人雙向輕重 Beam、1150 兩種鏡頭高度與輕重頂邊收尾、八組原 AUTO 短指令／輕重選擇、模式按鈕與來源次序；保留全部普通技／取消／guard／fall／輸入／必殺回歸。人工接觸計時未 CHECK，GetHit／HitOver／HitShakeOver／HitVelSet 仍初步 TEST、待深測，不標為全 PASS。

## 0.23.34 — Venus Specials M1（收到四項修正回報）

BUILD `venus-specials-m1-20261002-01`。0.23.33 使用者 PASS；四招同版接入，本版待人工驗收，不標為 PASS。

- 原 CNS `1200` 多段 HitDef、HitCount／Var44／Var3、輕重動畫與 Explod；`1000`／`1100` 原 Projectile、NumProjID、命中動畫／移動／期限、輕重參數及聲音。Projectile 使用自身命中／hitpause，不把子彈的接觸計時寫到本體。Sword 保留原正常模式 Var16>40 蓄力條件。
- 原 `3000→3005` 的 SuperPause／Pause、BGPalFX、左上定位的兩段全畫面 Explod、音效與 StopSnd、Var45 第二次略過開場；3055／3050／3051／3052／3056 Helper、ParentVar47、HitOverride、NoChainID、DestroySelf。**S3005 相反的兩條 MoveContact triggerall 原樣保留，傷害由 Helper 執行**，沒有偷偷解除來源條件。
- 匯出原 SFF／AIR 必殺、特效、Hard GetHit 動畫；保留 ticks／LoopStart／空影格／軸點。使用有限尺寸無損 WebP 圖集而非超高單圖，每頁解碼後逐像素與來源匯出比對一致；聲音直接由原 SND 抽取並校驗，SuperPause 的 20,0 使用原 common.snd。首次下載會比上一版多；手機效能仍需人工實測。
- 玩家 -1 依原 CMD 次序啟用四招，未完成投技仍停用；加入蓄力所需的原 -3 Var16／17 controller。保留鏡頭校準、440 使用者速度調整、NoAirGuard、停用的原 recovery 入口及所有已驗收鍵位。

人工測試（方向皆相對角色朝向；P1 x=Z、y=X，P2 x=Num0、y=Num.）：

- `1200`：前→下→斜前下＋x／y，分別輕／重。測近距離多段命中、站／蹲防禦、空振、命中取消與受擊中斷特效。
- `1000`：下→斜前下→前＋x／y。測輕重速度／傷害、子彈獨立飛行、命中後消失、雙方子彈與 NumProjID 出招限制。
- `1100`：按住下超過 40 tick，再上＋x／y。輕／重出現位置與上升速度不同，近距離不一定命中；測蓄力不足不能出、命中／防禦／到期消失。
- `3000`：HP≤250 時後→下→前→下＋y（原 CMD 時限 30 tick）。測開場定格／背景／聲音、對手暫停、Helper 傷害及防禦、同一角色再次使用略過開場；Space 回 HP 會令超必殺入口暫時不可用。

自動驗證：32 組雙人／左右朝向／近遠距離完整出招與返回，來源 command／蓄力／HP 入口、Hard／Medium 受擊與 NoAirGuard；保留上一版全套 command、普通技、取消、倒地、鍵盤與 A12 回歸。人工接觸計時未 CHECK，GetHit／HitOver／HitShakeOver／HitVelSet 仍初步 TEST、待深測。此 runner 針對上述 Venus 來源配置，並非宣稱完整通用 MUGEN 引擎；AI、未完成投技、其他 Helper／Projectile controller 尚未接入。

## 0.23.33 — Crouch Exit End Frame M1（使用者 PASS）

BUILD `crouch-exit-end-frame-m1-20261002-01`。使用者確認 0.23.32 其餘項目暫時 PASS；A12 結尾倒跳單獨修正，本版待人工驗收。

- 原 AIR A12 沒有改 ticks：`40,1,0,0,1` → `40,0,0,0,2`。根因不是 E2 被改成 1，而是動畫 age 到總長度 3 後、原 Common `AnimTime=0` ChangeState 在下一次 controller 評估前，通用播放器先回圈到 E1，產生 S12/T3/A12/E1 的錯誤邊界畫面。
- P1／P2 A12 播完時保留最後 E2，等待原 Common 的 S12→S0，不重播 E1、不延長 AIR 的 E2 duration、不改 CtrlSet(Time=1)／取消條件。邊界 HUD S12/T3 仍在 E2，下一 tick 依來源回 S0；這是顯示來源 state transition 前的尾格，不是新增第三個 AIR element。600／630 的原 LoopStart、guard／fall 特例及其他循環不改。
- 新增雙人／兩面向由 S11 放開 ↓ 的完整逐 tick fixture，核對 S12/T0/E1、T1/E2、T2/E2、T3 邊界保持 E2，然後 S0；同時檢查原 sprite pairs／ticks，以及全部 command／取消與舊版回歸。原始 AIR、atlas、鏡頭、鍵位和音效不改。

人工請測：P1 ↓／P2 Num5 蹲下後放開，用 Scroll Lock 查 A12 結尾不能再回 E1；T3 邊界需保持站起來的 E2，接著回 A0。兩面向及再蹲／收招取消仍可用。0.23.32 接觸計時與深測狀態保留，不將「其餘暫時 PASS」改標全部深測完成。

## 0.23.32 實作紀錄（除 A12 外，使用者暫時 PASS）

BUILD `command-buffer-normal-cancels-m1-20261002-01`。使用者 0.23.31 PASS；本版待人工驗收。只更新此 README，所有 atlas、原始 CNS／CMD／AIR／SFF、鏡頭及已驗收調整保持不變。

- 重新由原 Venus CMD 匯出 command 定義，保留重名 command 的全部變體與來源行號，修正舊 runtime 中過時的招式名稱。Defaults time=15／buffer.time=1；FF／BB time=10，普通按鍵 time=1／buffer=3，特殊 command 依原個別設定（含 time=30）。所有時間以 60Hz simulation tick 計，不依鍵盤 repeat 或螢幕刷新率。
- P1／P2 各自獨立但共用同一個 command runner，按 IKEMEN `src/input.go` 的 signed input、step 順序、同 tick 方向→按鍵、嚴格方向與 `$` 四方向、release／hold／AND、同方向 auto-greater、整段 time window、buffer 與 hitpause 延長／凍結處理。按住普通技不自動連發；查詢不消耗 buffer。鍵位 l／r 對原 CMD d／w；模式切換／失焦／Settings 清空輸入及 buffer，兩人不互相污染。
- `MoveContact`＝最近 hit／guard 接觸計時；`MoveHit` 僅最近命中，`MoveGuarded` 僅最近防禦，另一種為 0。接觸當 tick=1，hitpause 凍結，恢復後遞增，ChangeState（包含同 State 重入）清零。兩邊 AST、HUD 的 MC／MH／MG 與匯出 trace 均可檢查，trace 同時記錄仍有效的 command buffer。
- 已接入 states 的玩家 `-1` 使用原 controller 順序／triggerall／trigger groups：100／105 加十二個普通技。移除 State200 額外的一次按鍵 latch，P2 不再獨立猜測 dash／普通技入口；雙方正常技在原 MoveType=I 恢復窗口可以接受預先 3 tick 的按鍵。
- **原 CMD 並非任意普通技互取消**：站立 200／230 收招 MoveType=I 可重入 200／230，或接 210／240；蹲下 400／430 收招可重入 400／430，或接 410／440。需原站／蹲方向，不能在 MoveType=A 時因命中而任意串普通技，210／240／410／440 沒有額外收招取消入口；空中四招仍需 Ctrl，沒有新增空中取消。BB 依原命中／防禦與 State 範圍取消，440 另需 P2StateNo=5070。
- 3000／1200／1100／1000／801／800 的玩家 `-1` 保存為 deferred 來源 controller，不啟用尚未有完整 runtime 的必殺／超必殺／未完成投技；motion command 已可辨識，但不聲稱這些招式已可玩。AI `-1`／全量 `-2/-3`、Projectile／Helper 仍列後續。5050 註解 recovery 入口仍停用。

人工請測（P1／P2、兩面向）：200／230 收招前輕按同鍵或另一普通技鍵，應按原窗口重入／接招；按太早且 buffer 已過期不可出招，按住不連發。蹲下 400／430 接 400／410／430／440；放開 ↓ 不可當蹲技輸入；活動攻擊影格不能任意取消。FF／BB 雙擊、命中後 BB、防禦中 BB、440 命中 Trip 後 BB；whiff 不應開啟命中取消。用 Scroll Lock 查命中 MH>0／MG=0、防禦 MH=0／MG>0、hitpause 不增加、重入全歸零；兩人同 tick 按鍵仍應獨立出招。Space／LoopStart／NoAirGuard 保持舊版結果。

自動驗證新增 command 時限／buffer／hitpause／hold／duplicate／same-frame／雙人隔離及來源取消矩陣，64 組 live 收招前預輸入／同 State 重入與雙向取消，並保留全部舊版回歸。接觸計時仍未人工 CHECK；GetHit／HitOver／HitShakeOver／HitVelSet 維持初步 TEST、待深測，不以自動結果代替人工 PASS。

來源：[IKEMEN command runner](https://github.com/ikemen-engine/Ikemen-GO/blob/develop/src/input.go)、[Char 接觸計時與 input.pauseonhitpause 預設](https://github.com/ikemen-engine/Ikemen-GO/blob/develop/src/char.go)，及 repo `sources/venus/original/venus.cmd`；無新增 Web-only 取消規則。

## 0.23.31 實作紀錄（使用者 PASS）

BUILD `air-loopstart-hp-restore-m1-20261002-01`。修正使用者回報 600／630 空中倒跳抽搐；0.23.30 不標全 PASS，本版待人工驗收。

- 根因：AIR 匯出器只保留影格、漏掉 LoopStart，P1／P2 播放到尾格都重返第一格。現按原 AIR 保留零基準 loop index；600／630 原 LoopStart 在 E4，startup E1→E2→E3 只播一次，其後 E4→E5→E6→E4 循環。同步更新動畫時鐘，AnimElemTime 不因循環繼續偏離影格，也不把 State Time 重置。原影格 ticks、sprite、Clsn、招式速度及鏡頭不改。
- 右上新增 HP 按鈕，Space 同效：回復 P1／P2 全部 HP，不重置位置、不取消普通攻擊或受擊、不更改播放／暫停狀態。已在 S5150 的 KO 角色以訓練功能進原 S5120 起身，再依原 CNS 恢復；這是明確 debug override，不杜撰原 S5150 的 recovery controller，也不啟用 5050 的註解 recovery 入口。
- Space 保留為回血快捷鍵，不可設成戰鬥鍵；按住不重複觸發，Settings／文字輸入／修飾鍵不回血。暫停時亦即時更新 HUD 與畫面，起身動畫等待播放或單步推進。Pause/Break 與 Scroll Lock 保持原作用。

人工請測：原地／移動跳 600、630，暫停逐 tick 核對 E6 後回 E4，不能回 E1；P1／P2、兩面向均測。扣血後用右上 HP／Space，兩邊滿血但位置不重置；雙方 KO 到 S5150 後回血，應經 S5120 起身，可繼續操作。暫停回血不自行播放。

自動驗證涵蓋來源 LoopStart／跨三輪循環／雙人 element 與動畫時鐘、按鈕／Space／repeat／Settings 隔離、雙方 S5150→5120→可操作及暫停刷新，並保留空中四招與全部舊版回歸。人工待測；接觸計時及 GetHit 深測狀態不變。

## 0.23.30 實作紀錄

BUILD `air-attacks-air-gethit-m1-20261002-01`。使用者 0.23.29 PASS；本版待人工驗收。保持鎖定鏡頭、440 速度 override、hitshake x2 與雙人自訂鍵位。

- 按原 CNS／CMD／AIR／SFF 接入 600 跳輕拳、610 跳重拳、630 跳輕腳、640 跳重腳；保留入招速度、Physics=A 重力／著地 52、Ctrl=0 與原 MoveType 收招時間，沒有新增空中取消。P1 跳起後 Z／X／A／S；P2 Num8 跳起後 Num0／Num.／Num1／Num2。Settings 自訂鍵位優先。
- 傷害依來源：600=30、630=40；610 原 `cond(Vel X=0,90,100)`、640 原 `cond(Vel X=0,70,80)`，HitDef 建立時固定計算，不能改成命中時重算。610／640 的 `Med` 正確選 Medium GetHit，600／630 為 Light。四招原 air.velocity=-8,-28；air.hittime 未設定，採 IKEMEN 預設 20，ground／guard 時間及速度分別保持原值。
- 空中碰撞依原 hitflag=A 接入雙向命中、NoAirGuard 對手不可擋；地面對手可按原 guardflag=M 站／蹲防。地面預防禦亦可被空中攻擊威脅，仍使用原 attack.dist=640，不把跳起攻擊者誤排除。保留 132／154／155 原來源資料，不建立可玩 air guard。
- Common 5020 shaking →5030 上升 →5035 transition →5040 空中恢復；fall／KO 進既有 5050／落地彈地／5150。原 HitVelSet XY、GetHitVar(airtype/yaccel)、HitOver／HitShakeOver、range、CtrlSet／StateTypeSet 共用來源 controller；恢復控制後可依原 CMD 再出空中技，HP0 不恢復控制。
- 完成 5200→5201 ground recovery 與 5210 air recovery：原 Turn／PosFreeze／VelMul／VelAdd、方向修正、NotHitBy、Time20 CtrlSet、原 A5200／5210 與 F60。依使用者確認，5050 內註解的 recovery 入口保持停用；三個 states 以自動 fixture 驗證，不能在正常 gameplay 用 x+y 觸發，亦不宣稱人工 PASS。
- 610 原 Explod900 綁定角色、原 AIR 時間與層級、hitpause 凍結及 removeongethit 已接；新增原 S900,5／6 聲音。新增獨立 air atlas，原 atlas／原始來源不改；不啟用未完成 645。

人工請測：雙人／兩面向，原地跳及移動跳四招；空對地站防／蹲防、空對空不能防、Light／Medium 動畫、hitpause 後 XY travel、著地 52 聲音；空中受擊致死應落到 5150、不起身。630 原 AIR 攻擊盒較短，需靠近測，不能為方便命中擴大 Clsn。用 Scroll Lock 逐 tick 檢查受擊／transition 無倒跳，Pause/Break 繼續。

自動驗證：雙向四招／兩面向空對地及空對空實際碰撞、速度條件傷害／站蹲 guard／NoAirGuard 矩陣、空中 Common 鏈及 KO fall、recovery 來源 fixture、CMD Ctrl 限制、900 綁定與受擊移除；保留全部舊版回歸。接觸計時仍未人工 CHECK；GetHit／HitOver／HitShakeOver／HitVelSet 維持初步 TEST、待深測，不以自動結果代替人工驗收。

## 0.23.29 實作紀錄（使用者 PASS）

BUILD `trip-travel-debug-keys-m1-20261002-01`。使用者 0.23.28 其餘動畫修正 PASS；回報 5071→5110 的入口 tick 座標停住，本版修正並待人工驗收。

- 根因：fall controller 遇 ChangeState 提早 return，略過本 tick 最後的 X／Y velocity integration。改為停止舊 State controller 後仍完成一次位移；保留原 VelAdd 的重力結果，不再加第二次重力，PosFreeze 仍禁止移動。新 State 維持 Time=0／原尾格，下一 tick 才跑新 State controllers，因此不會重現 5070 E1／5170 E1，也不額外推進新 State 動畫。
- 圖中的 5071 VX(local)=-10、F=-1 對應 world VX=+10；VY=21.2 經原 yaccel=1.4 變成 22.6。切入 5110 當 tick 應再向後 X+10、向下 Y+22.6，而不是只改 VY 卻停在舊位置。原 5110 下一 tick 的 PosSet／VelSet 才落地。未改 AIR、440 velocity、鏡頭或資產。
- 新增 Debug 快捷鍵：Pause/Break（KeyboardEvent.code=Pause）等同 PLAY，恢復播放並清除待執行 STEP；Scroll Lock（code=ScrollLock）等同原 Pause／Step 按鈕，播放中先暫停，已暫停時再按只前進 1 tick。按住不 autorepeat；Settings 視窗／文字輸入／修飾鍵不觸發。Debug 鍵保留，不加入 P1／P2 自訂戰鬥按鍵。

自動驗證：雙 facing 切 5110 的當 tick gravity／XY travel，並保留前版尾格序列；實際 Pause／ScrollLock 鍵盤事件、loop 單步恰好 1 tick／無重播、按住不 repeat、Settings 隔離；原雙人掃腳／32 組 KO／全部回歸通過，無瀏覽器錯誤。待人工驗收。

## 0.23.28 實作紀錄

BUILD `trip-animation-continuity-m1-20261002-01`。修正 Trip 受身中多出的 A5070 E1／A5170 E1：ChangeState 進 fall states 保留原動畫 element、element tick 與 elapsed clock；只有原 ChangeAnim controller 才重置動畫。fall 動畫完成後保留尾格等待下一 tick 原 CNS AnimTime 切換，不先自動 loop 回第一格。原 AIR 時間不改，沒有插入新影格。

5071→5110 的入口維持 A5070 E4；5170 的尾格 E2 完成時仍維持 E2，下一 tick 原 controller 才改 5110。保留 440 velocity=-10,-18／-8,-18、KO、鏡頭及全部資產。本版待人工驗收，0.23.27 的 Trip 抽搐不標 PASS。

自動驗證：雙 facing 的 5071→5110 繼承 E4／動畫時鐘與 5170 尾格逐 tick 序列；原 8 組雙人掃腳、32 組 KO、HitFall、輸入／guard／跑跳／既有攻擊完整回歸通過，無瀏覽器錯誤。未改原 AIR 或 atlas，只更新本 README。

## 0.23.27 實作紀錄

BUILD `sweep-tuning-ko-fall-m1-20261002-01`。修正使用者 0.23.26 回報：440 飛起過高、200 打至 HP0 仍返回 S0。保留鏡頭及原資產。

- 只對 440 採使用者指定調整：`ground.velocity=-10,-18`、`air.velocity=-8,-18`。編譯器與 battle JSON 記錄 userOverrides；原 CNS 來源封存保持不改，其他招的 air.velocity 不受影響。未完成的空中命中路徑仍不標為已可人工測試。
- 普通命中致死按 IKEMEN 設 fall flag、fall animtype=Back。原 5000 選 5030 動畫、StateType=A，HitShakeOver 後走 `5000 → 5030 → 5035（視動畫時機）→ 5050 → 5100 → 5101 → 5110 → 5150`，不得回 S0／S11 或進 5120。440 仍保持 Trip 路徑，並非強迫改為普通 bounce。
- 補 player 預設 kovelocity：Venus CNS 沒有另設 KO velocity，所以採 IKEMEN 預設按 localcoord width=1280 放大。ground xmul=.66、add=(-10,-8)、ymin=-24；air add=(-10,-8)、ymin=-12（空中命中仍待接）。world X 按受擊方向加成；非零原 Y 保留並依引擎加成／鉗制，不能把所有招改成同一速度。原 200 ground.velocity=-16，致死 VX 為 ±20.56、VY=-24。
- 非受擊狀態發現 HP0 時按引擎 actionFinish 強制 5030、Time=1、ctrl=0，避免既有 S0／收招或起身狀態繼續操作。HitDef kill=0 保留 1 HP，不製造假 KO。5110 判斷不存活後留在 5150，完整 MatchOver／勝負回合流程仍未完成。

人工請測：200／210／230／240／400／410／430 打至 HP0 均跌倒且不再起身；P1、P2 與兩面向；440 非致死高度變低、蹲防仍可擋；440 致死依引擎另有 KO velocity，不等於非致死 -18。本版待人工驗收；前版問題不標 PASS。

自動回歸通過：雙玩家×雙 facing×八招共 32 組實際碰撞致死，檢查 HP0→5150、Y=0、不經 5120；200 KO 原速度計算、kill=0 留 1 HP、雙方 S0／HP0 的引擎強制 KO fallback；440 速度 override、原 Trip／bounce／HitFall 測試及既有完整回歸。無瀏覽器錯誤；並非人工 PASS。

## 0.23.26 實作紀錄

BUILD `sweep-fall-recovery-m1-20261002-01`。使用者 0.23.25 全 PASS；本版待人工驗收。按原 Venus CNS／CMD／AIR／SFF 加 440 蹲重腳，並接 Common 5070／5071、5030／5035、5050、5100／5101、5110、5120、5150。沿用鎖定鏡頭、attack.dist=640、hitshake x2、自訂鍵位及雙人共用 controller。

- 440：原 damage=70,0、guardflag=L、ground.type=Trip、pause=8/8、ground velocity=-10,-35、guard velocity=-32、air velocity=-8,-28、fall=1；hit 滑行／硬直 23／27、guard 24／34；cornerpush -28／-52。原 StateDef 無 velset，不強制清零；動畫、音效、收招與 CMD 完全採原來源。P1 下＋S；P2 Num5＋Num2（自訂按鍵以 Settings 為準）。站防會中，蹲防可擋。
- 必須分清兩條來源路徑：440 的 Trip 是 `5070 → 5071 → 5110 → 5120 → 11`；普通 falling 是 `5050 → 5100 → 5101 → 5110 → 5120 → 11`。不能把 Trip 強行改成普通彈地。KO 由 5110 進 5150，不起身。5150 原 priority=-3；MatchOver 尚無完整回合系統，保持 false，不假報比賽結束。
- 5070 原 ChangeAnim 每 tick 凍結動畫；5071 原 HitVelSet／GetHitVar(yaccel)，Trip groundlevel=60。5050 groundlevel=100；5100 保存 SysVar(1)、Y 歸零、PosFreeze／x*.75；5101 原 HitFallVel、bounce yaccel=1.6／groundlevel=48。5110 原 x*.85／friction threshold=.2；alive 的 liedown.time=20 計時依 IKEMEN 引擎規則進 5120，而非杜撰 CNS ChangeState。
- HitFallSet 更新 fall flag／指定速度；HitFallVel 只在 MoveType=H 套用，未指定 fall.xvelocity 保留 X，原引擎 default fall.yvelocity=-18；HitFallDamage 只消耗一次，fall.kill=0 不致死。FallEnvShake 只於來源 fall.envshake.time>0 啟動並消耗，保留引擎 freq／phase／mul／decay 的垂直震動，不改鏡頭校準。440 原未設定 fall.envshake.time，因此不擅自加畫面震。
- 5120／5150 的 SCA NotHitBy 保護；起身完成回 11，倒地不得當成站姿重新被 MA 命中。普通投技保護參數保留，但投技仍未實作。ForceFeedback 是實體控制器震動，本版未接硬件，不能誤當角色前後 hitshake。
- 原安裝 `data/common.snd` 的 F7,0／1／2 落地聲、`data/fightfx.sff`／`fightfx.air` 的 F60／61／62 地面衝擊已匯出；保持 F/common 與 S/Venus 命名空間分離，採原動畫時間、軸點、additive blend 及前後層級，無替代素材。新增獨立 fall atlas，既有角色 atlas 不改。

測試方向：P1／P2、兩面向、站防／蹲防；440 命中 70、擋住不扣血、Trip 落地起身；低血量再受 440 到 5150 不起身；角落左右測位移。5050／5100／5101 普通 falling 用來源參數自動 fixture 驗證，並非宣稱已能用尚未接入的空中攻擊觸發。完整空中命中／recoverable air reaction、spark S905、回合流程／MatchOver、硬件 ForceFeedback 仍未完成。

自動回歸通過：8 組雙玩家×雙 facing×命中／蹲防實際鍵盤 440；12 組 Trip／站蹲 guard／普通 bounce／KO；HitFallDamage 單次消耗、HitFallVel 默認保留 X／指定 XY、HitFallSet、非零 FallEnvShake 消耗／顯示／到期且不改鏡頭；原完整轉身、輸入、雙人 trade、guard、跑步後跳、站蹲攻擊回歸無瀏覽器錯誤。普通 bounce fixture 不是人工 PASS。

接觸計時仍未人工 CHECK；GetHit／HitOver／HitShakeOver／HitVelSet 維持「初步 TEST，待深測」。只更新本 README，不另建版本說明文件。

## 0.23.25 實作紀錄

BUILD `crouch-attacks-guard-levels-m1-20261002-01`。使用者 0.23.24 全 PASS。按原 CNS／CMD／AIR／SFF 加 400 蹲輕拳、410 蹲強拳、430 蹲輕踢，共用既有雙人 controller／命中 runner。原 StateDef 沒有 velset，不擅自清零入招速度；400 重複 priority 依最後有效值 `1, Hit`，不是前一行 3。

| State | Damage | GetHit | Hit 滑行／硬直 | Guard 滑行／硬直 | Hit／Guard VX | Pause |
|---|---:|---|---|---|---|---|
| 400 | 20,0 | Light／Low | 11／15 | 16／22 | -14／-14 | 8／8 |
| 410 | 100,0 | Medium／Low | 23／27 | 24／34 | -42／-42 | 8／8 |
| 430 | 30,0 | Light／Low | 11／15 | 16／22 | -16／-14 | 10／10 |

- 原 guardflag=L：站防會被這三招命中，蹲防可擋；H 只站防、L 只蹲防、M 兩者皆可。防禦分類來自 guardflag，並非 ground.type 的 High／Low；現有 200 等 M 招不能誤當只能站防。H 尚未有本切片原招使用，只以參數矩陣自動測試，不標人工 PASS。
- 站姿遭 Low／Light 選原 A5010→5015，Low／Medium 選 A5011→5016；蹲姿受擊按 IKEMEN 進 S5010／S5011，以 Common 選 A5020／5021→5025／5026、原 HitVelSet、crouch friction，最後回 S11。StateNo 與 AnimNo 不混用。新增原 S11 人類 CtrlSet 的入口評估，避免 10→11 同 tick 出現人工 ctrl=0 漏防。
- 原 CMD：按住下方向＋x／y／a →400／410／430；P1 下＋Z／X／A，P2 Num5＋Num0／Num.／Num1。原 Ctrl 或 400／430 的 MoveType=I 可蹲技重入；200／230 的 MoveType=I 只開原站技入口，不擅自讓它們接蹲技。410 收招 MoveType=I 不等於 Ctrl=1，因此不能任意重入。
- 入口依原 command 順序／holddown／StateType 判斷，不增造 MoveContact／MoveGuarded 的連招門檻：有無接觸都可以使用原指定的收招取消窗。命中 MoveContact=1、MoveGuarded=0；擋住兩者=1，hitpause 計時與切 state reset 沿用既有來源邏輯。
- 400／430 原 `AnimElem=5,2`／`4,2` 的鬆下提早回 S11 條件已支援（不是只判第一 tick）；410 原 AnimTime 完成回 S11。按住下保持蹲姿，P2 鬆下亦用 12 起身而非直接跳 0。音效沿用已匯出原 Venus WAV，無代用素材。

自動回歸：198 組來源數值／H-L-M guard／CMD 起招與重入門檻；雙玩家×雙 facing×三招×不防／站防／蹲防 36 組實際鍵盤命中，檢查 damage、GetHit 動畫、MoveContact／MoveGuarded；蹲受擊兩種動畫與 HitVelSet／回 S11、AIR element offset／鬆下提早收招；完整 0.23.24 回歸通過。人工待測：三招左右邊界／站蹲防、Light／Medium、400／430 收招接技及 200／230 原站技重入。接觸計時仍未人工 CHECK；GetHit 等初步 TEST、待深測的總體狀態保留。空中受擊／spark S905／完整 P2 CMD buffer 仍未完成；440 未接。

鏡頭、原 attack.dist=640、hitshake x2、既有鍵位 Settings 不變。Atlas 匯出器容量改為按需要擴展，不裁掉新動作或改 sprite axis／palette。

## 0.23.24 實作紀錄

BUILD `stand-attacks-jump-land-m1-20261002-01`。使用者 0.23.23 PASS。按原 CNS／CMD／AIR／SFF 接入 State 210／230／240 與相依 Action 241；State 52 原 Time=0 PlaySnd `52,0` 補回，不改 106。

- 210 強拳：原 damage=100、Medium／High、pause=8/8、ground velocity=-28、cornerpush=-46；原 AnimElemTime(4) 的 900,4 揮擊聲及 25% 200,1 聲音。
- 230 輕踢：原 damage=30、Medium／Low、ground velocity=-20、cornerpush=-32；原揮擊／機率語音。第 5 格後 MoveType=I，保留上方向→40、下方向→10 的來源取消條件。原 poweradd=11 留在 StateDef 並受原 Data power=0 上限約束，不自創能量條。
- 240 強踢：原 damage=100、Medium／Low、ground／guard velocity=-24、cornerpush=-32。第 3 格 Vy=-17.5、逐 tick 加 yaccel、StateType=A／physics=N；下降至 Y>=-10 回 S／S、轉 Action 241，當格 Vy=0／Y=0、播放 52,0，241 完成回 0。不用 State 52 代替原 241。
- StateType／physics 可由原 controller 動態改變；ChangeAnim 擁有獨立動畫起始時鐘，不把 241 誤當已播放整段 State 240。Medium／Low 依 Common 5000／5001 公式選原 5001／5006／5011／5016 等受擊動作，保留前版 Light／High 路徑。
- 四招共同使用原 CMD 人類入口與次序：x→200、y→210、a→230、b→240；不可蹲按、不可從空中起招；Ctrl 或 200／230 的 MoveType=I 可起招。AI 分支未啟用。未寫 guard.cornerpush 時按 IKEMEN 預設沿用 ground.cornerpush；Hit priority 數值比較保留，不因新招 priority=1 與 200 的 3 不同而卡死。
- 預設 P1：Z 輕拳、X 強拳、A 輕踢、S 強踢；P2：Num0／Num.／Num1／Num2。Settings 自訂鍵位繼續有效，l/r 暫留未接。

本版支援地面目標接觸。完整空中受擊／倒地 runner 仍未接入；空中目標只顯示 Clsn overlap，不套用錯誤的地面受擊 state（這是未支援能力的限制，並非原 IKEMEN 免疫規則）。air HitDef／var(3) 等來源保留，待空中受擊切片驗收；命中 spark S905 及完整 P2 CMD buffer／所有 Common 邏輯亦未宣稱完成。

自動測試：雙玩家×雙 facing×210／230／240×命中／站防，共 24 組；原傷害、240 離地／241 著地／回 0、230 上／下取消與跳後 52、52 聲音只播放一次，及完整前版回歸。人工待測：上述三招聲音／影格／Clsn、站防／蹲姿命中、角落推退、200／230 收招接強拳／踢與 240 著地。鏡頭、640 guard distance、hitshake x2 不變。接觸計時未 CHECK；GetHit／HitOver／HitShakeOver／HitVelSet 初步 TEST、待深測；range 待實際 state 接入驗收。

## 0.23.23 實作紀錄

BUILD `keyboard-settings-run-fx-m1-20261002-01`。補 State 100 腳步聲、105 原 Explod 909，重設雙人鍵位並加入 Settings → Keyboard。鏡頭、guard distance=640、hitshake x2、移動／命中規則不改。

- State 100 原 PlaySnd `100,0` 在 AnimElem 3／9 播放，每次 Action 100 循環都再觸發；雙方聲道分開。106 原 PlaySnd `52,0` 同步補上。兩個 WAV 都直接來自 Venus SND，沒有合成或代用聲音。更正上版分類：PlaySnd 未加 S 前綴不代表共用 SND，這兩項是角色音效。
- State 105 在原 `AnimElemTime(5)=0` 建立 Explod 909；原 AIR 四格各 2 ticks、原 SFF／palette／axis、P1-relative facing、vel=10,-5、sprpriority=3、ownpal=1。按 IKEMEN 預設 bindtime=1、removetime=-2；首 tick 綁 owner，之後獨立移動，8 ticks 完成移除，owner hitpause 暫停。只接此來源切片，不宣稱完整通用 Explod；106 MakeDust 仍未接。
- P1 移動：↑↓←→；x=Z、y=X、a=A、b=S、l=Q、r=W。WASD 不再作移動。
- P2 移動：Num8／Num5／Num4／Num6（上／下／左／右）；x=Num0、y=Num.、a=Num1、b=Num2、l=Num/、r=Num*。舊 J／L／U 不再控制角色，使用 physical event.code，不靠 NumLock 字元。
- 遊戲右上 Settings 開啟 Keyboard 設定：點鍵位再按新鍵、儲存／取消／恢復預設，保存在該瀏覽器。兩位玩家不可分配同一按鍵；開啟時暫停並清除 held input，關閉恢復原暫停狀態。現有原型主頁提供入口，未另造完整主選單。
- 鍵位已全部可設定及接收，不代表所有招式已完成：目前出拳仍是 x→State 200；P2 上／下及其他攻擊鍵的完整 CMD／招式 runner、l/r 來源命令映射仍待接入，不自行把 l/r 當 c/z。

自動驗證：雙人預設鍵位、取消舊移動键、重複鍵拒絕、設定儲存讀回／取消／預設；兩位玩家跑步第二圈音效及雙 facing 的 909 位置／速度／8-tick 壽命／hitpause／可見畫面，並跑完整既有回歸。人工待測：FF 持續跑時腳步聲、BB 的 909、106 著地聲，雙人 x 同時出拳及自訂鍵位重開仍保留。接觸計時仍未 CHECK；GetHit／HitOver／HitShakeOver／HitVelSet 初步 TEST、待深測；range 待實際 state 接入驗收。

## 0.23.22 實作紀錄

BUILD `run-backdash-land-m1-20261002-01`。0.23.21 防禦 transition 倒跳修正由使用者 PASS。按原 Common／CMD／AIR／SFF 接入雙方 State 100／105／106 動作切片，與既有 shared controller handlers 共用；controller 保留來源行號，AI 分支保留但 AILevel=0 不執行。

- 跑步：朝前快速點兩下（FF，原 CMD time=10）；第二下繼續按住，原 run.fwd.x=18 移動、Action 100 十二影格循環；鬆開前方向回 0，NoWalk／NoAutoTurn 保留，不會被普通行走覆蓋。
- 後跳：朝後快速點兩下（BB，time=10）；原 run.back.x=-30、run.back.y=-5，Time>0 加 yaccel×.625；105 為 physics N，但仍按原引擎移動座標。PrevStateNo=[200,440] 保留 X×1.02；原 CMD ctrl／命中取消／guard-slide 入口保留可用切片，未接入的 440／5070 不假裝可測。
- 105 facing 鎖定、ctrl=0、原每 tick NotHitBy SCA；現有 hit collision 不命中此 state。Action 105 四個 1-tick 影格後停在最後無限影格；Pos Y>2 轉 106，不改成一般 jump 的 State 52。
- 106 原 Action 106 為一個 3-tick 影格；原入口 VelSet／PosSet 令 X/Y 速度=0、Y=0，動畫完成回 0／ctrl=1。不借用原 Turn 或 guard 動畫。
- P1 使用方向鍵／WASD，P2 Keyboard 使用 J／L；全部前後方向相對 facing。兩次點按之間須鬆開；Keyboard repeat 不當第二次按鍵，失焦清除歷史。P2 這是 FF／BB 最小來源命令映射，不是完整 CMD buffer／redirect runner。
- S105,0 使用已匯出的 Venus 原 WAV。當時 100 腳步／106 著地音效、105 Explod 909、106 MakeDust 列入 deferredLocomotionEffects；前兩項當時誤判為共用音效，已於 0.23.23 核對及更正。

人工驗收待測：兩個 facing／兩位玩家分別 FF 持續跑／鬆鍵停止、BB→105→106→0、舞台左右邊界後跳、後跳中換位不翻身、106 著地無向前彈跳。保留 640 guard distance、hitshake x2、角落、互中與既有鏡頭。接觸計時未 CHECK；GetHit 系列初步 TEST、待深測的狀態不變。

自動測試 PASS：雙玩家×雙 facing 的實際雙點按入口、跑速／持續／鬆鍵、後跳初速／facing lock／著地停速／恢復 ctrl；原 prevstate 區間的 1.02 加成、105 NotHitBy；兩位玩家的 30／60／120 Hz 一致與左右邊界後跳不前彈；完整既有回歸通過，browserErrors=[]。全量 Common、P1 跑跳的額外 State 40 分支及所有 CMD 時序仍待後續，沒有以這個切片聲稱全部完成。

## 0.23.21 實作紀錄

BUILD `guard-transition-end-frame-m1-20261002-01`。修正 Action 120／121／140／141 在最後一個 tick 跳回第一格、下一 tick 才轉 state 的畫面抖動；一次性防禦 transition 保持最後格直到原 state 完成條件生效，不改 AIR ticks／素材／鏡頭或其他循環動畫。新增逐 tick element 序列檢查，不再只驗收最終 state。

重新核對 sources/venus/original/venus.cns 與作者本機角色檔案：Size attack.dist 都是 640，DEF localcoord=1280,720。使用者確認保留原 CNS 640；不自行缩成拳頭 Clsn 距離。圖中約 562／623 軸心距離在原 pre-guard 範圍內，拳頭未接觸仍會預防禦；實際命中另由 AIR Clsn 判定。

本版人工驗收待測：左右 facing 的站／蹲起防與收防，留意最後一格不再倒跳第一格；原範圍 640 不變。接觸計時未 CHECK；GetHit／HitOver／HitShakeOver／HitVelSet 初步 TEST、待深測的紀錄保留。

## 0.23.20 實作紀錄

BUILD `guard-distance-start-end-m1-20261002-01`。修正 Dummy 防禦選單把無攻擊的 P2 永久放入 guard 動作：站防未受威脅留 State 0；蹲防未受威脅留 State 11。只有對手 MoveType=A、同在地面且在攻擊者 facing-relative 前方 0 < 距離 < 640（原 Venus attack.dist）才進 State 120，站／蹲分別用原 Action 120／121；不是另創 State 121。

按原 AIR／SFF 匯入起防 120／121、收防 140／141。起防完進 130／131；對手停止攻擊、離開範圍或鬆開後防則進 140 收防，再回 0／11。Keyboard 後防亦使用此入口；hit／guard stun 不因失去距離而立即取消。640 是預防禦距離，不是拳頭 Clsn 實際命中距離；守備可在 HitDef 活躍之前的 startup 觸發。本切片僅地面 State 200，未宣稱空中／projectile／Helper GuardDist 完整支援。

人工驗收（本版待測）：Dummy 站防／蹲防下，雙方不攻擊應 S0／S11；遠距 X 應不擺防；進前方 640 範圍內 X 應起防；攻擊結束應收防；近距站防仍不扣 HP；兩邊換位置再測。接觸計時未 CHECK；GetHit／HitOver／HitShakeOver／HitVelSet 已初步 TEST、待深測；range 仍待實際 state 接入驗收，以上都未標為最終 PASS。

同時修正進入未指定 moveType 的 idle／普通 state 時錯誤繼承上一招 A 的問題，採用 StateDef 預設 I，避免停手後仍被視為攻擊。guard 起防／收防保留原 AIR ticks（6／5）。

本版自動測試 PASS：48 組雙 facing／站蹲／無攻擊或 startup／0、400、639、640、641、後方距離條件；原起防→維持→收防→idle 鏈及既有完整回歸通過，browserErrors=[]。這不是本版人工 PASS。

## 0.23.19 實作紀錄

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

- P1：方向鍵移動，x=Z、y=X、a=A、b=S、l=Q、r=W；WASD 不移動。P2：Num8／5／4／6 移動，x=Num0、y=Num.、a=Num1、b=Num2、l=Num/、r=Num*；不再使用 J／L／U。Settings 可自訂，亦可切回 Dummy。
- Input 可選 Auto／Keyboard／Touch；失焦清除 held input。右上 □ 顯示 CLSN，Ⅱ 暫停／逐 tick，↓ 匯出最近 600 ticks 診斷 JSON（非 replay save）。
- 更新後確認 Prototype／READY=0.23.33、BUILD=`crouch-exit-end-frame-m1-20261002-01`。本版測試方向見最上方；Pause/Break 播放，Scroll Lock 暫停／逐 tick，Space 回復雙方 HP／KO 起身。
- 自動回歸使用 `tools/check-runtime.cjs`；Node、Playwright／Edge、遊戲資料與既有 Three.js CDN 需要可用。本次新增 range 邊界、hit timers、HitVelSet facing／axis masks、接觸計時及 pause／reset 檢查。
- 本版自動測試 PASS：40 組 range 邊界、兩個 facing 的 GetHit／HitVelSet／未知欄位拒絕、接觸 pause／reset，以及既有 448 組 expression parity、雙向 hit／guard／corner、同時 X／U／互中、鍵盤／CLSN／Turn／30-60-120 Hz 回歸；browserErrors=[]。瀏覽器人工驗收待使用者測試。

## 0.23.19 驗收清單

使用者更新：接觸計時未 CHECK；GetHit／HitOver／HitShakeOver／HitVelSet 已初步 TEST，待深測；range 尚未人工驗收。保留上方自動測試紀錄，不把自動測試或初步 TEST 當作最終 PASS。部分只有底層 evaluator 測試，不能靠目前出拳畫面驗收完整語義。

| 項目 | 目前接線／限制 | 人工驗收方法與預期 | 狀態 |
|---|---|---|---|
| 接觸計時 MoveContact／MoveGuarded | State 200 有接觸記錄與 query；HUD 未直接顯示這兩個 counter。 | P2 Dummy 不防禦：近距離 X 命中；站防再 X；拉遠 X 揮空。命中 contact=1、guarded=0；防禦兩者=1；8 ticks hitpause 不增長，之後增長，轉 state 清零。精確 counter 要用 ↓ trace 的 moveContact／moveGuarded 核對，單看 HP 不足。另需 P2→P1 對稱驗收。 | 未測試／未 PASS |
| GetHitVar 查詢 | ground slide 用 slidetime／ctrltime；HitVelSet 用 xvel。部分欄位只提供查詢，未由可玩 state 消費；現有 trace 的 getHit 是記錄，不是每個 GetHitVar 呼叫的回傳值。 | X 打 P2，再用 U 打 P1，雙方換邊各做 hit／stand guard；↓ 核對 attackerId、世界 xvel（hit ±16／guard ±24）、slidetime（11／16）、初始 hittime（15／22）。live hittime／hitshaketime 及其他欄位需 evaluator 診斷，不能以 getHit.hittime 靜態值驗收倒數。 | 初步 TEST／待深測，未最終 PASS |
| HitOver／HitShakeOver | 目前 ground reaction handler 已呼叫 evaluator；尚不是全量 Common controller runner。 | 用 Ⅱ 暫停／逐 tick：命中後 shake 結束才進 slide（5000→5001；站防 150→151），slide 結束後恢復。精確邊界：shake=0 為真，hittime=0 的 HitOver 仍是假、-1 才真；HUD 沒有 timer，邊界仍需診斷／自動測試，肉眼只能驗收動作鏈。 | 初步 TEST／待深測，未最終 PASS |
| range expressions | AST 支援四種端點；原 Common range controllers 尚未接入完整 runner。現有可玩 State 200 不足以驗收所有 range。 | 暫無完整玩家操作測法，保留未驗收。底層測試在 0／2 邊界與區間內外核對 []、[)、(]、() 及 !=；待含 range 的原始 controller 真正接入後再做遊戲驗收，不為測試新增猜測 state。 | 未測試／未 PASS；待實際 state 接入 |
| 來源 HitVelSet | 原 State 151／153／5001 的 Time=0、x=1 controller 已接入；Y／axis mask 只做底層測試，空中受擊未接入。 | 雙方換邊測 X／U 命中與站防：slide 只在入口套速度，受擊者向遠離攻擊者方向退，不每 tick 重設、不突然前移。角落另測 attacker cornerpush。153 可用 P2 Dummy 蹲防作條件測試，但若原 AIR Clsn 令拳揮空，不能聲稱測到該 state，保留待測；Y／空中分支待可用原 state。 | 初步 TEST／待深測，未最終 PASS |

建議順序：先雙向 hit／stand guard／whiff → 左右換邊 → 暫停逐 tick 的受擊鏈 → 角落 → ↓ 匯出異常 trace。看不到的 counter／timer／range 端點留待診斷頁或原 state 接入，不能因「打拳正常」就把全部項目 PASS。

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
- [ ] GetHit／HitOver／HitShakeOver／source HitVelSet 已初步 TEST、待深測；接觸計時未 CHECK；range 待實際 state 接入。均未最終 PASS，逐項按上表驗收。
- [ ] 全量 SFF 分批 atlas／metadata：linked sprites／palettes／透明度／axis／AIR flips／Clsn default。
- [ ] 動態／外部 source references 追至 Helper／CMD；全量未知 controller／trigger／expression 報告。
- [ ] P1／P2 完整共同 fighter／Common runner；source controllers 逐條移除近似實作、timer／動畫 clock 與順序驗證。
- [x] 0.23.23 使用者 PASS：雙方 100／105／106、原跑步／著地聲、909 與鍵位設定；106 MakeDust 仍待接入。
- [x] 0.23.24 使用者全 PASS：210／230／240／241、52 著地聲；完整空中受擊仍未支援。
- [x] 0.23.25：400／410／430、High／Low guard 及蹲姿 Light／Medium GetHit，使用者全 PASS。
- [ ] 0.23.26：440／Trip、普通 falling／bounce、倒地／起身／KO 與 HitFall controllers 已接入，待人工驗收；完整空中攻擊與空中命中另列後續。
- [ ] 0.23.27：依回報調低 440 速度，補普通命中致死／HP0 強制 KO 跌倒；待人工驗收，不把 0.23.26 問題標 PASS。
- [ ] P1 跑跳 State 40 額外來源分支、全量 -1 未接入必殺／超必殺、-2／-3、可重播 input／state trace；P2 蹲／跳已接。
- [x] 0.23.31 使用者 PASS：600／630 LoopStart、雙方回血／Space 與 KO 起身。
- [ ] 0.23.32：雙人 command time／buffer、MoveHit／MoveContact／MoveGuarded、來源普通技重入／取消與可用玩家 -1 已接入，待人工驗收；必殺／投技來源 controller 保留 deferred。
- [ ] 0.23.33：A12 結尾誤回圈修正，雙人兩面向逐 tick 自動驗證，待人工驗收；0.23.32 其他項目使用者暫時 PASS，深測標記不變。
- [x] 0.23.29 使用者 PASS：Trip 動畫連續性／ChangeState tick travel、普通 KO 跌倒、Pause／Scroll Lock debug。
- [ ] 0.23.30：600／610／630／640、5020／5030／5035／5040／5050 已接入，待人工驗收；5200／5201／5210 已完成來源 fixture，recovery 入口按原註解停用。
- [ ] 其他普通技與各種 HitDef priority，按來源相依順序接入。
- [ ] Helper／Explod／Projectile／Pause／SuperPause、完整音效 channel／pause 語義、必殺技／能量／無敵／特效。
- [ ] Intro／win／taunt／KO／round／AI、完整招式表；每招與原 IKEMEN 並排比對、手機性能／输入回歸。

下個切片：驗收 0.23.41 裁切／HP／Timer，然後接真正 5900→Intro→RoundState→KO/TimeOver→Win/Lose→下一回合，再完成 Powerbar／姓名／勝利圖示與 AI 驗收。普通必殺技與 command buffer 已接入，不再當成下一個待做切片。未完成 645／投技繼續只作參考，不啟用註解 recovery 入口。


