# 0.23.52 — Custom scoring based on IKEMEN (Venus 1v1)

Source: Moon Palace `data/score.zss`, `data/functions.zss`, `data/common.const`, and `data/fight.def`.

Total = damage points + first attack + counter hits + combo bonuses + victory bonuses + vitality/time bonus + eligible win streak bonus.

- Damage = damage × attack multiplier × platform multiplier, rounded to the nearest 100 after all multipliers. Normal: 8, without an input-mode bonus. Special: 6 × input multiplier. Hyper: 10 × input multiplier. Platform: SNES 1, 3DO 1.1, Sega Saturn 1.25. Input: AI 1, human AUTO 1, human NORMAL 1.2; only special/hyper attacks receive this multiplier. AI takes precedence over the selected command mode. Guard damage also counts. An explicit HitDef `score` overrides the formula. Helpers/projectiles use their owning player's profile. Platform uses the source combined mode variable (0/10 SNES, 1/11 3DO, 2/12 Saturn); the current menu still selects SNES NORMAL/AUTO, not a new platform selector.
- First successful unguarded attack: 1,500 once per round.
- Counter hit: 100 when the defender is attacking.
- Combo bonus, awarded once when the combo ends: 2 hits 300; 3 500; 4 1,000; 5 1,200; 6 1,500; 7 2,000; 8 2,300; 9 2,600; 10 3,000; 11 3,300; 12 3,600; 13 4,000; 14 4,500. For 15+ hits: min(10,000, 5,000 + (hits − 15) × 1,000).
- Perfect victory: 15,000; hyper finish: 10,000; special finish: 3,000. Perfect can stack with the finish bonus.
- Vitality/time: round-to-100(remaining HP / maximum HP × 10,000 × multiplier). Venus maximum HP is 1,000.
- Remaining-time percentage: >90% ×5; >85% ×4; >80% ×2.5; >70% ×2; >60% ×1.5; otherwise ×1. Infinite timer uses ×1 in this implementation.
- Eligible match win streak: 30,000 + (consecutive match wins − 1) ×10,000. Following the source, this only applies to the non-home team against an AI opponent. Ordinary player-versus-player VS has no streak bonus.

Scores carry across rounds and reset for a new match. Display range: 0–9,999,999. The original scripts do not define S/A/B letter ranks, so none are invented here.

Win markers use the source WinIcon positions and offsets: 100 normal, 101 special, 102 hyper, 103 throw, 104 chip, 105 time over, 106 suicide, 107 teammate, with 110 perfect overlay. Groups 108/109 are absent from the source SFF. The current playable scope remains Venus 1v1.

Esc returns to the previous page; Enter pauses/resumes gameplay. A4000 screen-relative Explods now use the screen origin instead of the player's world position.

## Proposed Venus rank thresholds (not yet a displayed feature)

Use the average score of completed rounds in one match, not the total, so a third round does not automatically improve the rank. Proposed preliminary thresholds: SS >=80,000; S >=65,000; A >=50,000; B >=35,000; C <35,000. These are custom proposals, not IKEMEN defaults, and need calibration using real Venus matches. Training is excluded; show platform, command mode and timer alongside any rank. Infinite/short timers reduce the vitality/time bonus, so compare like-for-like settings rather than a single mixed leaderboard.

Baseline example: SNES, 1,000 normal-attack damage, first hit, perfect victory and >90% time remaining gives 8,000 + 1,500 + 15,000 + 50,000 = 74,500 before combo bonuses (S), for both NORMAL and AUTO. A 15-hit combo adds 5,000 (79,500, still S); 16 hits adds 6,000 to reach SS. In practice damage points are rounded per hit, so splitting damage across hits can change the total. A 50%-HP win with >70% time remaining gives approximately 8,000 + 1,500 + 10,000 = 19,500 before combo/finish bonuses (C).

While paused, only the lifebar's decorative frames and stage GLB animation advance. Gameplay, characters, helpers/projectiles, Explods, timer, round flow, and HP interpolation/hold counters remain frozen. Resume continues from the exact paused state.
