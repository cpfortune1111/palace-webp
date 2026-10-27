;***************************************************************************
; Player Icon
;***************************************************************************
[Statedef 915]; P1 Icon*****************************************************
physics = N
velset = 0,0
ctrl = 0
anim = 999
sprpriority = 1

[State 915, WinExplod]
type = Explod
triggerall = !NumExplod(916)
trigger1 = root,Life > 0
trigger1 = win
;trigger2 = root,StateNo = 195
id = 916
anim = 916
postype = left
pos = 78,123
ownpal = 0
ignorehitpause = 1
scale = 0.75,0.75
removetime = -1

[State 915, LoseExplod]
type = Explod
triggerall = !NumExplod(919)
trigger1 = lose
trigger2 = root,Life <= 0
anim = 919
id = 919
postype = left
pos = 78,123
ownpal = 0
ignorehitpause = 1
scale = 0.75,0.75
removetime = -1

[State 915, GetHitExplod]
type = Explod
triggerall = !NumExplod(917)
trigger1 = root,StateNo != [120,159]
trigger1 = root,MoveType = H
anim = 917
id = 917
postype = left
pos = 78,123
ownpal = 0
ignorehitpause = 1
scale = 0.75,0.75
removetime = -1

[State 915, LowHPExplod]
type = Explod
triggerall = !NumExplod(918)
triggerall = root,Life <= root,LifeMax/4
trigger1 = root,MoveType != H
trigger2 = root,StateNo = [120,159]
anim = 918
id = 918
postype = left
pos = 78,123
ownpal = 0
ignorehitpause = 1
scale = 0.75,0.75
removetime = -1

[State 915, NormalExplod]
type = Explod
triggerall = !NumExplod(915)
triggerall = root,Life > root,LifeMax/4
trigger1 = root,MoveType != H
trigger2 = root,StateNo = [120,159]
anim = 915
id = 915
postype = left
pos = 78,123
ownpal = 0
ignorehitpause = 1
scale = 0.75,0.75
removetime = -1

[State 915, NormalRemoveExplod]
type = RemoveExplod
trigger1 = win
trigger2 = root,MoveType = H
trigger2 = root,StateNo != [120,159]
trigger3 = root,Life <= root,LifeMax/4
trigger4 = !root,Alive
trigger5 = Lose
id = 915

[State 915, GetHitRemoveExplod]
type = RemoveExplod
trigger1 = win
trigger2 = root,MoveType != H
trigger3 = !root,Alive
trigger4 = Lose
id = 917

[State 915, LowHPRemoveExplod]
type = RemoveExplod
trigger1 = win
trigger2 = root,MoveType = H
trigger2 = root,StateNo != [120,159]
trigger3 = root,Life > root,LifeMax/4
trigger4 = !root,Alive
trigger5 = Lose
id = 918

[State 915, LoseRemoveExplod]
type = RemoveExplod
trigger1 = root,Life > 0
trigger2 = root,Alive
id = 919

[Statedef 925]; P2 Icon*****************************************************
physics = N
velset = 0,0
anim = 999
ctrl = 0
sprpriority = 1

[State 925, WinExplod]
type = Explod
triggerall = !NumExplod(926)
trigger1 = root,Life > 0
trigger1 = win
;trigger2 = root,StateNo = 195
id = 926
anim = 926
postype = right
pos = -78,123
ownpal = 0
ignorehitpause = 1
scale = 0.75,0.75
removetime = -1

[State 925, LoseExplod]
type = Explod
triggerall = !NumExplod(929)
trigger1 = lose
trigger2 = root,Life <= 0
anim = 929
id = 929
postype = right
pos = -78,123
ownpal = 0
ignorehitpause = 1
scale = 0.75,0.75
removetime = -1

[State 925, GetHitExplod]
type = Explod
triggerall = !NumExplod(927)
trigger1 = root,StateNo != [120,159]
trigger1 = root,MoveType = H
anim = 927
id = 927
postype = right
pos = -78,123
ownpal = 0
ignorehitpause = 1
scale = 0.75,0.75
removetime = -1

[State 925, LowHPExplod]
type = Explod
triggerall = !NumExplod(928)
triggerall = root,Life <= root,LifeMax/4
trigger1 = root,MoveType != H
trigger2 = root,StateNo = [120,159]
anim = 928
id = 928
postype = right
pos = -78,123
ownpal = 0
ignorehitpause = 1
scale = 0.75,0.75
removetime = -1

