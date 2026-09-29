0.19.7d AIR 200 / SFF Sprite Import
Upload/replace index.html and ADD venus_attack200_atlas.png + venus_attack200.json.
Keep the existing 0.19.7a venus_runtime_states.json and venus_cmd_runtime.json.

Source-first:
- venus.air Action 200 = 7 frames: 200,0(1), 200,1(1), 200,2(1), 200,3(5), 200,2(1), 200,1(2), 200,0(2)
- extracted SFF v2 PNG8 sprites 200,0..3 from actual venus.sff
- resolved each sprite's SFF palette bank and palette-index-0 transparency
- dedicated compact attack atlas; existing movement atlas is untouched

Scope remains animation only: no HitDef, collision, damage, or PlaySnd yet.
