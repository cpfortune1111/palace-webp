# Battle declarations

Non-training matches transition from P2 ACS confirmation into declarations before the existing battle loading/start flow. ACS artwork, portraits, names and controls fade out over 30 ticks; the background stays. Existing falling lights continue their current lifetime without recycling into new particles. Title BGM pauses and cannot restart through input gestures during declarations/loading.

Both VS portraits spawn simultaneously, fade in and move inward over 90 ticks. Venus uses the provided VS image, cropped to its transparent bounds, scaled uniformly to 720px high, and saved as lossless WEBP.

Voice triggers derive from Venus AIR 191 and CNS S191: element 9 begins at tick 41 (190,0), element 29 begins at tick 151 (190,1), sharing the speaker's voice channel. The sequence waits for the actual final audio to finish, then waits 90 ticks before starting P2's corresponding sequence. After P2 finishes, it waits 90 ticks and fades the whole frame to black over 30 ticks before starting the match.

`Data/VS/declarations.json` stores a character's variants as paired image/cue definitions. One variant is selected randomly for each player per declaration. Venus currently has exactly one supplied variant/voice set; no duplicate second variant or fabricated lip-sync animation is added. Add future animation/voice pairs to this structure when those assets exist. Other characters remain subject to the existing selection availability restrictions.

Declaration assets and voices are fetched in the selection/ACS preload path. Keyboard/touch cannot skip or change ACS allocations after declaration begins. Training bypasses both ACS and declarations.