[State 925, NormalExplod]
type = Explod
triggerall = !NumExplod(925)
triggerall = root,Life > root,LifeMax/4
trigger1 = root,MoveType != H
trigger2 = root,StateNo = [120,159]
anim = 925
id = 925
postype = right
pos = -78,123
ownpal = 0
ignorehitpause = 1
scale = 0.75,0.75
removetime = -1

[State 925, NormalRemoveExplod]
type = RemoveExplod
trigger1 = win
trigger2 = root,MoveType = H
trigger2 = root,StateNo != [120,159]
trigger3 = root,Life <= root,LifeMax/4
trigger4 = !root,Alive
trigger5 = Lose
id = 925

[State 925, GetHitRemoveExplod]
type = RemoveExplod
trigger1 = win
trigger2 = root,MoveType != H
trigger3 = !root,Alive
trigger4 = Lose
id = 927

[State 925, LowHPRemoveExplod]
type = RemoveExplod
trigger1 = win
trigger2 = root,MoveType = H
trigger2 = root,StateNo != [120,159]
trigger3 = root,Life > root,LifeMax/4
trigger4 = !root,Alive
trigger5 = Lose
id = 928

[State 925, LoseRemoveExplod]
type = RemoveExplod
trigger1 = root,Life > 0
trigger2 = root,Alive
id = 929

****************************************************************************
; Player HP Bar Icon
;***************************************************************************
[Statedef 950]
physics = N
velset = 0,0
ctrl = 0
anim = 999
sprpriority = 1

[State 950, NormalExplod]; Team 1:4 *******************************************
type = Explod
triggerall = !NumExplod(950)
triggerall = root,var(49) != 0
trigger1 = root,Life > 0
trigger1 = root,TeamSide = 1
trigger1 = root,NumPartner = 3
id = 950
anim = 950
postype = left
pos = cond(root,var(49) = 1, 139, cond(root,var(49) = 3, 145, cond(root,var(49) = 5, 152, 159))),cond(root,var(49) = 1, 24, cond(root,var(49) = 3, 46, cond(root,var(49) = 5, 67, 88)))
ownpal = 0
ignorehitpause = 1
removetime = -1
sprpriority = -1

[State 950, NormalExplod]; Team 1
type = Explod
triggerall = !NumExplod(951)
trigger1 = root,Life <= root,LifeMax/4
trigger1 = root,TeamSide = 1
trigger1 = root,NumPartner = 3
id = 951
anim = 951
postype = left
pos = cond(root,var(49) = 1, 139, cond(root,var(49) = 3, 145, cond(root,var(49) = 5, 152, 159))),cond(root,var(49) = 1, 24, cond(root,var(49) = 3, 46, cond(root,var(49) = 5, 67, 88)))
ownpal = 0
ignorehitpause = 1
removetime = -1

[State 950, NoHPExplod]; Team 1
type = Explod
triggerall = !NumExplod(952)
trigger1 = root,Life <= 0
trigger1 = root,TeamSide = 1
trigger1 = root,NumPartner = 3
id = 952
anim = 952
postype = left
pos = cond(root,var(49) = 1, 139, cond(root,var(49) = 3, 145, cond(root,var(49) = 5, 152, 159))),cond(root,var(49) = 1, 24, cond(root,var(49) = 3, 46, cond(root,var(49) = 5, 67, 88)))
ownpal = 0
ignorehitpause = 1
removetime = -1

[State 950, NormalExplod]; Team 1:3 *******************************************
type = Explod
triggerall = !NumExplod(950)
triggerall = root,var(49) != 0
trigger1 = root,Life > 0
trigger1 = root,TeamSide = 1
trigger1 = root,NumPartner = 2
id = 950
anim = 950
postype = left
pos = cond(root,var(49) = 1, 141, cond(root,var(49) = 3, 147, 152)),cond(root,var(49) = 1, 32, cond(root,var(49) = 3, 55, 79))
ownpal = 0
ignorehitpause = 1
removetime = -1
sprpriority = -1

