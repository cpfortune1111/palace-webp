const physicalFlags=new Set(['U','D','L','R','a','b','c','x','y','z','s','d','w','m']);

export function applyAssertInputController(controller,caller,api){
 if(String(controller.type).toLowerCase()!=='assertinput')return false;
 const params=controller.params||{},flags=[];
 for(const name of ['flag','flag2','flag3','flag4','flag5','flag6','flag7','flag8']){
  if(params[name]===undefined)continue;
  const value=String(params[name]);
  if(!physicalFlags.has(value)&&value!=='B'&&value!=='F')throw Error('Invalid AssertInput flag: '+value);
  flags.push(value);
 }
 if(!flags.length)throw Error('Must specify at least one AssertInput flag');
 const owner=params.redirectid===undefined?caller:api.findActor(Math.trunc(Number(api.evaluate(params.redirectid)))|0);
 if(!owner)return true;
 const resolved=flags.map(flag=>flag==='B'?(owner.facing>=0?'L':'R'):flag==='F'?(owner.facing>=0?'R':'L'):flag);
 api.assert(owner,resolved);return true;
}

export function createAssertInputState(){
 const actors=new Map();
 return {
  add(key,flags){let set=actors.get(key);if(!set){set=new Set();actors.set(key,set)}for(const flag of flags)set.add(flag)},
  take(key){const flags=actors.get(key)||new Set();actors.delete(key);return flags},
  clear(){actors.clear()}
 };
}

export function mergeAssertedCommandInput(input,flags,facing){
 if(!flags.size)return input;
 const result={...input};
 for(const flag of flags){
  const key=flag==='L'?(facing>=0?'B':'F'):flag==='R'?(facing>=0?'F':'B'):flag;
  result[key]=true;
 }
 return result;
}
