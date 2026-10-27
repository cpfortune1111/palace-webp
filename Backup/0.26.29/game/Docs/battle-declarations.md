# Battle declarations

Non-training matches transition from P2 ACS confirmation into declarations before the existing battle loading/start flow. ACS artwork, portraits, names and controls fade out over 30 ticks; the background stays. Existing falling lights continue their current lifetime without recycling into new particles. Title BGM pauses and cannot restart through input gestures during declarations/loading.

Both VS portraits spawn simultaneously, fade in and move inward over 90 ticks. Rendered height is 360px, with centers P1 (280,360) and P2 (1000,360) in the 1280x720 layout. Venus uses the provided VS image, cropped to its transparent bounds, exported at 720px high for resolution, and saved as lossless WEBP.

Voice triggers derive from Venus AIR 191 and CNS S191: element 9 begins at tick 41 (190,0), element 29 begins at tick 151 (190,1), sharing the speaker's voice channel. The sequence waits for the actual final audio to finish, then waits 15 ticks before starting P2's corresponding sequence. After P2 finishes, it waits 15 ticks and fades the whole frame to black over 30 ticks before starting the match.

`Data/VS/declarations.json` stores a character's variants as paired image/cue definitions. One variant is selected randomly for each player per declaration. Venus currently has exactly one supplied variant/voice set; no duplicate second variant or fabricated lip-sync animation is added. Add future animation/voice pairs to this structure when those assets exist. Other characters remain subject to the existing selection availability restrictions.

Declaration assets and voices are fetched in the selection/ACS preload path. Keyboard/touch cannot skip or change ACS allocations after declaration begins. Training bypasses both ACS and declarations.

## Match results

Pre-match portraits enter for 90 ticks, then hold for 15 ticks before starting the S191 declaration timeline. Results hold for 15 ticks after both entry and winner/loser vertical movement finish, then start the loser's declaration. Original voice cue offsets remain unchanged. Every numbered round waits 30 ticks after its announcer finishes before FIGHT; Training still skips the round announcement.

Whole-match completion opens the same background and portraits without ACS controls or newly generated particles. The page fades in over 30 ticks, portraits enter over 90 ticks, then the winner moves up 60px and the loser down 60px over 30 ticks. The loser speaks first, followed by a 15-tick wait, the winner's line, another 15-tick wait, and a 30-tick loser-only fade before returning home. BGM stays paused throughout. Score/Continue screens are not implemented here.

Venus defeat uses 170,0 at tick 0. Victory randomly selects 180,0 at tick 0 or 180,1 at tick 20, matching S181's animation triggers. Actual audio completion gates both waits. Draws use no fabricated winner/loser line and fade back home. Both pre-match and result assets preload with selection.