[State 950, NormalExplod]; Team 1
type = Explod
triggerall = !NumExplod(951)
trigger1 = root,Life <= root,LifeMax/4
trigger1 = root,TeamSide = 1
trigger1 = root,NumPartner = 2
id = 951
anim = 951
postype = left
pos = cond(root,var(49) = 1, 141, cond(root,var(49) = 3, 147, 152)),cond(root,var(49) = 1, 32, cond(root,var(49) = 3, 55, 79))
ownpal = 0
ignorehitpause = 1
removetime = -1

[State 950, NoHPExplod]; Team 1
type = Explod
triggerall = !NumExplod(952)
trigger1 = root,Life <= 0
trigger1 = root,TeamSide = 1
trigger1 = root,NumPartner = 2
id = 952
anim = 952
postype = left
pos = cond(root,var(49) = 1, 141, cond(root,var(49) = 3, 147, 152)),cond(root,var(49) = 1, 32, cond(root,var(49) = 3, 55, 79))
ownpal = 0
ignorehitpause = 1
removetime = -1

[State 950, NormalExplod]; Team 1:2 *******************************************
type = Explod
triggerall = !NumExplod(950)
triggerall = root,var(49) != 0
trigger1 = root,Life > 0
trigger1 = root,TeamSide = 1
trigger1 = root,NumPartner = 1
id = 950
anim = 950
postype = left
pos = cond(root,var(49) = 1, 147, 149),cond(root,var(49) = 1, 50, 75)
ownpal = 0
ignorehitpause = 1
removetime = -1
sprpriority = -1

[State 950, NormalExplod]; Team 1
type = Explod
triggerall = !NumExplod(951)
trigger1 = root,Life <= root,LifeMax/4
trigger1 = root,TeamSide = 1
trigger1 = root,NumPartner = 1
id = 951
anim = 951
postype = left
pos = cond(root,var(49) = 1, 147, 149),cond(root,var(49) = 1, 50, 75)
ownpal = 0
ignorehitpause = 1
removetime = -1

[State 950, NoHPExplod]; Team 1
type = Explod
triggerall = !NumExplod(952)
trigger1 = root,Life <= 0
trigger1 = root,TeamSide = 1
trigger1 = root,NumPartner = 1
id = 952
anim = 952
postype = left
pos = cond(root,var(49) = 1, 147, 149),cond(root,var(49) = 1, 50, 75)
ownpal = 0
ignorehitpause = 1
removetime = -1


[State 950, NormalExplod]; Team 2:4 *******************************************
type = Explod
triggerall = !NumExplod(950)
triggerall = root,var(49) != 0
trigger1 = root,Life > 0
trigger1 = root,TeamSide = 2
trigger1 = root,NumPartner = 3
id = 950
anim = 950
postype = left
pos = cond(root,var(49) = 2, 1141, cond(root,var(49) = 4, 1135, cond(root,var(49) = 6, 1128, 1121))),cond(root,var(49) = 2, 24, cond(root,var(49) = 4, 46, cond(root,var(49) = 6, 67, 88)))
ownpal = 0
ignorehitpause = 1
removetime = -1
sprpriority = -1

[State 950, NormalExplod]; Team 2
type = Explod
triggerall = !NumExplod(951)
trigger1 = root,Life <= root,LifeMax/4
trigger1 = root,TeamSide = 2
trigger1 = root,NumPartner = 3
id = 951
anim = 951
postype = left
pos = cond(root,var(49) = 2, 1141, cond(root,var(49) = 4, 1135, cond(root,var(49) = 6, 1128, 1121))),cond(root,var(49) = 2, 24, cond(root,var(49) = 4, 46, cond(root,var(49) = 6, 67, 88)))
ownpal = 0
ignorehitpause = 1
removetime = -1

[State 950, NoHPExplod]; Team 2
type = Explod
triggerall = !NumExplod(952)
trigger1 = root,Life <= 0
trigger1 = root,TeamSide = 2
trigger1 = root,NumPartner = 3
id = 952
anim = 952
postype = left
pos = cond(root,var(49) = 2, 1141, cond(root,var(49) = 4, 1135, cond(root,var(49) = 6, 1128, 1121))),cond(root,var(49) = 2, 24, cond(root,var(49) = 4, 46, cond(root,var(49) = 6, 67, 88)))
ownpal = 0
ignorehitpause = 1
removetime = -1


