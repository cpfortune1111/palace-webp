const fs=require('node:fs'),path=require('node:path'),cp=require('node:child_process'),crypto=require('node:crypto'),assert=require('node:assert/strict'),{pathToFileURL}=require('node:url');
const [receiptFile,outputFile]=process.argv.slice(2);if(!receiptFile||!outputFile)throw Error('Usage: node check-air-trans-native.cjs <private build receipt> <private result JSON>');
const receipt=JSON.parse(fs.readFileSync(receiptFile,'utf8'));
assert.equal(receipt.commit,'cb56d73badb322f3725257c2e8cfd157b2c3989d');
assert(receipt.compiler.startsWith('go version go1.27.3 '));
assert.equal(crypto.createHash('sha256').update(fs.readFileSync(receipt.executable)).digest('hex'),receipt.executableSha256);
const tokens=['',' ','Q','A10','A1junk','SA7','  xxAS000128D000064junk ','AS-1D9','AS12junkD34','SSjunk','SASjunk'];
for(const prefix of ['','xx'])for(const mode of ['A','S','A1','SA','AS','SS','SAS'])for(const number of ['','0','1','128','255','256','16383','16384','16385','65536','9876543210'.repeat(8)])for(const destination of ['','D','D0','D64','D255','D256','D16384','Djunk'])for(const tail of ['','junk','-5'])tokens.push(prefix+mode+number+destination+tail);
let seed=0x2622;
for(let index=0;index<5000;index++){const alphabet='aAsSdD0123456789xXjQ- ',length=(seed>>>0)%40;let token='';for(let position=0;position<length;position++){seed=(Math.imul(seed,1664525)+1013904223)>>>0;token+=alphabet[seed%alphabet.length]}seed=(Math.imul(seed,1664525)+1013904223)>>>0;tokens.push(token)}
const requests=tokens.map(Blend=>({Kind:'alpha',Blend})),native=JSON.parse(cp.execFileSync(receipt.executable,[],{input:JSON.stringify(requests),encoding:'utf8',timeout:30000,maxBuffer:16*1024*1024}));
assert.equal(native.length,tokens.length);
(async()=>{const {parseAirTransState}=await import(pathToFileURL(path.resolve(__dirname,'../Engine/air-trans.js')));for(let index=0;index<tokens.length;index++){
 const result=parseAirTransState(tokens[index]),expected=native[index];assert.equal(expected.Panic,'','native panic '+tokens[index]);
 assert.deepEqual(result.state,{type:expected.Type,alpha:expected.Alpha},'state '+JSON.stringify(tokens[index]));
 assert.deepEqual(result.diagnostics.map(value=>value.message),expected.Error?[expected.Error]:[],'diagnostic '+JSON.stringify(tokens[index]));
 assert.equal((expected.Warnings||[]).length,0);
}const report={commit:receipt.commit,compiler:receipt.compiler,oracleExecutableSha256:receipt.executableSha256,scope:'ASCII alpha-field component only; fixed valid remaining frame fields; extracted native functions with documented facades; not full engine or file-level policy certification',cases:tokens.length,matched:true,goalComplete:false};fs.writeFileSync(outputFile,JSON.stringify(report,null,2));console.log('PASS '+tokens.length+' AIR alpha state/diagnostic cases match extracted compiled native source')})().catch(error=>{console.error(error.message);process.exitCode=1});
