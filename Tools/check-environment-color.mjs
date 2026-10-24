import assert from 'node:assert/strict';
import {createEnvironmentColor,applyEnvironmentColor,stepEnvironmentColor,paintEnvironmentColor} from '../Engine/environment-color.js';

const state=createEnvironmentColor(),order=[],api={evaluate:value=>{order.push(value);return Number(value)},split:value=>String(value).split(',')};
assert.equal(applyEnvironmentColor({type:'Null'},state,api),false);
applyEnvironmentColor({type:'EnvColor',params:{value:'257,-1,514',time:'2',under:'1'}},state,api);
assert.deepEqual(order,['257','-1','514','2','1']);assert.deepEqual(state,{color:[257,-1,514],remaining:2,under:true});
const calls=[],context={canvas:{width:32,height:16},save(){calls.push('save')},restore(){calls.push('restore')},setTransform(...values){calls.push(values)},fillRect(...values){calls.push(values)}};
assert.equal(paintEnvironmentColor(context,state),true);assert.equal(context.fillStyle,'rgb(1,255,2)');assert.deepEqual(calls.at(-2),[0,0,32,16]);
stepEnvironmentColor(state);assert.equal(state.remaining,1);stepEnvironmentColor(state);assert.equal(state.remaining,0);assert.equal(paintEnvironmentColor(context,state),false);
applyEnvironmentColor({type:'EnvColor',params:{time:'-1'}},state,api);stepEnvironmentColor(state);assert.deepEqual(state,{color:[255,255,255],remaining:-1,under:false});
applyEnvironmentColor({type:'EnvColor',params:{}},state,api);assert.deepEqual(state,{color:[255,255,255],remaining:1,under:false});
applyEnvironmentColor({type:'EnvColor',params:{time:'ignored',under:'ignored',value:'ignored,ignored,ignored'}},state,{...api,evaluate:value=>value});assert.deepEqual(state,{color:[0,0,0],remaining:0,under:false});
assert.throws(()=>applyEnvironmentColor({type:'EnvColor',params:{value:'1,2'}},state,api),/Not enough/);
assert.throws(()=>applyEnvironmentColor({type:'EnvColor',params:{redirectid:'1'}},state,api),/Unsupported/);
console.log('EnvColor native defaults, signed extraction, RGB byte wrapping, global reset, positive/negative time and full opaque fill pass');
