const fs=require('node:fs');
const http=require('node:http');
const path=require('node:path');
const assert=require('node:assert/strict');
const {chromium}=require('C:/Users/jeffy/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright');
const root=path.resolve(__dirname,'..');
const server=http.createServer((request,response)=>{
 const pathname=new URL(request.url,'http://localhost').pathname;
 if(pathname==='/'){response.setHeader('Content-Type','text/html');response.end('<body style="margin:0"><script type="module">import {createSelectScreen} from "./Engine/select-screen.js";window.selection=createSelectScreen(document.body,{confirm:(mode,choice)=>window.choice=choice,back:()=>{}});await selection.ready;selection.show("vs");document.addEventListener("keydown",event=>selection.handleKey(event));</script>');return}
 const file=path.resolve(root,'.'+pathname);if(!file.startsWith(root+path.sep)||!fs.existsSync(file)){response.writeHead(404);response.end();return}
 response.setHeader('Content-Type',({'.js':'text/javascript','.json':'application/json','.webp':'image/webp'})[path.extname(file)]||'application/octet-stream');response.end(fs.readFileSync(file));
});
(async()=>{let browser;try{await new Promise(resolve=>server.listen(8767,'127.0.0.1',resolve));browser=await chromium.launch({headless:true,channel:'msedge'});const page=await browser.newPage({viewport:{width:1280,height:720}}),errors=[];page.on('pageerror',error=>errors.push(error.message));await page.goto('http://127.0.0.1:8767');await page.waitForFunction(()=>window.selection?.snapshot().visible).catch(error=>{throw Error(error.message+'; '+JSON.stringify(errors))});await page.locator('#confirmSelection').waitFor();await page.screenshot({path:path.resolve(root,'../outputs/selection-artwork.png')});for(const code of ['Enter','Enter','ArrowRight','Enter','ArrowRight','Enter','ArrowRight','Enter','Enter','Enter'])await page.keyboard.press(code);const choice=await page.evaluate(()=>window.choice);assert.deepEqual(choice.hardware,['3do','3do']);assert.deepEqual(choice.command,['auto','normal']);assert.deepEqual(errors,[]);console.log('Browser selection, decoded WEBP images, keyboard sequence and mode payload passed')}finally{await browser?.close();server.close()}})().catch(error=>{console.error(error);process.exitCode=1});
