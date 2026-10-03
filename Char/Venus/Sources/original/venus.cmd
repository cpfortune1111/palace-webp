;-| Button Remapping |-----------------------------------------------------
[Remap]
x = x
y = y
z = z
a = a
b = b
c = c
s = s

;-| Default Values |-------------------------------------------------------
[Defaults]
command.Time = 15
command.buffer.Time = 1

;-| Super Motions |--------------------------------------------------------
[Command]
name = "S_SNES_NRML_ChainExplosive"
command = ~B, D, $F, $D, y
time = 30
buffer.time = 3

[Command]
name = "S_SNES_AUTO_ChainExplosive"
command = ~d, w

[Command]
name = "S_SNES_AUTO_ChainExplosive"
command = ~w, d

;-| Special Motions |------------------------------------------------------

[Command]
name = "SNES_NRML_Beam_l"
command = ~D,$D, F, x
buffer.time = 3

[Command]
name = "SNES_NRML_Beam_h"
command = ~D,$D, F, y
buffer.time = 3

[Command]
name = "SNES_AUTO_Beam_l"
command = ~d,x

[Command]
name = "SNES_AUTO_Beam_h"
command = ~w,x

[Command]
name = "SNES_NRML_Sword_l"
command = ~$D,$U, x
time = 15
buffer.time = 3

[Command]
name = "SNES_NRML_Sword_h"
command = ~$D,$U, y
time = 15
buffer.time = 3

[Command]
name = "SNES_AUTO_Sword_l"
command = ~d,y

[Command]
name = "SNES_AUTO_Sword_h"
command = ~w,y

[Command]
name = "SNES_NRML_Chain_l"
command = ~F, D, DF, x
buffer.time = 3

[Command]
name = "SNES_NRML_Chain_h"
command = ~F, D, DF, y
buffer.time = 3

[Command]
name = "SNES_AUTO_Chain_l"
command = ~d,a

[Command]
name = "SNES_AUTO_Chain_h"
command = ~w,a


;-| Double Tap |-----------------------------------------------------------
[Command]
name = "FF"
command = F, F
time = 10

[Command]
name = "BB"
command = B, B
time = 10

;-| 2/3 Button Combination |-----------------------------------------------
[Command]
name = "recovery"
command = x+y
Time = 1

;-| Dir + Button |---------------------------------------------------------
[Command]
name = "down_a"
command = /$D,a
time = 1

[Command]
name = "down_b"
command = /$D,b
time = 1

;-| Single Button |---------------------------------------------------------
[Command]
name = "a"
command = a
Time = 1
buffer.Time = 3

[Command]
name = "b"
command = b
Time = 1
buffer.Time = 3

[Command]
name = "c"
command = c
Time = 1
buffer.Time = 3

[Command]
name = "x"
command = x
Time = 1
buffer.Time = 3

[Command]
name = "y"
command = y
Time = 1
buffer.Time = 3

[Command]
name = "z"
command = z
Time = 1
buffer.Time = 3

[Command]
name = "start"
command = s
Time = 1

[Command]
name = "d"
command = d
time = 1

[Command]
name = "w"
command = w
time = 1

[Command]
name = "fwd"
command = F
time = 1

[Command]
name = "back"
command = B
time = 1

[Command]
name = "up"
command = U
time = 1

[Command]
name = "down"
command = D
time = 1

;-| Hold Dir |--------------------------------------------------------------
[Command]
name = "holdfwd"
command = /$F
Time = 1

[Command]
name = "holdback"
command = /$B
Time = 1

[Command]
name = "holdup" 
command = /$U
Time = 1

[Command]
name = "holddown"
command = /$D
Time = 1

[Command]
name = "holdd"
command = /$d
time = 1

[Command]
name = "holdw"
command = /$w
time = 1

[Statedef -1]