[State 950, NormalExplod]; Team 2:3 *******************************************
type = Explod
triggerall = !NumExplod(950)
triggerall = root,var(49) != 0
trigger1 = root,Life > 0
trigger1 = root,TeamSide = 2
trigger1 = root,NumPartner = 2
id = 950
anim = 950
postype = left
pos = cond(root,var(49) = 2, 1139, cond(root,var(49) = 4, 1133, 1128)),cond(root,var(49) = 2, 32, cond(root,var(49) = 4, 55, 79))
ownpal = 0
ignorehitpause = 1
removetime = -1
sprpriority = -1

[State 950, NormalExplod]; Team 2
type = Explod
triggerall = !NumExplod(951)
trigger1 = root,Life <= root,LifeMax/4
trigger1 = root,TeamSide = 2
trigger1 = root,NumPartner = 2
id = 951
anim = 951
postype = left
pos = cond(root,var(49) = 2, 1139, cond(root,var(49) = 4, 1133, 1128)),cond(root,var(49) = 2, 32, cond(root,var(49) = 4, 55, 79))
ownpal = 0
ignorehitpause = 1
removetime = -1

[State 950, NoHPExplod]; Team 2
type = Explod
triggerall = !NumExplod(952)
trigger1 = root,Life <= 0
trigger1 = root,TeamSide = 2
trigger1 = root,NumPartner = 2
id = 952
anim = 952
postype = left
pos = cond(root,var(49) = 2, 1139, cond(root,var(49) = 4, 1133, 1128)),cond(root,var(49) = 2, 32, cond(root,var(49) = 4, 55, 79))
ownpal = 0
ignorehitpause = 1
removetime = -1


[State 950, NormalExplod]; Team 2:2 *******************************************
type = Explod
triggerall = !NumExplod(950)
triggerall = root,var(49) != 0
trigger1 = root,Life > 0
trigger1 = root,TeamSide = 2
trigger1 = root,NumPartner = 1
id = 950
anim = 950
postype = left
pos = cond(root,var(49) = 2, 1133, 1131),cond(root,var(49) = 2, 50, 75)
ownpal = 0
ignorehitpause = 1
removetime = -1
sprpriority = -1

[State 950, NormalExplod]; Team 2
type = Explod
triggerall = !NumExplod(951)
trigger1 = root,Life <= root,LifeMax/4
trigger1 = root,TeamSide = 2
trigger1 = root,NumPartner = 1
id = 951
anim = 951
postype = left
pos = cond(root,var(49) = 2, 1133, 1131),cond(root,var(49) = 2, 50, 75)
ownpal = 0
ignorehitpause = 1
removetime = -1

[State 950, NoHPExplod]; Team 2
type = Explod
triggerall = !NumExplod(952)
trigger1 = root,Life <= 0
trigger1 = root,TeamSide = 2
trigger1 = root,NumPartner = 1
id = 952
anim = 952
postype = left
pos = cond(root,var(49) = 2, 1133, 1131),cond(root,var(49) = 2, 50, 75)
ownpal = 0
ignorehitpause = 1
removetime = -1

[State 950, NormalRemoveExplod]
type = RemoveExplod
trigger1 = root,var(49) = 0
trigger2 = root,Life <= 0
id = 950

[State 950, GetHitRemoveExplod]
type = RemoveExplod
trigger1 = root,var(49) = 0
trigger2 = root,Life > root,LifeMax/4
trigger3 = root,Life <= 0
id = 951

[State 950, LowHPRemoveExplod]
type = RemoveExplod
trigger1 = root,var(49) = 0
trigger2 = root,Life > 0
id = 952

;***************************************************************************
;Special Moves
;***************************************************************************
[Statedef 3050]; Chain Explosive *******************************************
type = A
MoveType = A
physics = N
juggle = 8
poweradd = 0
ctrl = 0
anim = 9085
sprpriority = -1

[State 3050, NoShadow]
type = AssertSpecial
trigger1 = 1
flag = NoShadow

[State 3050, PlayerPush]
type = PlayerPush
trigger1 = 1
value = 0
ignorehitpause = 1

[State 3050, HitOverride]
type = HitOverride
trigger1 = Time < 28
time = -1
attr = SCA,HA,HP;SCA,AA,AP,AT
stateno = 3051
ignorehitpause = 1

[State 3050, HitOverride]
type = HitOverride
trigger1 = Time >= 28
time = -1
attr = SCA,HA,HP;SCA,AA,AP,AT
stateno = 3052
ignorehitpause = 1

