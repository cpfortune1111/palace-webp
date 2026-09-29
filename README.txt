Prototype 0.18.3 — IKEMEN 3D Camera Formula
BUILD ikemen-3d-camera-formula-20260929-01

Upload/replace these files in the existing palace-webp repository. Keep the existing StageTraining.glb, mars_atlas.png and mars_anim.json already in the repo.

0.18.3 changes only the 3D horizontal camera conversion: the old hardcoded 0.004 mapping is removed and replaced by the IKEMEN GO Stage.drawModel() formula derived from FOV, model Z offset and localcoord height. For StageTraining the resulting posMul is about 0.00066987, so cameraX +/-2850 corresponds to about +/-1.91 3D units.

The locked 1.860 stage calibration, -60 stage Y shift, ground 660, joystick feel, Venus runtime/state behavior and camera/player bounds are preserved. Vertical/zoom source parity is intentionally not changed in this milestone.

After GitHub Pages deploys, the HUD must show:
Prototype 0.18.3 · IKEMEN 3D Camera Formula
BUILD ikemen-3d-camera-formula-20260929-01

READY detail should show posMul about 0.00066987. At CAM X -2850, HUD GLBX should be about -1.91 (instead of -11.40).
