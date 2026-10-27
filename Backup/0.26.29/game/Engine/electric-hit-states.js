const controller=(type,params,triggers)=>({type,params,triggers:{1:triggers},triggerall:[]});
export const electricHitStates={
 '5800':{type:'A',moveType:'H',physics:'N',velset:[0,0],controllers:[
  controller('ChangeAnim',{value:'5800'},['Time = 0']),
  controller('ChangeAnim',{value:'anim'},['Time > 0']),
  controller('ChangeState',{value:'5810'},['HitShakeOver'])
 ]},
 '5810':{type:'A',moveType:'H',physics:'N',ctrl:0,controllers:[
  controller('VelAdd',{y:'GetHitVar(yaccel)'},['1']),
  controller('HitVelSet',{x:'1',y:'1'},['Time = 0']),
  controller('ChangeState',{value:'5820'},['AnimTime = 0'])
 ]},
 '5820':{type:'A',moveType:'H',physics:'N',controllers:[
  controller('VelAdd',{y:'GetHitVar(yaccel)'},['1']),
  controller('SelfState',{value:'5100'},['Vel Y > 0','Pos Y >= Const(movement.air.gethit.groundlevel)'])
 ]}
};
