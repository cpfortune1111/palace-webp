# r34 — Jupiter Giant Swing

Scoped authored-source update: S800, S801, S805, S806; AIR800/801/802/803/805/806 including exact timing and collision boxes; SNES human CMD Swing and18 input definitions; SNES AI Giant Swing controller. Retain all other validated states and AI decisions. Place new human special before movement/normals and new AI throw before movement decisions. Original strength selection retained (authored AI picks light version).

Five-character5641 WebP supplement: Moon16, Venus16, Jupiter18, Neptune16, Saturn16 sprites,82 total. Jupiter supplement also contains new swing sprites. Quality85 WebP with alpha retained and transparent padding trimmed with axis correction. All atlas pages decode before battle; no raw SFF/SND uploaded and no3DO enabled.

New StateOwner redirect resolves throw author, including mirror matches. P1 custom-state controllers now receive their expression context, and P1 refreshes its state-data context after P2 can transfer it during a tick. ChangeAnim2 uses Jupiter frame order/timing and victim's own5641 sprites. Original portrait identity remains separate.

Validation:20 combinations (five victims × two sides × light/heavy), complete release to own fall states, finite positions and no missing sprites/runtime errors. Light damage280/heavy320 at default stats. Both real HitDef contact paths pass. Source AI triggers in fight, rejects post-round and dispatches S800. Four KO variants release normally. Existing Moon throws, winner facing, KO effects and natural S3005→3006→3007 cleanup regression pass.
