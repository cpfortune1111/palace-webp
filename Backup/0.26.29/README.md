# Moon Palace Web 0.26.29 recovery snapshot

`game/` is a complete frozen copy of commit `c08302e7b5d9032a52684a2d128d57b7bd793fd0`, tree `78e49d7d7554ef4655acd8600c29651952281933` (2,531 files, 316,463,985 bytes). All Git blob hashes were verified before publication. Files reuse existing Git objects; they are independent paths, not links to the changing live game.

To restore, copy the CONTENTS of `game/` into a clean site root and serve over HTTP. Do not copy the enclosing Backup folder into the game. The snapshot retains its original Three.js CDN dependency; offline use requires a compatible Three.js 0.180.0 installation and URL adjustment. Do not open index.html through file://.

Verification: the copied snapshot was served locally in Edge using a local Three.js 0.180.0 mirror. All five characters passed P1/P2 command sampler and expression tests, including 40 hitpause/version observations, without page errors. Native reference toolchains and private comparison fixtures are not included; this is a complete published-site recovery snapshot, not an archive of private development material.

`manifest.json` records every published file and Git blob hash. Previously published source text remains in this historical snapshot; no new original character SFF/SND or authoring masters are introduced. Live game entry point remains 0.26.29.
