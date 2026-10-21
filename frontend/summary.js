'use strict';
(()=>{
 const el=id=>document.getElementById(id);let busy=false,ready=false;
 async function get(path){const response=await fetch(path,{credentials:'same-origin',cache:'no-store'});if(response.status===401){location.replace('login.html');throw new Error('Entre novamente para continuar.');}if(!response.ok)throw new Error('Não foi possível carregar todas as informações. Tente atualizar o resumo.');return response.json();}
 function text(tag,value){const element=document.createElement(tag);element.textContent=value;return element;}
 const date=value=>value?value.split('-').reverse().join('/'):'Não informada';
 function entry(list,title,description,notes){const article=document.createElement('article');article.className='summary-entry';article.append(text('h3',title),text('p',description));if(notes)article.append(text('p',notes));list.append(article);}
 function clear(){ready=false;el('print-summary').disabled=true;el('summary-content').hidden=true;for(const id of ['summary-name','summary-date','summary-dum','summary-notes','summary-events-count','summary-records-count'])el(id).textContent='';el('summary-events').replaceChildren();el('summary-records').replaceChildren();}
 async function load(){if(busy)return;busy=true;clear();el('reload-summary').disabled=true;el('main').setAttribute('aria-busy','true');el('summary-error').textContent='';el('summary-status').textContent='Carregando informações…';
 try{
  const {user}=await get('/api/auth/me');
  const [profileData,eventData,recordData]=await Promise.all([get('/api/profile'),get('/api/events'),get('/api/records')]);
  if(!user||!profileData.profile||!Array.isArray(eventData.events)||!Array.isArray(recordData.records))throw new Error('O resumo recebeu informações incompletas. Tente atualizar.');
  const profile=profileData.profile;
  el('summary-name').textContent='Nome: '+user.name;
  el('summary-date').textContent='Resumo gerado em: '+new Intl.DateTimeFormat('pt-BR',{timeZone:'America/Manaus',dateStyle:'short',timeStyle:'short'}).format(new Date())+' (Manaus)';
  el('summary-dum').textContent='Data da última menstruação (DUM): '+date(profile.dum);
  el('summary-notes').textContent='Observações: '+(profile.notes||'Nenhuma informada.');
  const events=[...eventData.events].sort((a,b)=>(a.date+a.time).localeCompare(b.date+b.time));
  const records=[...recordData.records].sort((a,b)=>b.date.localeCompare(a.date));
  el('summary-events-count').textContent=events.length+' compromisso(s).';
  el('summary-records-count').textContent=records.length+' registro(s).';
  for(const event of events)entry(el('summary-events'),event.title,event.type+' · '+date(event.date)+' às '+event.time+' · '+(event.done?'Concluído':'Agendado'),event.notes);
  for(const record of records)entry(el('summary-records'),record.value,record.type+' · '+date(record.date),record.notes);
  if(!events.length)el('summary-events').append(text('p','Nenhum compromisso cadastrado.'));
  if(!records.length)el('summary-records').append(text('p','Nenhum registro cadastrado.'));
  ready=true;el('summary-content').hidden=false;el('print-summary').disabled=false;el('summary-status').textContent='Resumo completo. Confira as informações antes de imprimir.';
 }catch(error){clear();el('summary-status').textContent='';el('summary-error').textContent=error.message||'Não foi possível carregar o resumo. Tente novamente.';}
 finally{busy=false;el('reload-summary').disabled=false;el('main').removeAttribute('aria-busy');}}
 el('print-summary').onclick=()=>{if(ready&&!busy)window.print();};
 el('reload-summary').onclick=load;
 window.addEventListener('pagehide',clear);
 window.addEventListener('pageshow',event=>{if(event.persisted)load();});
 load();
})();