;***************************************************************************
;AI
;***************************************************************************
[State -1, AI Chain Explosive]
type = ChangeState
value = 3000
triggerall = var(50) = 0;SNES
triggerall = AILevel
triggerall = RoundState = 2
triggerall = Life <= LifeMax/4
;triggerall = random < 149
triggerall = MoveType != H
triggerall = StateType != A
triggerall = P2StateType != L || P2StateNo = 5120
triggerall = P2StateNo != [120,155]
;triggerall = P2StateNo != [800,3999]
triggerall = P2BodyDist Y = [-360,0]
;
trigger1 = ctrl
trigger1 = P2BodyDist X = [120,300]
;
trigger2 = StateNo = 210 || StateNo = 240 || StateNo = 410
trigger2 = MoveHit
;
trigger3 = ctrl
trigger3 = P2StateType = A
trigger3 = P2BodyDist X = [0,240]
;
trigger4 = P2BodyDist X = [0,300]
trigger4 = P2StateNo = 5110
trigger4 = ctrl
;------------------------------------------------------------------------
[State -1, AI Venus Love Me Chain]
type = ChangeState
value = 1200
triggerall = var(50) = 0;SNES
triggerall = AILevel
triggerall = RoundState = 2
triggerall = random < 22*AIlevel
triggerall = MoveType != H
triggerall = StateType != A
triggerall = StateNo != [800,4999]
triggerall = P2StateNo!= [120,159]
triggerall = P2StateType != L
triggerall = P2BodyDist X = [0,300]
triggerall = P2BodyDist Y = [-280,0]
triggerall = var(3) = 0
;
trigger1 = ctrl || StateNo = [10,20]
trigger1 =  P2StateType = A
;
trigger2 = StateNo = 200 || StateNo = 210 || StateNo = 240 || StateNo = 400 || StateNo = 410 || StateNo = 430
trigger2 = MoveHit
trigger2 = P2BodyDist X < 200
;------------------------------------------------------------------
[State -1, AI Venus Wink Chain Sword]
type = ChangeState
value = 1100
triggerall = var(50) = 0;SNES
triggerall = AILevel
triggerall = RoundState = 2
triggerall = random < 35*AIlevel
triggerall = !NumProjID(1050)
triggerall = !NumProjID(1150)
triggerall = MoveType != H
triggerall = StateType != A
triggerall = StateNo != [800,4999]
triggerall = P2StateType != L || p2stateno=5120
triggerall = P2StateNo != [120,159]
triggerall = (P2BodyDist X = [0,240]) || (MoveContact && P2BodyDist X < 200)
triggerall = P2BodyDist Y =[-440,0]
triggerall = var(16) > 40
triggerall = Helper(9999),var(8) = 0
;
trigger1 = ctrl || StateNo = [10,20]
trigger1 = P2StateType = A || P2StateNo = 5120
;
trigger2 = StateNo = 210 || StateNo = 240 || StateNo = 410 || StateNo = 430
trigger2 = MoveContact
;------------------------------------------------------------------
[State -1, AI Crescent Beam]
type = ChangeState
value = 1000
triggerall = var(50) = 0;SNES
triggerall = AILevel
triggerall = RoundState = 2
triggerall = random < AIlevel;17*AIlevel; || MoveContact
triggerall = !NumProjID(1050)
triggerall = !NumProjID(1150)
triggerall = StateType != A
triggerall = MoveType != H
triggerall = StateNo != [800,4999]
triggerall = P2StateType != A
triggerall = P2StateNo != [120,159]
triggerall = Helper(9999),var(8) = 0
;
trigger1 = ctrl || StateNo = [10,20]
trigger1 = Helper(9999),var(20) || Helper(9999),var(21)
;
trigger2 = StateNo = 210 || StateNo = 240 || StateNo = 410 || StateNo = 430
trigger2 = MoveContact
;
trigger3 = StateNo = 440
trigger3 = MoveGuarded
;---------------------------------------------------------------------------
[State -1, AI Guard]
type = ChangeState
value = 120
triggerall = AILevel
triggerall = RoundState = 2
triggerall = random < 113*AIlevel
triggerall = StateType != A
triggerall = MoveType != H
triggerall = StateNo != 105
triggerall = StateNo != [120,159]
triggerall = StateNo != [200,3999]