[State 3050, HitBy]
type = HitBy
trigger1 = 1
value = SCA,HA,HP
time = 1

[State 3001, Explod]
type = Explod
trigger1 = !Time
anim = 9080
id = 9080
pos = 0,0
postype = P1
sprpriority = 3
ownpal = 1
bindtime = 0
removeongethit = 1

[State 3001, Explod]
type = Explod
trigger1 = Time = 28
anim = 9081
id = 9081
pos = 0,0
postype = P1
sprpriority = 3
ownpal = 1
persistent = 1
bindtime = 0
removeongethit = 0
ignorehitpause = 1

[State 3005, HitDef]
type = HitDef
trigger1 = !MoveContact
trigger1 = root,var(47) < 10
attr = C, HP
animtype = DiagUp
hitflag = MAP
guardflag = M
damage = 500, cond(root,var(47) = 0, 375, 0)
pausetime = 0,8
priority = 6
sparkno = -1
guard.sparkno = -1
hitsound = S5, 0
guardsound = S6, 0
ground.type = High
ground.slidetime = 23
ground.hittime = 27
guard.slidetime = 24
guard.hittime = 34
ground.velocity = -10,-35
guard.velocity = -17.5
air.velocity = -10,-35
ground.cornerpush.veloff = 0
air.cornerpush.veloff = 0
guard.cornerpush.veloff = 0
fall = 1
air.fall = 1
fall.recover = 0
noChainID = 3000

[State 3050, ParentVarSet]
type = ParentVarSet
trigger1 = MoveContact;MoveGuarded 
v = 47
value = 1
ignorehitpause = 1

[State 3150, DestroySelf]
type = DestroySelf
trigger1 = AnimTime = 0

[Statedef 3051]
type = A
movetype = H
physics = N

[State 3001, RemoveExplod]
type = RemoveExplod
trigger1 = !Time
id = 9080

[State 3001, Explod]
type = Explod
trigger1 = !Time
anim = 9081
id = 9081
pos = 0,0
postype = P1
sprpriority = 3
ownpal = 1
persistent = 1
bindtime = 0
removeongethit = 0

[State 3151, DestroySelf]
type = DestroySelf
trigger1 = 1

[Statedef 3052]
type = A
movetype = H
physics = N

[State 3001, RemoveExplod]
type = RemoveExplod
trigger1 = 1
id = 9080

[State 3001, Explod]
type = Explod
trigger1 = !Time
anim = 9082
id = 9082
pos = 0,0
postype = P1
sprpriority = 3
ownpal = 1
persistent = 1
bindtime = 0
removeongethit = 0

[State 3151, DestroySelf]
type = DestroySelf
trigger1 = 1

[Statedef 3055]; Chain Explosive Chain *******************************************
type = S
MoveType = A
physics = N
juggle = 8
poweradd = 0
ctrl = 0
anim = 9086
sprpriority = -1

[State 3055, NoShadow]
type = AssertSpecial
trigger1 = 1
flag = NoShadow

[State 3055, BindtoRoot]
type = BindtoRoot
trigger1 = !Time
time = 12
pos = 0,0
facing = 1

[State 3055, HitOverride]
type = HitOverride
trigger1 = 1
time = -1
attr = SCA,HA,HP;SCA,AA,AP,AT
stateno = 3056
ignorehitpause = 1

[State 3055, HitBy]
type = HitBy
trigger1 = 1
value = SCA,HA,HP
time = 1

[State 3055, HitDef]
type = HitDef
trigger1 = !MoveContact
attr = S, HA
animtype = hard
damage = 500,375
hitflag = MAP
guardflag = M
pausetime = 0,8
priority = 6
hitsound = S5,0
sparkno = S905
guard.sparkno = S905
guardsound = S5,1
sparkxy = -60,-240
ground.type = High
ground.slidetime = 23
ground.hittime = 27
guard.slidetime = 24
guard.hittime = 34
ground.velocity = -10,-35
guard.velocity = -17.5
air.velocity = -10,-35
fall = 1
fall.recover = 0
id = 3000

[State 3055, ParentVarSet]
type = ParentVarSet
trigger1 = MoveGuarded 
v = 47
value = 1
persistent = 0
ignorehitpause = 1

