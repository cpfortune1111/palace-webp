Prototype 0.18.2 — 3D Camera Mapping
BUILD camera-3d-map-s3-20260929-01

Upload these files over the current GitHub Pages repo files.
Do not remove StageTraining.glb already in the repo.

Main camera correction:
0.18.1 proved logical horizontal follow works, but incorrectly fed cameraX (up to ±2850 logical pixels) directly into Three.js PerspectiveCamera.setViewOffset. That exposed the outside of the GLB.

0.18.2 separates coordinate spaces:
- IKEMEN logical camera: ±2850
- IKEMEN player bounds: ±3750
- 2D fighter projection: exact logical coordinates
- 3D GLB camera: logical cameraX * 0.004 world units

The 0.004 conversion comes from StageTraining GLB's approximately ±15 X span after the DEF model scale 0.075 versus the ±3750 logical player range.

Vertical follow and existing stage calibration are unchanged.
