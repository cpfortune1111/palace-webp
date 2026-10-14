# Hit reaction metadata — partial integration

Actual source/contact/enum/query fixture and complete browser regression passed with terminal exit code 0 in outputs/controller-hit-reaction-metadata-actual.log.

Pinned CNS compiler accepts the first letter of Light/Medium/Hard/Back/Up/Diagup, whose enum values are 0/1/2/3/4/5. Missing air.animtype inherits ground animtype; missing fall.animtype inherits Up/Diagup air reactions, otherwise Back. Hit types None/High/Low/Trip are 0/1/2/3, with missing air.type inheriting ground.type.

Actual contact now produces ground.animtype/air.animtype/fall.animtype and groundtype/airtype/current type queried by GetHitVar. Explicit recipient compatibility='ikemen' uses the native active-reaction selection before KO overrides: fall reaction first, then air, otherwise grounded Back-or-higher with zero Y velocity becomes Hard. The legacy active animtype path remains unchanged.

Focused defaults/enum/selection tests pass. Actual source/contact/query fixtures are running. Still partial: full KO animation selection, forced-stance ordering, ZSS expression grammar, guarded/reset defaults, source-state ownership and all-version parity remain Pending. These getter hooks are not full parameter certification.
