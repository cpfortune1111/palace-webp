# Native AfterImage prerequisites and synchronization (partial)

Reference: Ikemen GO cb56d73badb322f3725257c2e8cfd157b2c3989d, char.go AfterImage setup/record/cue and Explod synchronization; compiler_functions.go AfterImageSub/AfterImageTime; bytecode.go AfterImage execution.

The previous root-only simplified trail is replaced for actual AfterImage controllers. Root and normal Helper recipients now own independent bounded sprite histories. The controller reads time/length/gaps, palette color/hue/inversion/brightness/contrast/postbrightness/add/mul, Trans/alpha and ignorehitpause. Redirect and AfterImageTime suppress unreachable expressions and preserve native time/value precedence. Palette gradients use float32 multiplication and signed integer conversion. MUGEN and Ikemen histories use different ring sizes and sampling offsets.

The real draw consumer retains sprite source, atlas arguments, matrix, clipping, opacity, layer and priority. Historical priority clamps do not rebound. Ghosts clear synchronization identity and do not enter reflection/shadow paths. AfterImageTime resets the time counter without clearing the ring. The compositor explicitly activates for historical sprites.

ModifyExplod synchronization copies active target settings, counters specified by native synchronization and shared palette zero. It preserves the effect's own ring, cursor and recording count. It deliberately does not call setup: the pinned native synchronization path likewise leaves newly allocated history/palette buffers at constructor sizes. Source time zero does not erase retained effect state.

Evidence: independent history/version/pause/redirect/controller/sync checks; eight browser root/Helper/P1/P2/character-version combinations test actual drawing matrices, pixels, once-per-tick capture and separate effect history. Full-battle Offset/AngleDraw checks now inspect real historical sprite snapshots instead of the retired simplified controller format. Legacy raw trail fixtures remain available only for existing drawing tests.

Still pending: exact native CueDraw/acttmp/slow-frame interpolation timing, snapshots for simulation ticks skipped by drawing, global AfterImageMax budgets, complete creation-time Explod AfterImage parameters, provider/version edge cases and native executable differential validation. The excluded indexed character recoloring path is not reintroduced. No whole-controller or syncparams certification is claimed. No original assets are added.
