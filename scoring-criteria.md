# 0.23.50 — IKEMEN scoring (Venus 1v1)

Source: Moon Palace `data/score.zss`, `data/functions.zss`, `data/common.const`, and `data/fight.def`.

Total = damage points + first attack + counter hits + combo bonuses + victory bonuses + vitality/time bonus + eligible win streak bonus.

- Damage: normal damage × 8; special × 9; hyper × 10. Round each award to the nearest 100. Guard damage also counts. An explicit HitDef `score` overrides the damage formula.
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
