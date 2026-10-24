import assert from 'node:assert/strict';
import {compilePlaySoundOptions} from '../Engine/play-sound-options.js';

const reads=[],evaluate=value=>{reads.push(value);return value};
assert.deepEqual(compilePlaySoundOptions({},evaluate),{lowPriority:false,priority:0,panParams:{pan:0,absolute:false},volume:100,stopFlags:{hit:false,state:false}});assert.deepEqual(reads,[]);
assert.deepEqual(compilePlaySoundOptions({lowpriority:1,pan:20,abspan:40,priority:7},evaluate),{lowPriority:true,priority:7,panParams:{pan:40,absolute:true},volume:100,stopFlags:{hit:false,state:false}});assert.deepEqual(reads,[1,20,40,7]);
assert.deepEqual(compilePlaySoundOptions({pan:.1},evaluate).panParams,{pan:Math.fround(.1),absolute:false});
assert.deepEqual(compilePlaySoundOptions({lowpriority:'1',abspan:'40',priority:'7'},evaluate),{lowPriority:false,priority:0,panParams:{pan:0,absolute:true},volume:100,stopFlags:{hit:false,state:false}});
assert.deepEqual(compilePlaySoundOptions({},evaluate,0).stopFlags,{hit:true,state:false});assert.deepEqual(compilePlaySoundOptions({stopongethit:'1',stoponchangestate:1},evaluate,0).stopFlags,{hit:false,state:true});assert.deepEqual(compilePlaySoundOptions({stopongethit:1},evaluate,7).stopFlags,{hit:true,state:false});
reads.length=0;assert.equal(compilePlaySoundOptions({volume:128,volumescale:50,priority:7},evaluate).volume,50);assert.deepEqual(reads,[128,50,7]);assert.equal(compilePlaySoundOptions({volume:-129},evaluate).volume,75);
console.log('Supported PlaySnd lowpriority/pan/abspan/priority options preserve native evaluation order and typed extraction; remaining parameters are pending');