[State 3055, ParentVarSet]
type = ParentVarSet
trigger1 = MoveHit
v = 47
value = 10
persistent = 0
ignorehitpause = 1

[State 3055, DestroySelf]
type = DestroySelf
trigger1 = AnimTime = 0

[Statedef 3056]
type = A
movetype = H
physics = N

[State 3055, ParentVarSet]
type = ParentVarSet
trigger1 = !Time
v = 47
value = 0

[State 3056, DestroySelf]
type = DestroySelf
trigger1 = 1

;***************************************************************************
; AI
;***************************************************************************
[Statedef 9999]; AI Helper *************************************************
type = A
movetype = H
physics = N
juggle = 8
velset = 0,0
ctrl = 0
anim = 9999
sprpriority = 9

[State 9999, VarSet]
type = parentVarSet
trigger1 = root,MoveType = I 
v = 1
value = 0

[State 9999, AssertSpecial]
type = AssertSpecial
trigger1 = 1
flag = invisible

[State 9999, DisplayToClipboard]
type = DisplayToClipboard
trigger1 = 1
text = "var(2) = %d var(3) = %d Vel X = %d MoveHit = %d"
params = var(0),var(20),var(21),(root,MoveHit = 1)
ignorehitpause = 1

[State 9999, VarSet]
type = Varset
trigger1 = var(10) >= 0
trigger2 = var(11) >= 0
v = 3
value = 1
ignorehitpause = 1

[State 9999, VarSet]
type = Varset
trigger1 = var(10) >= 0
trigger2 = var(11) >= 0
trigger3 = var(12) >= 0
trigger4 = var(13) >= 0
trigger5 = var(20) >= 0
trigger6 = var(21) >= 0
v = 2
value = 1
ignorehitpause = 1

[State 9999, VarSet]
type = Varset
trigger1 = var(10) = 0
trigger1 = var(11) = 0
trigger1 = var(12) = 0
trigger1 = var(13) = 0
trigger1 = var(20) = 0
trigger1 = var(21) = 0
v = 2
value = 0
ignorehitpause = 1

[State 0, VarSet]
type = Varset
trigger1 = var(10) = 0
trigger1 = var(11) = 0
v = 3
value = 0
ignorehitpause = 1

[State 9999, Explod];enough for light moves
type = Varset
triggerall = var(10) = 0
trigger1 = root,MoveContact = 1 && (root,StateNo = 600 || (root,StateNo = 630 && root,Anim = 630)) && root,Pos Y = [-260,-160]
trigger2 = root,MoveContact = 1 && root,StateNo = 610 && root,Pos Y = [-200,-160]
trigger3 = root,MoveContact = 1 && root,StateNo = 640 && root,Pos Y = [-240,-180]
v = 10
value = 1

[State 9999, VarSet];enough for heavy moves
type = Varset
triggerall = var(10) = 0
triggerall = var(11) = 0
trigger1 = root,MoveHit = 1 && (root,StateNo = 600 || root,StateNo = 630) && root,Pos Y > -160
trigger2 = root,MoveHit = 1 && root,StateNo = 610 && root,Pos Y > -160
trigger3 = root,MoveHit = 1 && root,StateNo = 640 && root,Pos Y > -180
v = 11
value = 1

[State 9999, VarSet]
type = VarSet
trigger1 = Enemy,const(size.head.pos.y) <= -280
v = 14
value = 1
ignorehitpause = 1

[State 9999, VarSet];blocked so inch slowly
type = VarSet
triggerall = var(10) = 0
triggerall = var(11) = 0
triggerall = var(12) = 0
trigger1 = root,MoveGuarded = 1 && root,StateNo = 200
trigger2 = root,MoveGuarded = 1 && root,StateNo = 230 
trigger3 = root,MoveGuarded = 1 && root,StateNo = 400
trigger4 = root,MoveGuarded = 1 && root,StateNo = 430
v = 12
value = 1

[State 9999, VarSet]
type = Varadd
triggerall = Enemy,HitShakeOver
trigger1 = root,MoveGuarded = 1 
v = 1
value = 1
ignorehitpause = 0

[State 9999, VarSet]
type = VarSet
trigger1 = root,MoveHit
v = 1
value = 0

[State 9999, VarSet]
type = VarSet
trigger1 = root,StateType = A && root,MoveType != H
v = 4
value = 1
ignorehitpause = 1

