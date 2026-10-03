export function createRoundFlow(api){
 const config=api.config,rounds=api.rounds;
 let mode='training',phase='training',age=0,winner=0,reason='',wins=[0,0],draws=0,matchWinner=0;
 function begin(next,timer){mode=next;api.setTimer(timer);wins=[0,0];draws=0;matchWinner=0;Object.assign(rounds,{number:1,existed:0,match:1});startRound()}
 function startRound(){winner=0;reason='';age=0;rounds.state=0;phase=mode==='training'?'training':'intro';api.reset();api.initialize();if(mode==='training'){rounds.state=2;api.fight();api.message('')}else{rounds.state=1;api.message('');api.lock()}}
 function finish(kind){if(phase!=='fight')return;const life=api.life();reason=kind;winner=life[0]===life[1]?0:life[0]>life[1]?1:2;if(winner)wins[winner-1]++;else draws++;rounds.state=3;phase='result';age=0;api.stopCombat();api.message(kind==='ko'?(winner?'K.O.':'Double K.O.'):'Time Over');api.sound(kind==='ko'?(winner?'2,0':'2,1'):'2,2')}
 function step(){
  age++;
  if(phase==='training'||phase==='match')return;
  if(phase==='intro'){api.stepPresentation();if(api.introComplete()&&api.voiceReady()){phase='introBuffer';age=0}return}
  if(phase==='introBuffer'){api.stepPresentation();if(age>=config.startWait){phase='ready';age=0;api.message('Round '+rounds.number);api.sound('0,'+Math.min(3,rounds.number))}return}
  if(phase==='ready'){api.stepPresentation();if(age>=config.startWait&&api.announcerReady()){rounds.state=2;phase='fightBuffer';age=0;api.message('FIGHT');api.sound('1,0')}return}
  if(phase==='fightBuffer'){api.stepPresentation();if(age>=config.controlWait&&api.announcerReady()){rounds.state=2;phase='fight';age=0;api.fight();api.message('')}return}
  if(phase==='fight'){const life=api.life();if(life.some(value=>value<=0))finish('ko');else if(api.remaining()===0)finish('time');return}
  if(phase==='result'){api.stepResult();if(age>=config.overWait&&api.settled()&&api.announcerReady()){phase='resultBuffer';age=0}return}
  if(phase==='resultBuffer'){api.stepResult();if(age>=45){phase='pose';age=0;rounds.state=4;api.pose(winner,reason)}return}
  if(phase==='pose'){api.stepPresentation();if(age===config.winTime)api.message(winner?'P'+winner+' Wins':'Draw');if(age>=config.overTime&&api.voiceReady()){if(wins.some(value=>value>=config.matchWins)||draws>config.maxDraws){matchWinner=wins[0]===wins[1]?0:wins[0]>wins[1]?1:2;phase='match';api.message(matchWinner?'P'+matchWinner+' Wins the Match':'Draw Match');api.matchEnd()}else{rounds.existed++;rounds.number++;startRound()}}}
 }
 return {begin,step,finish,canFight:()=>phase==='fight'||phase==='training',enabled:()=>mode!=='training',result:player=>({win:winner===player,lose:winner!==0&&winner!==player,draw:winner===0&&['result','pose','match'].includes(phase)}),snapshot:()=>({mode,phase,age,winner,reason,wins:[...wins],draws,matchWinner,round:{...rounds}})};
}
