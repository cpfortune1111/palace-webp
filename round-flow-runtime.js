export function createRoundFlow(api){
 const config=api.config,rounds=api.rounds;
 let mode='training',phase='training',age=0,winner=0,reason='',wins=[0,0],draws=0,matchWinner=0,fadeDuration=30,slowRemaining=0;
 function triggerKoSlow(){slowRemaining=config.slowTime??60}
 function speed(){const base=config.slowSpeed??.25,fade=config.slowFade??45;return slowRemaining<=0?1:slowRemaining<fade?base+(1-base)*(fade-slowRemaining)/fade:base}
 function begin(next,timer){mode=next;api.setTimer(timer);wins=[0,0];draws=0;matchWinner=0;Object.assign(rounds,{number:1,existed:0,match:1});startRound()}
 function startRound(duration=30){winner=0;reason='';age=0;slowRemaining=0;fadeDuration=duration;rounds.state=0;phase='startFade';api.reset();api.initialize();api.message('');api.lock();api.fade(1)}
 function finish(kind){if(phase!=='fight')return;const life=api.life();reason=kind;winner=life[0]===life[1]?0:life[0]>life[1]?1:2;if(winner)wins[winner-1]++;else draws++;if(kind==='ko')triggerKoSlow();rounds.state=3;phase='result';age=0;api.stopCombat();api.message(kind==='ko'?(winner?'K.O.':'Double K.O.'):'Time Over');api.sound(kind==='ko'?(winner?'2,0':'2,1'):'2,2')}
 function step(){
  age++;
  slowRemaining=Math.max(0,slowRemaining-1);
  if(phase==='training'||phase==='match')return;
  if(phase==='startFade'){api.fade(Math.max(0,1-age/fadeDuration));if(age>=fadeDuration){age=0;if(mode==='training'){phase='training';rounds.state=2;api.fight()}else{phase='intro';rounds.state=1}}return}
  if(phase==='betweenFade'){api.fade(Math.min(1,age/30));if(age>=30){rounds.existed++;rounds.number++;startRound(30)}return}
  if(phase==='endFade'){api.fade(Math.min(1,age/30));if(age>=30){phase='match';api.message(matchWinner?'P'+matchWinner+' Wins the Match':'Draw Match');api.matchEnd()}return}
  if(phase==='intro'){api.stepPresentation();if(api.introComplete()&&api.voiceReady()){phase='introBuffer';age=0}return}
  if(phase==='introBuffer'){api.stepPresentation();if(age>=config.startWait){phase='ready';age=0;api.message('Round '+rounds.number);api.sound('0,'+Math.min(3,rounds.number))}return}
  if(phase==='ready'){api.stepPresentation();if(age>=config.startWait&&api.announcerReady()){rounds.state=2;phase='fightBuffer';age=0;api.message('FIGHT');api.sound('1,0')}return}
  if(phase==='fightBuffer'){api.stepPresentation();if(age>=config.controlWait&&api.announcerReady()){rounds.state=2;phase='fight';age=0;api.fight();api.message('')}return}
  if(phase==='fight'){const life=api.life();if(life.some(value=>value<=0))finish('ko');else if(api.remaining()===0)finish('time');return}
  if(phase==='result'){api.stepResult();if(age>=config.overWait&&api.settled()&&api.announcerReady()){phase='resultBuffer';age=0}return}
  if(phase==='resultBuffer'){api.stepResult();if(age>=45){phase='pose';age=0;rounds.state=4;api.pose(winner,reason)}return}
  if(phase==='pose'){api.stepPresentation();if(age===config.winTime)api.message(winner?'P'+winner+' Wins':'Draw');if(age>=config.overTime&&api.voiceReady()){age=0;if(wins.some(value=>value>=config.matchWins)||draws>config.maxDraws){matchWinner=wins[0]===wins[1]?0:wins[0]>wins[1]?1:2;phase='endFade'}else phase='betweenFade'}}
 }
 return {begin,step,finish,speed,triggerKoSlow,canFight:()=>phase==='fight'||phase==='training',enabled:()=>mode!=='training'||phase==='startFade',result:player=>({win:winner===player,lose:winner!==0&&winner!==player,draw:winner===0&&['result','pose','match'].includes(phase)}),snapshot:()=>({mode,phase,age,winner,reason,wins:[...wins],draws,matchWinner,slowRemaining,round:{...rounds}})};
}