triggerall = InGuardDist || EnemyNear,HitDefAttr = SCA,NP,SP,HP || EnemyNear,HitDefAttr = SCA,AA
triggerall = ((EnemyNear, MoveType = A && EnemyNear,HitDefAttr!=SCA,AA) || (EnemyNear,HitDefAttr=SCA,NP,SP,HP || EnemyNear,HitDefAttr = SCA,AA)) || Enemy,NumProj
;
trigger1 = ctrl || StateNo = 20
;------------------------------------------------------------------------
[State -1, AI Throw]
type = ChangeState
value = ifelse(random < 499,801,800)
triggerall = StateNo = 999999;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;
triggerall = AILevel
triggerall = RoundState = 2
triggerall = random < 30*AIlevel
triggerall = StateType != A
triggerall = ctrl || StateNo = 20
triggerall = StateNo != [200,9999]
triggerall = P2StateType != A
triggerall = P2MoveType != H
;
trigger1 = P2BodyDist X < 108
trigger1 = P2BodyDist Y = [-40,40]
;
trigger2 = P2StateNo =[120,150]
trigger2 = P2BodyDist X < 108
;-----------------------------------------------------
[State -1, AI Dash Back]
type = ChangeState
value = 105
triggerall = AILevel
triggerall = RoundState = 2
triggerall = random < 22*AIlevel
triggerall = StateType != A
triggerall = StateNo != 105
;
trigger1 = P2StateType = L || P2MoveType = A
trigger1 = BackEdgeDist > 160
trigger1 = P2BodyDist X = [-396,180]
trigger1 = ctrl 
;
trigger2 = StateNo = [200,430]
trigger2 = MoveGuarded
trigger2 = BackEdgeDist > 240
;
trigger3 = StateNo = 151 || StateNo = 153
;---------------------------------------------------------------------------
[State -1, AI Stand Light Punch]
type = ChangeState
value = 200
triggerall = AILevel
triggerall = RoundState = 2
triggerall = random < 63*AIlevel
triggerall = StateType != A
triggerall = StateNo != [800,3999]
triggerall = P2StateType != C
triggerall = P2StateType != L
triggerall = P2BodyDist X = [0,140]
triggerall = P2BodyDist Y = 0
triggerall = var(3) = 0
triggerall = Helper(9999),var(8) = 0
triggerall = Helper(9999),var(14) = 1 
;
trigger1 = ctrl || StateNo =[10,20]
trigger1 = Helper(9999),var(10) > 0 || Helper(9999),var(11) > 0
trigger1 = P2BodyDist X < 120
;
trigger2 = StateNo = 200 || StateNo = 230
trigger2 = MoveType = I
;---------------------------------------------------------------------------
[State -1, AI Stand strong Punch]
type = ChangeState
value = 210
triggerall = AILevel
triggerall = RoundState = 2
triggerall = random < 70*AIlevel
triggerall = StateType != A
triggerall = StateNo != [800,3999]
triggerall = P2StateType != C
triggerall = P2StateType != L
triggerall = P2BodyDist X = [0,400]
triggerall = P2BodyDist Y = [0,-140]
triggerall = Enemy,Vel Y >= 0
triggerall = var(3) = 0
triggerall = Helper(9999),var(8) = 0
triggerall = Helper(9999),var(14) = 1 
;
trigger1 = ctrl || StateNo =[10,20]
trigger1 = Helper(9999),var(11) > 0
;
trigger2 = random < 199
trigger2 = ctrl || StateNo = [10,20]
trigger2 = P2BodyDist X = [260,400]
trigger2 = P2StateType = S
trigger2 = P2MoveType = I
;
trigger3 = StateNo = 200 || StateNo = 230
trigger3 = MoveType = I
;---------------------------------------------------------------------------
[State -1, AI Stand Light Kick]
type = ChangeState
value = 230
triggerall = AILevel
triggerall = RoundState = 2
triggerall = random < 45*AIlevel
triggerall = StateType != A
triggerall = (StateNo != [800,3999]) || var(5) = 1
triggerall = P2StateType != C
triggerall = P2StateType != L
triggerall = P2BodyDist X = [0,100]
triggerall = P2BodyDist Y = 0
triggerall = var(3) = 0
triggerall = Helper(9999),var(8) = 0
;
trigger1 = ctrl || StateNo =[10,20]
trigger1 = Helper(9999),var(10) > 0
;
trigger2 = StateNo = 200 || StateNo = 230
trigger2 = MoveType = I
;---------------------------------------------------------------------------
[State -1, AI Stand Strong Kick]
type = ChangeState
value = 240
triggerall = AILevel
triggerall = RoundState = 2
triggerall = random < 40*AIlevel
triggerall = StateType != A
triggerall = StateNo != [800,3999]
triggerall = P2StateType != C
triggerall = P2StateType != L
triggerall = P2BodyDist X = [0,260]
triggerall = P2BodyDist Y = [0,-200]
triggerall = Enemy,Vel Y >= 0
triggerall = var(3) = 0
triggerall = var(4) = 0
triggerall = Helper(9999),var(8) = 0 || (P2StateType = A && P2BodyDist X > 140)
triggerall = Helper(9999),var(14) = 1 
;
trigger1 = random < 199
trigger1 = ctrl || StateNo =[10,20]
trigger1 = P2StateType = A
trigger1 = P2BodyDist X = [220,280]
trigger1 = Helper(9999),var(10) > 0
;
trigger2 = StateNo = 200 || StateNo = 230
trigger2 = MoveType = I
;---------------------------------------------------------------------------
[State -1, AI Crouch Light Punch]
Type = ChangeState
value = 400
triggerall = AILevel
triggerall = RoundState = 2
triggerall = random < 70*AILevel
triggerall = StateType != A
triggerall = MoveType != H
triggerall = (StateNo != [800,3999]) || var(5) = 1
triggerall = P2StateType != L
triggerall = P2BodyDist X = [0,160]
triggerall = P2BodyDist Y = 0
triggerall = var(3) = 0
triggerall = Helper(9999),var(8) = 0
;
trigger1 = ctrl || StateNo =[10,20]
trigger1 = Helper(9999),var(10) > 0 || Helper(9999),var(11) > 0
trigger1 = P2BodyDist X < 120
;
trigger2 = StateNo = 400 || StateNo = 430
trigger2 = MoveType = I
;---------------------------------------------------------------------------
[State -1, AI Crouch Strong Punch]
Type = ChangeState
value = 410
triggerall = AILevel
triggerall = RoundState = 2
triggerall = random < 70*AILevel
triggerall = StateType != A
triggerall = MoveType != H
triggerall = StateNo != [800,3999]
triggerall = P2StateType != A
triggerall = P2StateType != L
triggerall = P2BodyDist X = [132,400]
triggerall = P2BodyDist Y = 0
triggerall = var(3) = 0
triggerall = Helper(9999),var(8) = 0
;
trigger1 = ctrl || StateNo = [10,20]
trigger1 = Helper(9999),var(11) > 0
;
trigger2 = random < 199
trigger2 = ctrl || StateNo = [10,20]
trigger2 = P2StateType = S
trigger2 = P2BodyDist X >= 260
trigger2 = Helper(9999),var(11) > 0
;
trigger3 = StateNo = 400 || StateNo = 430
trigger3 = MoveType = I
;---------------------------------------------------------------------------
[State -1, AI Crouch Light Kick]
Type = ChangeState
value = 430
triggerall = AILevel
triggerall = RoundState = 2
triggerall = random < 70*AILevel
triggerall = StateType != A
triggerall = MoveType != H || P2StateType = S
triggerall = StateNo != [800,3999]
triggerall = P2StateType != L
triggerall = P2StateType != A
triggerall = P2BodyDist X = [0,220]
triggerall = var(3) = 0
triggerall = Helper(9999),var(8) = 0
;
trigger1 = ctrl || StateNo = [10,20]
trigger1 = Helper(9999),var(10) > 0 || Helper(9999),var(11) > 0
trigger1 = P2BodyDist X < 180
;
trigger2 = P2StateType = S
trigger2 = ctrl
;
trigger3 = StateNo = 400 || StateNo = 430
trigger3 = MoveType = I
;
trigger4 = P2MoveType = H
trigger4 = ctrl
;
trigger5 = var(4) = 1
trigger5 = ctrl
;---------------------------------------------------------------------------
[State -1, AI Crouch Strong Kick]
Type = ChangeState
value = 440
triggerall = AILevel
triggerall = RoundState = 2
triggerall = random < 53*AILevel
triggerall = StateType != A
triggerall = MoveType != H
triggerall = StateNo != [800,3999]
triggerall = P2StateType != A
triggerall = P2StateType != L
triggerall = P2BodyDist X = [0,260]
triggerall = var(3) = 0
triggerall = Helper(9999),var(8) = 0 || (P2StateType = S && P2BodyDist X > 120)
;
trigger1 = random < 199
trigger1 = ctrl || StateNo = [10,20]
trigger1 = P2BodyDist X >= 180
trigger1 = P2StateType = S
trigger1 = P2MoveType = I
;
trigger2 = ctrl
trigger2 = P2StateType = S
trigger2 = Helper(9999),var(10) = 0 
trigger2 = Helper(9999),var(11) = 0 
;
trigger3 = StateNo = 400 || StateNo = 430
trigger3 = MoveType = I
;---------------------------------------------------------------------------
[State -1, AI Jump Light Punch]
type = ChangeState
value = 600
triggerall = AILevel
triggerall = RoundState = 2
triggerall = random <= 50*AILevel
triggerall = StateType = A
triggerall = Movetype != H
triggerall = StateNo!= [100,105]
triggerall = Vel Y <= 0 || P2StateType = A
triggerall = P2BodyDist X = [-40,200]
triggerall = P2BodyDist Y = [-80,200]
;
trigger1 = ctrl
;---------------------------------------------------------------------------
[State -1, AI Jump Strong Punch]
type = ChangeState
value = 610
triggerall = AILevel
triggerall = RoundState = 2
triggerall = random <= 35*AILevel
triggerall = StateType = A
triggerall = Movetype != H
triggerall = StateNo!= [100,105]
triggerall = Vel Y >= 0
triggerall = P2BodyDist X = [-40,200]
triggerall = P2BodyDist Y = [-80,320]
;
trigger1 = ctrl
;---------------------------------------------------------------------------
[State -1, AI Jump Light Kick]
type = ChangeState
value = 630
triggerall = AILevel
triggerall = RoundState = 2
triggerall = random <= 70*AILevel
triggerall = StateType = A
triggerall = Movetype != H
triggerall = StateNo!= [100,105]
triggerall = Vel Y >= 0
triggerall = P2BodyDist X = [-80,280]
triggerall = P2BodyDist y = [-80,240]
;
trigger1 = ctrl
;---------------------------------------------------------------------------
[State -1, AI Jump medium Kick]
type = ChangeState
value = 640
triggerall = AILevel
triggerall = RoundState = 2
triggerall = random <= 70*AILevel
triggerall = StateType = A
triggerall = Movetype != H
triggerall = StateNo!= [100,105]
triggerall = Vel Y >= 0
triggerall = P2BodyDist X = [-56,360]
triggerall = P2BodyDist Y = [-80,320]
;
trigger1 = ctrl
;---------------------------------------------------------------------------
[state -1, AI Jump]
type = changestate
value = 40
triggerall = AILevel
triggerall = StateType != A
triggerall = P2StateType != L || P2StateNo = 5120
triggerall = P2StateNo != [5090,5119]
triggerall = P2StateNo != [5121,5899]
triggerall = var(30) = 1
;
trigger1 = ctrl || StateNo = [10,20]
trigger1 = var(30) = 1
;----------------------------------------------------------
[State -1, AI Run]
type = ChangeState
value = 100
triggerall = AILevel
triggerall = StateType = S
triggerall = RoundState = 2
triggerall = StateNo != 100
triggerall = cond(EnemyNear(0),NumProj,0,1)
triggerall = ctrl || StateNo = 20
;
trigger1 = (EnemyNear(0),MoveType != A) && !InGuardDist
trigger1 = P2BodyDist x >= 160
trigger1 = random <= AILevel
;---------------------------------------------------------------------------
[State -1, AI Walk]
type = changestate
value = 20
triggerall = AILevel
triggerall = RoundState = 2
triggerall = random < 30*AILevel
triggerall = StateType != A
triggerall = StateNo != [20,105]
triggerall = P2Movetype != A
triggerall = P2BodyDist X >= 80
;
trigger1 = ctrl
;***************************************************************************
;No AI
;***************************************************************************
;---------------------------------------------------------------------------
[State -1, Chain Explosive]
type = ChangeState
value = 3000
triggerall = var(50) = 0;SNES
triggerall = ((var(52) = 10) && ((command = "S_SNES_AUTO_ChainExplosive") || (command = "holdd" && command = "w")  || (command = "holdw" && command = "d"))) || ((var(52) = 0) && (command = "S_SNES_NRML_ChainExplosive"))
triggerall = !AILevel
triggerall = Life <= LifeMax*.25
triggerall = StateType != A
;
trigger1 = ctrl
;
trigger2 = StateNo = [200,430]
trigger2 = MoveContact
;
trigger3 = StateNo = 440
trigger3 = P2StateNo = 5070
trigger3 = MoveContact || MoveGuarded
;---------------------------------------------------------------------------
[State -1, Venus Love Me Chain]
type = ChangeState
value = 1200
triggerall = var(50) = 0;SNES
triggerall = ((var(52) = 10) && (command = "SNES_AUTO_Chain_l" || command = "SNES_AUTO_Chain_h" || (command = "holdd" && command = "a")  || (command = "holdw" && command = "a"))) || ((var(52) = 0) && (command = "SNES_NRML_Chain_l" || command = "SNES_NRML_Chain_h"))
triggerall = !AILevel
triggerall = StateType!= A
;
trigger1 = ctrl
;
trigger2 = StateNo = [200,430]
trigger2 = MoveContact
;
trigger3 = StateNo = 440
trigger3 = P2StateNo = 5070
trigger3 = MoveContact || MoveGuarded
;---------------------------------------------------------------------------
[State -1, Venus Wink Chain Sword]
type = ChangeState
value = 1100
triggerall = var(50) = 0;SNES
triggerall = ((var(52) = 10) && (command = "SNES_AUTO_Sword_l" || command = "SNES_AUTO_Sword_h" || (command = "holdd" && command = "y")  || (command = "holdw" && command = "y"))) || ((var(52) = 0) && (var(16) > 40) && (command = "SNES_NRML_Sword_l" || command = "SNES_NRML_Sword_h"))
triggerall = !AILevel
triggerall = !NumProjID(1050)
triggerall = !NumProjID(1150)
triggerall = StateType != A
;
trigger1 = ctrl || StateNo = 40 || StateNo = 52
;
trigger2 = StateNo = [200,430]
trigger2 = MoveContact
;
trigger3 = StateNo = 440
trigger3 = P2StateNo = 5070
trigger3 = MoveContact || MoveGuarded
;---------------------------------------------------------------------------
[State -1, Crescent Beam]
type = ChangeState
value = 1000
triggerall = var(50) = 0;SNES
triggerall = ((var(52) = 10) && (command = "SNES_AUTO_Beam_l" || command = "SNES_AUTO_Beam_h" || (command = "holdd" && command = "x")  || (command = "holdw" && command = "x"))) || ((var(52) = 0) && (command = "SNES_NRML_Beam_l" || command = "SNES_NRML_Beam_h"))
triggerall = !AILevel
triggerall = !NumProjID(1050)
triggerall = !NumProjID(1150)
triggerall = StateType != A
;
trigger1 = ctrl
;
trigger2 = StateNo = [200,430]
trigger2 = MoveContact
;
trigger3 = StateNo = 440
trigger3 = P2StateNo = 5070
trigger3 = MoveContact || MoveGuarded
;---------------------------------------------------------------------------
[State -1, Run]
type = ChangeState
value = 100
triggerall = !AILevel
triggerall = command = "FF"
trigger1 = StateType != A
trigger1 = ctrl
;---------------------------------------------------------------------------
[State -1, Dash Back]
type = ChangeState
value = 105
triggerall = !AILevel
triggerall = command = "BB"
triggerall = StateType != A
;
trigger1 = ctrl
;
trigger2 = StateNo = [200,430]
trigger2 = MoveContact
;
trigger3 = StateNo = 440
trigger3 = P2StateNo = 5070
trigger3 = MoveContact || MoveGuarded
;
trigger4 = StateNo = 151 || StateNo = 153
;---------------------------------------------------------------------------
[State -1, Throw]
type = ChangeState
value = 801
triggerall = StateNo = 999;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;
triggerall = !AILevel
triggerall = command = "b"
triggerall = command = "holdfwd" || command = "holdback"
triggerall = command !="holddown"
triggerall = StateType != A
triggerall = StateNo != 100
triggerall = ctrl
;
trigger1 = P2BodyDist X < 100
trigger1 = P2BodyDist Y = [-100,100]
trigger1 = P2StateType != A
trigger1 = P2MoveType != H
;---------------------------------------------------------------------------
[State -1, Throw]
type = ChangeState
value = 800
triggerall = StateNo = 999;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;
triggerall = !AILevel
triggerall = command = "y"
triggerall = command = "holdfwd" || command = "holdback"
triggerall = command !="holddown"
triggerall = StateType != A
triggerall = StateNo != 100
triggerall = ctrl
;
trigger1 = P2BodyDist X < 100
trigger1 = P2StateType = S || P2StateType = C
trigger1 = P2MoveType != H
;---------------------------------------------------------------------------
[State -1, Stand Light Punch]
type = ChangeState
value = 200
triggerall = !AILevel
triggerall = command = "x"
triggerall = command != "holddown"
triggerall = StateType != A
;
trigger1 = ctrl
;
trigger2 = StateNo = 200 || StateNo = 230
trigger2 = MoveType = I
;---------------------------------------------------------------------------
[State -1, Stand Strong Punch]
type = ChangeState
value = 210
triggerall = !AILevel
triggerall = command = "y"
triggerall = command != "holddown"
triggerall = StateType != A
;
trigger1 = ctrl
;
trigger2 = StateNo = 200 || StateNo = 230
trigger2 = MoveType = I
;---------------------------------------------------------------------------
[State -1, Stand Light Kick]
type = ChangeState
value = 230
triggerall = !AILevel
triggerall = command = "a"
triggerall = command != "holddown"
triggerall = StateType != A
;
trigger1 = ctrl
;
trigger2 = StateNo = 200 || StateNo = 230
trigger2 = MoveType = I
;---------------------------------------------------------------------------
[State -1, Standing Strong Kick]
type = ChangeState
value = 240
triggerall = !AILevel
triggerall = command = "b"
triggerall = command != "holddown"
triggerall = StateType != A
;
trigger1 = ctrl
;
trigger2 = StateNo = 200 || StateNo = 230
trigger2 = MoveType = I
;---------------------------------------------------------------------------
[State -1, Crouching Light Punch]
type = ChangeState
value = 400
triggerall = !AILevel
triggerall = command = "x"
triggerall = command = "holddown"
triggerall = StateType != A
;
trigger1 = ctrl
;
trigger2 = StateNo = 400 || StateNo = 430
trigger2 = MoveType = I
;---------------------------------------------------------------------------
[State -1, Crouching Strong Punch]
type = ChangeState
value = 410
triggerall = !AILevel
triggerall = command = "y"
triggerall = command = "holddown"
triggerall = StateType != A
;
trigger1 = ctrl
;
trigger2 = StateNo = 400 || StateNo = 430
trigger2 = MoveType = I
;---------------------------------------------------------------------------
[State -1, Crouching Light Kick]
type = ChangeState
value = 430
triggerall = !AILevel
triggerall = command = "a"
triggerall = command = "holddown"
triggerall = StateType != A
;
trigger1 = ctrl
;
trigger2 = StateNo = 400 || StateNo = 430
trigger2 = MoveType = I
;---------------------------------------------------------------------------
[State -1, Crouching Strong Kick]
type = ChangeState
value = 440
triggerall = !AILevel
triggerall = command = "b"
triggerall = command = "holddown"
triggerall = StateType != A
;
trigger1 = ctrl
;
trigger2 = StateNo = 400 || StateNo = 430
trigger2 = MoveType = I
;---------------------------------------------------------------------------
[State -1, Jump Light Punch]
type = ChangeState
value = 600
triggerall = !AILevel
triggerall = command = "x"
triggerall = StateType = A
;
trigger1 = ctrl
;---------------------------------------------------------------------------
[State -1, Jump Strong Punch]
type = ChangeState
value = 610
triggerall = !AILevel
triggerall = command = "y"
triggerall = StateType = A
;
trigger1 = ctrl
;---------------------------------------------------------------------------
[State -1, Jump Light Kick]
type = ChangeState
value = 630
triggerall = !AILevel
triggerall = command = "a"
triggerall = StateType = A
;
trigger1 = ctrl
;---------------------------------------------------------------------------
[State -1, Jump Strong Kick]
type = ChangeState
value = 640
triggerall = !AILevel
triggerall = command = "b"
triggerall = StateType = A
;
trigger1 = ctrl
