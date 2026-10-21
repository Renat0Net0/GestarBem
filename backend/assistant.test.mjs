import test from 'node:test';import assert from 'node:assert/strict';
import {assistantErrors,registerAssistant} from './assistant.mjs';
import {loadAssistantContext,manausToday} from './assistant-context.mjs';
const env={AI_ENABLED:'true',OPENAI_API_KEY:'chave-ficticia',OPENAI_MODEL:'gpt-4.1-mini',AI_MAX_CALLS:'2'};
const body={message:'Resuma meu acompanhamento.',consent:true};
function fixture({configured=env,quota=true,fetchImpl}={}){
 const calls=[],routes={};const pool={async query(sql,args){calls.push({sql,args});if(sql.includes('assistant_usage'))return {rows:quota?[{call_count:1}]:[]};if(sql.includes('gestational_profiles'))return {rows:[{dum:'2026-08-01',name:'nao-enviar',notes:'privado'}]};if(sql.includes('gestational_events'))return {rows:[{title:'Consulta fictícia',type:'Consulta',date:'2026-10-20',time:'09:00',user_id:'nao-enviar'}]};return {rows:[{type:'Peso',value:'68 kg',date:'2026-10-12',notes:'nao-enviar'}]};}};
 function guard(){}function limit(){}const app={get(path,m,fn){assert.equal(m,guard);routes[path]=fn;},post(path,m,l,fn){assert.equal(m,guard);assert.equal(l,limit);routes[path]=fn;}};
 registerAssistant(app,pool,guard,limit,{env:configured,fetchImpl:fetchImpl||(async()=>({ok:true,json:async()=>({status:'completed',output:[{type:'message',role:'assistant',content:[{type:'output_text',text:JSON.stringify({answer:'Consulta fictícia registrada.',sourceIds:[]})}]}]})}))});
 async function run(data=body){const res={code:200,status(c){this.code=c;return this;},json(x){this.body=x;return this;}};await routes['/api/assistant']({user:{id:'owner-A',email:'nao-enviar'},body:data},res);return res;}
 return {run,calls,pool};
}
test('valida mensagem e consentimento antes de consultar dados',async()=>{
 for(const b of [null,[],{}, {message:' '},{message:'x'.repeat(1001),consent:true}])assert.ok(assistantErrors(b).message);
 assert.ok(assistantErrors({message:'Oi'}).consent);assert.deepEqual(assistantErrors(body),{});
 const f=fixture();assert.equal((await f.run({message:'Oi'})).code,422);assert.equal(f.calls.length,0);
});
test('contexto e consultas usam a sessão e excluem identificadores e observações',async()=>{
 const f=fixture();const c=await loadAssistantContext(f.pool,'owner-A','2026-10-13');
 assert.equal(c.estimatedWeeks,10);assert.equal(c.recentRecords.length,1);
 assert.equal(JSON.stringify(c).includes('nao-enviar'),false);assert.equal(JSON.stringify(c).includes('privado'),false);
 for(const call of f.calls)assert.equal(call.args[0],'owner-A');
 assert.equal(manausToday(new Date('2026-10-13T02:00:00Z')),'2026-10-12');
});
test('configuração desativada impede consultas e cobrança',async()=>{
 const f=fixture({configured:{}});assert.equal((await f.run()).code,503);assert.equal(f.calls.length,0);
});
test('quota esgotada impede chamada ao provedor',async()=>{
 let count=0;const f=fixture({quota:false,fetchImpl:async()=>{count++;}});assert.equal((await f.run()).code,429);assert.equal(count,0);
});
test('usa contexto do banco e fontes fixas sem confiar no contexto enviado no corpo',async()=>{
 let payload;const f=fixture({fetchImpl:async(url,opt)=>{assert.equal(url,'https://api.openai.com/v1/responses');payload=JSON.parse(opt.body);return {ok:true,json:async()=>({status:'completed',output:[{type:'message',role:'assistant',content:[{type:'output_text',text:JSON.stringify({answer:'O modelo geral recomenda oito contatos [OMS-01].',sourceIds:['OMS-01']})}]}]})};}});
 const r=await f.run({...body,accountContext:{value:'forjado'},user_id:'owner-B'});
 assert.equal(r.code,200);assert.equal(r.body.sources[0].id,'OMS-01');assert.equal(payload.store,false);assert.equal(payload.max_output_tokens,900);
 assert.equal(payload.input.includes('forjado'),false);assert.equal(payload.input.includes('nao-enviar'),false);assert.equal(payload.input.includes('68 kg'),true);
 assert.deepEqual(f.calls.at(-1).args,['demo-1',2]);
});
test('falhas e respostas incompletas não vazam credenciais',async()=>{
 for(const fetchImpl of [async()=>{throw new Error('chave-ficticia');},async()=>({ok:false,status:401}),async()=>({ok:true,json:async()=>({status:'incomplete',output:[]})})]){
 const r=await fixture({fetchImpl}).run();assert.equal(r.code,502);assert.equal(JSON.stringify(r.body).includes('chave-ficticia'),false);
 }
});
test('referência inventada é rejeitada',async()=>{
 const f=fixture({fetchImpl:async()=>({ok:true,json:async()=>({status:'completed',output:[{type:'message',role:'assistant',content:[{type:'output_text',text:JSON.stringify({answer:'Texto',sourceIds:['OMS-INVENTADA']})}]}]})})});
 assert.equal((await f.run()).code,502);
});
test('bloqueia chamada concorrente e libera após resposta',async()=>{
 let release;const f=fixture({fetchImpl:()=>new Promise(resolve=>{release=()=>resolve({ok:false,status:500});})});
 const first=f.run();while(!release)await new Promise(setImmediate);
 assert.equal((await f.run()).code,429);release();await first;
 const next=f.run();release=undefined;while(!release)await new Promise(setImmediate);release();await next;
});
