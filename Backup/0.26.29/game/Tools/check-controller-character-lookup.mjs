import assert from 'node:assert/strict';
import {lookupControllerCharacter} from '../Engine/controller-character-lookup.js';
import {applyStatusController} from '../Engine/status-controllers.js';
import {createLifecycleRuntime} from '../Char/Venus/venus-lifecycle-runtime.js';

const root={id:1},helper={kind:'helper',instanceId:1001},projectile={kind:'projectile',instanceId:1002};
const disabledHelper={kind:'helper',instanceId:1003,disabled:true};
const destroyedHelper={kind:'helper',instanceId:1004,destroyed:true};
const actors=new Map([[1,root],[1001,helper],[1002,projectile],[1003,disabledHelper],[1004,destroyedHelper]]);
const reads=[];
const lookup=id=>{reads.push(id);return actors.get(id)};
assert.equal(lookupControllerCharacter(-1,lookup),null);
assert.deepEqual(reads,[]);
assert.equal(lookupControllerCharacter(1,lookup),root);
assert.equal(lookupControllerCharacter(1001,lookup),helper);
for(const id of [1002,1003,1004,9999])assert.equal(lookupControllerCharacter(id,lookup),null);
assert.deepEqual(reads,[1,1001,1002,1003,1004,9999]);
assert.equal(lookupControllerCharacter(1,lookup,actor=>actor===root),null);
assert.equal(lookupControllerCharacter(1001,lookup,actor=>actor===root),helper);
for(const id of [1,1001,1002,1003,1004,9999]){
 const evaluations=[];
 applyStatusController({type:'DizzySet',params:{redirectid:'id',value:'rhs'}},root,{
  evaluate:expression=>{evaluations.push(expression);return expression==='id'?id:1},
  findActor:targetId=>lookupControllerCharacter(targetId,lookup),
  setFlag:(actor,field,value)=>{actor[field]=value}
 });
 assert.deepEqual(evaluations,id===1||id===1001?['id','rhs']:['id']);
}
assert.equal(root.dizzy,true);
assert.equal(helper.dizzy,true);
assert.equal(projectile.dizzy,undefined);
const opponent={id:2,disabled:true};
const lifecycle=createLifecycleRuntime({root:player=>player===1?root:opponent});
const queries=lifecycle.queries(root,opponent,[helper,projectile,disabledHelper,destroyedHelper]);
for(const id of [1,1001]){assert.equal(queries.playerIDExist(id),true);assert.equal(queries.redirect('PlayerID',id),actors.get(id))}
for(const id of [-1,2,1002,1003,1004,9999]){assert.equal(queries.playerIDExist(id),false);assert.equal(queries.redirect('PlayerID',id),null)}
console.log('Controller Character lookup excludes projectiles, destroyed and disabled recipients before RHS evaluation');
