import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import vm from 'node:vm';
import {controllerBoolean} from '../Engine/controller-value-conversion.js';

const source=readFileSync(new URL('../index.html',import.meta.url),'utf8');
const begin=source.indexOf('function controllerTriggered('),end=source.indexOf('\n}',begin)+2;
const values={text:'3',empty:'',undefined:NaN,zero:0,positive:2,negative:-1,infinity:Infinity};
const context=vm.createContext({controllerBoolean,evalM1:expression=>values[expression]});
vm.runInContext(source.slice(begin,end),context);
const check=controller=>vm.runInContext('controllerTriggered('+JSON.stringify(controller)+')',context);
for(const name of ['text','empty','undefined','zero']){
 assert.equal(check({triggerall:[name],triggers:{1:['positive']}}),false,name);
 assert.equal(check({triggers:{1:[name]}}),false,name);
}
for(const name of ['positive','negative','infinity'])assert.equal(check({triggers:{1:[name]}}),true,name);
assert.equal(check({triggers:{1:['text'],2:['positive']}}),true);
assert.equal(check({triggers:{1:['text','positive']}}),false);
console.log('Actual common trigger groups use native boolean extraction for strings/undefined while retaining numeric truth and OR/AND grouping');
