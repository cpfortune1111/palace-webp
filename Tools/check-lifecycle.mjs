import assert from 'node:assert/strict';
import fs from 'node:fs';
const local=fs.existsSync('work/Char/Venus/venus-lifecycle-runtime.js');
const {createLifecycleRuntime}=await import(local?'./venus-lifecycle-runtime.js':'../venus-lifecycle-runtime.js');

const data=JSON.parse(fs.readFileSync(local?'work/Char/Venus/venus_battle200.json':'venus_battle200.json','utf8'));
assert.equal(data.globalControllers['-2'].length,44);
assert.equal(data.globalControllers['-3'].length,20);
assert.equal(data.lifecycleHelpers['9999'].controllers.length,41);
assert.equal(data.lifecycleStates['1990'].anim,'(PrevStateNo * 10)');
const executed=[];
const fighter={player:1,id:101,state:5900,vars:Array(60).fill(7),fvars:Array(40).fill(9),facing:1,y:0};
const opponent={player:2,id:102,state:0,moveType:'I',y:-50};
const runtime=createLifecycleRuntime({data:()=>data,root:()=>fighter,
 eval:(expression,context)=>/^\d+$/.test(String(expression))?Number(expression):context.query(expression),
 trigger:(controller,context)=>(controller.triggerall||[]).every(expression=>context.test(expression))&&Object.values(controller.triggers).some(group=>group.every(expression=>context.test(expression))),
 controller:(controller,entity)=>{executed.push(controller);if(controller.type==='ChangeState')entity.state=Number(controller.params.value)}
});
const context={query:name=>runtime.queries(fighter,opponent).query(name),test:expression=>expression==='1'||expression==='RoundsExisted = 0'&&runtime.rounds.existed===0||expression==='RoundNo = 1'&&runtime.rounds.number===1};
runtime.initialize(fighter,context);
assert.equal(fighter.state,190);
assert.deepEqual(fighter.vars.slice(0,49),Array(49).fill(0));
assert.deepEqual(fighter.vars.slice(49),Array(11).fill(7));
assert.deepEqual(fighter.fvars,Array(40).fill(0));
fighter.state=5900;fighter.vars.fill(3);fighter.fvars.fill(4);runtime.rounds.existed=1;runtime.rounds.number=2;
runtime.initialize(fighter,context);
assert.equal(fighter.state,0);
assert.deepEqual(fighter.vars,Array(60).fill(3));
assert.deepEqual(fighter.fvars,Array(40).fill(4));
const helpers=[{kind:'helper',player:1,id:9999,instanceId:201},{kind:'helper',player:2,id:9999,instanceId:202},{kind:'helper',player:1,id:915,instanceId:203,destroyed:true},{kind:'projectile',player:1,id:1050,instanceId:204}];
const queries=runtime.queries(fighter,opponent,helpers);
assert.equal(queries.query('NumPartner'),0);
assert.equal(queries.query('NumEnemy'),1);
assert.equal(queries.query('TeamMode'),'Single');
assert.equal(queries.query('P2MoveType'),'I');
assert.equal(queries.query('P2Dist Y'),-50);
assert.equal(queries.numHelper(9999),1);
assert.equal(queries.numHelper(915),0);
assert.equal(queries.redirect('Partner'),null);
assert.equal(queries.redirect('Enemy'),opponent);
assert.equal(queries.redirect('Root'),fighter);
assert.equal(queries.playerIDExist(102),true);
assert.equal(queries.playerIDExist(999),false);
assert.equal(queries.playerIDExist(9999),false);
assert.equal(queries.playerIDExist(201),true);
assert.equal(queries.playerIDExist(203),false);
assert.equal(queries.playerIDExist(204),false);
assert.throws(()=>runtime.initialize(fighter,context));
assert.throws(()=>queries.query('Unsupported'));
executed.length=0;
const schedule=createLifecycleRuntime({data:()=>data,eval:Number,trigger:()=>true,controller:controller=>executed.push(controller)});
schedule.globals({...fighter,power:10},context,{hitPause:true});
assert.ok(executed.length>0);
assert.ok(executed.every(controller=>Number(controller.params.ignorehitpause)===1));
assert.ok(executed.every(controller=>!['Varset','Varadd','parentVarSet'].includes(controller.type)));
assert.equal(schedule.rounds.state,2);
console.log('Lifecycle source import, 5900 first/later initialization, 1v1 queries, hitpause scheduling: PASS');