[State 9999, VarSet]
type = VarSet
trigger1 = root,StateType = A && root,MoveType = H
v = 4
value = 2
ignorehitpause = 1

[State 9999, VarSet]
type = VarSet
trigger1 = var(6) = 1
v = 4
value = 0
ignorehitpause = 1

[State 9999, VarSet]
type = Varadd
trigger1 = var(4) = 2
v = 5
value = 1
ignorehitpause = 1

[State 9999, VarSet]
type = VarSet
trigger1 = root,MoveHit
trigger2 = root,var(15)
v = 5
value = 0
ignorehitpause = 1

[State 9999, ParentVarSet]
type = ParentVarSet
trigger1 = !var(5)
v = 15
value = 0

[State 9999, VarSet]
type = VarSet
trigger1 = (root,StateNo = [5000,5200]) && root,PrevStateNo = [120,155]
v = 6
value = P2StateNo
ignorehitpause = 1

[State 9999, VarSet]
type = VarSet
trigger1 = P2StateNo = var(6)
v = 7
value = 1
ignorehitpause = 1

[State 9999, VarSet]
type = VarSet
trigger1 = P2StateNo != var(6)
v = 7
value = 0
ignorehitpause = 1

[State 9999, VarSet]
type = VarSet
trigger1 = root,StateNo = 5120 
v = 8
value = 10

[State 9999, VarSet]
type = Varadd
trigger1 = root,StateNo != 5120 && var(8) > 0
v = 8
value = -1

[State 9999, VarSet]
type = VarSet
trigger1 = var(8) < 0
v = 8
value = 0

[State 9999, VarSet];bait
type = VarSet
triggerall = var(10) = 0
triggerall = var(11) = 0
triggerall = var(13) = 0
triggerall = var(1) > 3
trigger1 = root,MoveGuarded = 1 && root,StateNo = 200
trigger2 = root,MoveGuarded = 1 && root,StateNo = 230 
trigger3 = root,MoveGuarded = 1 && root,StateNo = 400
trigger4 = root,MoveGuarded = 1 && root,StateNo = 430
v = 13
value = 1

[State 9999, VarSet]; 1000 Crescent Beam
type = VarSet
triggerall = !var(20)
triggerall = root,NumProjID(1050) = 0
triggerall = root,MoveType != H
triggerall = P2StateNo != 4999
triggerall = root, P2BodyDist X > 160
;
trigger1 = root,P2BodyDist X - 140 >= var(0)
trigger1 = Enemy, Pos Y >= 0
trigger1 = var(0) > -1
;
trigger2 = P2StateType != L
trigger2 = P2StateNo != 5070
trigger2 = random < 45
trigger2 = root, P2BodyDist Y > -60
trigger2 = root, P2BodyDist X = [160,480]
v=20
value=1
ignorehitpause =1

[State 9999, VarSet]; 1000 Crescent Beam
type = VarSet
triggerall = !var(20)
triggerall = root,NumProjID(1050) = 0
triggerall = root,MoveType != H
triggerall = P2StateNo != 4999
triggerall = root, P2BodyDist X > 480
;
trigger1 = root,P2BodyDist X - 160 >= var(0)
trigger1 = Enemy, Pos Y >= 0
trigger1 = var(0) > -1
;
trigger2 = P2StateType != L
trigger2 = P2StateNo != 5070
trigger2 = random < 45
trigger2 = root, P2BodyDist Y > -60
v = 21
value = 1
ignorehitpause = 1

[State 9999, VarSet]; Walk
type = VarSet
triggerall = root,BackEdgeBodyDist > 80
;
trigger1 = Enemy,MoveType = A
;
trigger2 = P2StateType != L
trigger2 = root,P2BodyDist X < 120
trigger2 = P2StateNo != 4999
;
trigger3 = root,P2BodyDist X < 80
trigger3 = P2StateNo != 4999
;
trigger4 = P2StateType = A
trigger4 = P2MoveType != H
v = 25
value = 0

[State 9999, VarSet]; Walk
type = VarSet
triggerall = random < 249
triggerall = P2StateType != A || P2MoveType = H
;
trigger1 = Enemy,MoveType !=A
;
trigger2 = root,P2BodyDist X > 120
;
trigger3 = P2StateType = L
trigger3 = root,P2BodyDist X > 360
;
trigger4 = var(12) || var(13)
;
trigger5 = root,P2BodyDist X >= 120
trigger5 = P2StateNo = 4999
;
trigger6 = root,BackEdgeBodyDist < 80
trigger6 = P2MoveType = A
;
trigger7 = root,P2BodyDist X < 40
trigger7 = P2StateType = A
trigger7 = root,BackEdgeBodyDist < 60
v = 25
value = 1

