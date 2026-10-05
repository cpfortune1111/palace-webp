# Ability Customize System

ACS presentation update: zero-point radar vertices now begin at radius 27.5, matching the previous one-point shape; levels 1–5 extend to radius 137.5 without changing the actual allocation or combat formulas. Confirm artwork retains its original uniform aspect ratio. Selected numbers glow white rather than using a selection ring. All available portrait/name assets, ACS art and the font are decoded before the selection loading screen completes; entering ACS does not display an intermediate black loading page. P1-to-P2 transitions keep the title fixed, move the board and numbers to the mirrored left position, crossfade the points/Confirm controls, and bring the P2 portrait/name in from the right. Returning to P1 reverses the transition and preserves allocations.

VS / Watch: 15 points per player. Arcade / Story budget: 10 (reserved for the future mode). Training skips ACS and resets modifiers to baseline. Each skill accepts 0–5 points; unused points may be confirmed.

| Ability | Per-point calculation | Level 5 example |
|---|---|---|
| ATK | base damage × (1 + 0.07 × level) | 4 → 5.4 |
| S.ATK | base damage × (1 + 0.20 × level) | 10 → 20 |
| DEF | incoming damage × (1 − 0.10 × level) | 4 → 2 |
| PLAYFUL | failure probability = 0.092 × level | 46%, corresponding to 23/50 observed attempts |
| HP | base maximum HP × (1 + level / 12) | 96 → 136 |
| Super (?) | base damage × (1 + 0.10 × level) | 48 → 72 |

Damage modifiers combine multiplicatively, with DEF applied to direct, guarded and fall damage. Fractional damage is preserved; the existing score system retains its own rounding rules. Normal states 200–999 use ATK; 1000–2999 use S.ATK; 3000–3999 use Super. Helper/projectile damage inherits the spawning attack category; HitDef SA/HA attributes provide fallback classification.

PLAYFUL is deliberately a parameter only: no random failure or state transition is applied before the failure state/source logic exists. 23/50 is used as the provisional 46% endpoint, not a promise of exactly 23 failures in every 50 attempts.

Keyboard uses the current game mapping: A/X = Z/A to add, B/Y = X/S to subtract. At level 5 or with no remaining points, these inputs subtract instead. Arrows select a skill; Enter confirms the player; Escape returns to the previous player/selection. Touch taps a skill to add, or subtract at the cap/empty pool. Confirm advances from P1 to P2, then launches battle.

The star background and falling circle/eight-point lights remain; no GLB, beams or reflection stars are loaded by ACS. Artwork is converted to lossless WEBP. BlackQuality.ttf is supplied by the user; deployment requires the font's web-embedding license. Numbers use 28.8px, remaining points 60px, `pt` 40px, all horizontally scaled 125%.

