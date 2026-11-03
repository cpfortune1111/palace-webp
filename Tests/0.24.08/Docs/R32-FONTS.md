# r32 — bitmap font preview and announcements

Preview: font-review.html. Reuses title stage, decorations, carousel and star effect. No battle character assets. Main menu production font unchanged pending user choice. Supports normal/selected group selection, text height, uppercase, stage pause, round text and navigation artwork samples. Footlight whole-word mapping Arcade=48, VS=49, Training=55, Watch=56, Settings uses Options=57. Groups 0 and 1 retained; no invented Settings glyph.

All original groups exported to lossless WebP: foker60b 0–6 (6 uppercase only); foker90 0–5 and7; foker120 1/3; Footlight0/1. No raw SFF/DEF uploaded.

Battle round view preloads foker90 before battle. ROUND uses group0; P1/Team1 Wins group3; P2/Team2 Wins group1; TIME OVER group2. Existing FIGHT/KO artwork untouched.

Back/Exit artwork updated from user WEB directory, 237×73 source at50%=118.5×36.5. Selection Exit, ACS Back and Settings Back retain their existing actions and anchors.

Validation: all18 available font groups render all5 menu items; actual round view drawn and winner group mapping checked; screenshots reviewed; module and inline-script syntax checks passed.