[State 9999, VarSet]; Jump
type = parentVarSet
triggerall = P2StateType != L
;
trigger1 = root,StateType = A
;
trigger2 = root,P2BodyDist X = [0,160]
trigger2 = P2StateType != A
;
trigger3 = root,P2BodyDist X = [440,676]
trigger2 = P2StateType != A
;
trigger4 = EnemyNear,HitDefAttr = SA,NA,SA,HA
;
trigger5 = root,PrevStateNo = 52
trigger5 = P2StateType = A
;
trigger6 = root,P2BodyDist X < 180
trigger6 = root,FrontEdgeBodyDist > 200
trigger6 = P2StateType != A
;
trigger7 = P2StateNo = [5090,5119]
;
trigger8 = P2StateNo = [5121,5899]
;
trigger9 = RoundState != 2
;
trigger10 = var(8) > 0 && root,P2BodyDist X < 240
;
trigger11 = var(10) > 0 || var(11) > 0
;
trigger12 = root,var(41) > 0
v = 30
value = 0

[State 9999, VarSet]
type = parentVarSet
triggerall = RoundState != 2
triggerall = root,StateType != A
triggerall = root,var(41) = 0
triggerall = var(8) = 0 || root,P2BodyDist X < 240
;
trigger1 = P2StateType = C
;
trigger2 = Enemy,HitDefAttr = SC,AT
trigger2 = (root,StateNo = 130 || root,StateNo = 120)
;
trigger3 = root,P2BodyDist X > 680
trigger3 = AIlevel < 49
;
trigger4 = root,NumProjID(1050) && P2BodyDist X > 480
;
trigger5 = P2StateNo = 5120
trigger5 = root,P2BodyDist X = [220,480]
trigger5 = root, ctrl
;
trigger6 = P2StateNo = 5120
trigger6 = root,FrontEdgeDist < 240
trigger6 = root,ctrl
;
trigger7 = P2StateNo = 5120
trigger7 = (root,P2BodyDist X < 120 || root,FrontEdgeDist < 240)
trigger7 = root,ctrl
;
trigger8 = BackEdgeBodyDist < 80
trigger8 = ctrl
trigger8 = P2StateType = A
v = 30
value = 1

;---adjust for P2's position
[State 9999, VarAdd]
type = VarAdd
trigger1 = P2StateType = L 
v = 0
value = 1

[State 9999, VarSet]
type = VarSet
trigger1 = P2StateType != L
v = 0
value = -1

[State 9999, VarSet]; Remove Explods************************************
type = VarSet
trigger1 = P2MoveType != H || P2StateNo = 4999
v = 10
value = 0
ignorehitpause = 1

[State 9999, VarSet]
type = VarSet
trigger1 = P2MoveType != H || P2StateNo = 4999
v = 11
value = 0
ignorehitpause = 1

[State 9999, VarSet]
type = VarSet
trigger1 = P2StateNo = 4999 || P2MoveType = H && P2StateNo != [120,155]
v = 12
value = 0
ignorehitpause = 1

[State 9999, VarSet]
type = VarSet
trigger1 = P2StateNo = 4999 || root,MoveHit = 1
v = 13
value = 0
ignorehitpause = 1

;200
[State 9999, VarSet]
type = VarSet
trigger1 = root,NumProjID(1050) > 0 || P2StateNo = 4999 || root,MoveType = H
trigger2 = root,P2BodyDist X < 160
trigger3 = P2StateNo = 5070 && P2StateType = A
v = 20
value = 0
ignorehitpause = 1

;230
[State 9999, VarSet]
type = VarSet
trigger1 = root,NumProjID(1050) > 0 || P2StateNo = 4999 || root,MoveType = H
trigger2 = root,P2BodyDist X < 480
trigger3 = P2StateNo = 5070 && P2StateType = A
v = 21
value = 0
ignorehitpause = 1

[State 9999, DestroySelf]
type = DestroySelf
trigger1 = RoundState != 2
