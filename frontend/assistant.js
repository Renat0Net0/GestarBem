'use strict';
(()=>{
 const el=id=>document.getElementById(id);let busy=false,controller;
 function lock(value){busy=value;el('ai-form').setAttribute('aria-busy',String(value));for(const id of ['ai-message','ai-context-mode','ai-send'])el(id).disabled=value;el('ai-clear').disabled=value;}
 async function status(){
  const retrying=document.activeElement===el('retry-ai');
  el('retry-ai').hidden=true;el('ai-status').textContent='Verificando disponibilidade…';
  try{const r=await fetch('/api/assistant/status',{credentials:'same-origin',cache:'no-store'});if(r.status===401){location.replace('login.html');return;}if(!r.ok)throw new Error();const data=await r.json();el('ai-form').hidden=!data.available;el('ai-status').textContent=data.available?'Assistente disponível. Cada pergunta é respondida separadamente.':'Assistente aguardando configuração pela equipe do projeto.';}
  catch{el('ai-form').hidden=true;el('ai-status').textContent='Não foi possível verificar o assistente. Use o botão para tentar novamente.';el('retry-ai').hidden=false;}
  finally{if(retrying){el('ai-status').tabIndex=-1;el('ai-status').focus();}}
 }
 el('retry-ai').onclick=status;
 function clear(){controller?.abort();el('ai-message').removeAttribute('aria-invalid');el('ai-message').value='';el('ai-context-mode').value='general';el('ai-answer').textContent='';el('ai-sources').replaceChildren();el('ai-context').textContent='';el('ai-result').hidden=true;el('ai-error').textContent='';}
 el('ai-clear').onclick=()=>{if(busy)return;clear();el('ai-message').focus();};
 el('ai-form').onsubmit=async event=>{
  event.preventDefault();if(busy)return;el('ai-message').removeAttribute('aria-invalid');el('ai-error').textContent='';el('ai-result').hidden=true;
  const message=el('ai-message').value.trim();
  if(!message||message.length>1000){el('ai-message').setAttribute('aria-invalid','true');el('ai-error').textContent='Escreva uma pergunta de até 1.000 caracteres.';el('ai-message').focus();return;}
  controller=new AbortController();lock(true);el('ai-status').textContent='Preparando resposta…';let failed=false;
  try{const r=await fetch('/api/assistant',{method:'POST',credentials:'same-origin',headers:{'Content-Type':'application/json'},body:JSON.stringify({message,consent:true,includeContext:el('ai-context-mode').value==='personal'}),signal:AbortSignal.any([controller.signal,AbortSignal.timeout(40000)])});if(r.status===401){clear();location.replace('login.html');return;}const data=await r.json();if(!r.ok)throw new Error(data.message||'Não foi possível consultar o assistente.');if(typeof data.answer!=='string'||!data.answer.trim())throw new Error('Resposta indisponível.');el('ai-answer').textContent=data.answer;el('ai-sources').replaceChildren();for(const source of data.sources||[]){if(!source.url?.startsWith('https://www.who.int/'))continue;const li=document.createElement('li'),a=document.createElement('a');a.href=source.url;a.textContent=source.id+' — '+source.title+' (abre em nova aba)';a.target='_blank';a.rel='noopener noreferrer';li.append(a);el('ai-sources').append(li);}const c=data.contextSummary;el('ai-context').textContent=c?'Contexto usado: '+(c.estimatedWeeks==null?'sem estimativa gestacional':c.estimatedWeeks+' semanas estimadas')+', '+c.events+' compromisso(s) e '+c.records+' registro(s).':'';el('ai-result').hidden=false;el('ai-status').textContent='Resposta recebida.';}
  catch(error){failed=true;el('ai-status').textContent='';el('ai-error').textContent=error.message==='Failed to fetch'||error.name==='TimeoutError'?'Não foi possível conectar ao assistente. Tente novamente.':error.message||'Não foi possível concluir.';}
  finally{lock(false);if(failed)el('ai-error').focus();else if(!el('ai-result').hidden)el('ai-result-title').focus();}
 };
 window.addEventListener('pagehide',clear);
 window.addEventListener('pageshow',event=>{if(event.persisted){clear();status();}});
 status();
})();
