const fs=require('node:fs'),assert=require('node:assert/strict'),vm=require('node:vm'),{spawnSync}=require('node:child_process');
const html=fs.readFileSync(new URL('../index.html','file://'+__filename.replaceAll('\\','/')),'utf8');
const script=html.split('<script type="module">')[1].split('</script>')[0];
const syntax=spawnSync(process.execPath,['--input-type=module','--check'],{input:script,encoding:'utf8'});assert.equal(syntax.status,0,syntax.stderr);
(async()=>{
 const {abilityProfile,abilityDamage}=await import('../Engine/ability-system.js');
 const context={battleAbilities:[abilityProfile(),abilityProfile()],abilityDamage,battleDat:{cornerpushProfile:{defaultMultiplier:1},koProfile:{enabled:false},hitPriorityDefaults:{defender:0}},inGroundGuardState:()=>false,constVal:()=>60};
 vm.createContext(context);const body=script.slice(script.indexOf('function resolveGroundHitM1('),script.indexOf('function fighterElemTime('));vm.runInContext(body,context);
 const defender={life:100,ctrl:1,moveType:'I',type:'S',y:0},params={damage:'4,2',attr:'S,NA',guardflag:'MA','ground.velocity':'0,0','guard.velocity':'0,0',pausetime:'0,0','fall.damage':'4'};
 const resolve=(state=200,damage='4,2',player=1,guard='none')=>context.resolveGroundHitM1({id:player,state,facing:1},defender,{...params,damage},guard);
 assert.equal(resolve().life,96);context.battleAbilities=[abilityProfile([0,0,0,0,0,5]),abilityProfile()];assert.equal(resolve().getHit.damage,5.4);
 context.battleAbilities=[abilityProfile([5,5,0,0,0,0]),abilityProfile([0,0,5,0,0,0])];assert.equal(resolve(1000,'10,2').getHit.damage,10);assert.equal(resolve(3000,'48,2').getHit.damage,36);assert.equal(resolve(3000,'48,2').getHit['fall.damage'],3);assert.equal(resolve(1000,'10,2',1,'stand').getHit.damage,2);
 context.battleAbilities=[abilityProfile(),abilityProfile([0,5,0,0,0,0])];assert.equal(resolve(3000,'48,2',2).getHit.damage,72);
 assert.ok(script.includes('p1Life=p1LifeMax;p2.life=p2.lifeMax'));assert.ok(script.includes("mode==='training'?Array(6).fill(0)"));
 console.log('Main battle integration: JS syntax, direct/guard/fall damage, per-player modifiers, round HP reset and training baseline passed');
})().catch(error=>{console.error(error);process.exitCode=1});

