const {chromium}=require('playwright');
const http=require('http'),fs=require('fs'),path=require('path'),assert=require('node:assert/strict');
const root=process.cwd()+'/frontend';
const server=http.createServer((req,res)=>{
 const f=path.join(root,new URL(req.url,'http://local').pathname);
 try{res.setHeader('Content-Type',f.endsWith('.js')?'application/javascript':f.endsWith('.css')?'text/css':'text/html');res.end(fs.readFileSync(f));}catch{res.statusCode=404;res.end();}
});
(async()=>{
 await new Promise(r=>server.listen(0,'127.0.0.1',r));
 const browser=await chromium.launch({headless:true});
 const page=await browser.newPage({viewport:{width:320,height:800}});
 const errors=[];page.on('pageerror',e=>errors.push(e.message));
 let payload;
 await page.route('**/api/**',async route=>{
  const url=route.request().url();let data={};
  if(url.endsWith('/auth/me'))data={user:{id:'A',name:'Ana',email:'a@example.test'}};
  else if(url.endsWith('/assistant/status'))data={available:true};
  else if(url.endsWith('/assistant')){payload=route.request().postDataJSON();data={answer:'Resposta fictícia.',sources:[],contextSummary:{estimatedWeeks:null,events:0,records:0}};}
  else if(url.endsWith('/account/delete'))data={message:'Conta excluída.'};
  else if(url.endsWith('/account/export'))data={schemaVersion:1,account:{name:'Ana'}};
  else if(url.endsWith('/profile'))data={profile:{dum:null,notes:''}};
  else data={events:[],records:[],reminders:[]};
  await route.fulfill({json:data});
 });
 const base='http://127.0.0.1:'+server.address().port;
 await page.goto(base+'/settings.html');
 await page.locator('#data-tools').waitFor({state:'visible'});
 assert.equal(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth),true);
 await page.locator('#data-export-password').fill('senha123');
 const download=page.waitForEvent('download');
 await page.getByRole('button',{name:'Baixar meus dados'}).click();
 assert.equal((await download).suggestedFilename(),'gestarbem-dados.json');
 await page.locator('#data-delete-password').fill('senha123');
 await page.locator('#data-delete-confirmation').fill('EXCLUIR');
 await page.getByRole('button',{name:'Excluir permanentemente minha conta'}).click();
 await page.locator('#data-deleted').waitFor({state:'visible'});
 assert.equal(await page.evaluate(()=>document.activeElement.id),'data-deleted-title');
 await page.goto(base+'/account.html');
 await page.locator('#ai-form').waitFor({state:'visible'});
 await page.locator('#ai-message').fill('Pergunta educativa fictícia');
 await page.locator('#ai-send').click();
 await page.locator('#ai-result').waitFor({state:'visible'});
 assert.equal(payload.includeContext,false);
 await page.locator('#ai-context-mode').selectOption('personal');
 await page.locator('#ai-send').click();
 await page.waitForFunction(()=>document.querySelector('#ai-status').textContent==='Resposta recebida.');
 assert.equal(payload.includeContext,true);
 assert.equal(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth),true);
 await page.screenshot({path:'/tmp/gb-ui.png',fullPage:true});
 assert.deepEqual(errors,[]);
 console.log('Navegador Chromium: exportação, exclusão/foco, IA nos dois modos e reflow em 320px passaram. APIs simuladas.');
 await browser.close();server.close();
})().catch(e=>{console.error(e);server.close();process.exit(1)});
