'use strict';
(()=>{
 const el=id=>document.getElementById(id);let busy=false;
 function clear(){el('activity-content').hidden=true;el('activity-list').replaceChildren();}
 async function load(){if(busy)return;busy=true;clear();el('reload-activity').disabled=true;el('main').setAttribute('aria-busy','true');el('activity-error').textContent='';el('activity-status').textContent='Carregando histórico…';
 try{const response=await fetch('/api/activity',{credentials:'same-origin',cache:'no-store'});if(response.status===401){location.replace('login.html');return;}if(!response.ok)throw new Error('Não foi possível carregar o histórico. Tente novamente.');
 const {activities}=await response.json();if(!Array.isArray(activities))throw new Error('O histórico recebeu uma resposta incompleta.');
 const entities={profile:'Perfil gestacional',event:'Compromisso',record:'Registro de acompanhamento'},actions={created:'criado',updated:'alterado',deleted:'excluído'};
 for(const activity of activities){
 const li=document.createElement('li');li.className='dashboard-item';
 const heading=document.createElement('h3');heading.textContent=(entities[activity.entityType]||'Item')+' '+(actions[activity.action]||'atualizado');
 const date=document.createElement('p');const hasDescription=Object.hasOwn(activity,'itemSummary');const when=new Intl.DateTimeFormat('pt-BR',{timeZone:'America/Manaus',dateStyle:'short',timeStyle:'medium'}).format(new Date(activity.occurredAt));
 date.textContent=when+' (Manaus) — '+(activity.itemSummary||(hasDescription?'Item não encontrado — detalhes indisponíveis.':'Descrição indisponível: atualize o backend e reinicie o servidor.'));
 li.append(heading,date);
 if(activity.itemSummary){const note=document.createElement('p');note.className='soft';note.textContent='Dados atuais do item'+(activity.itemDate?' · Data do item: '+activity.itemDate.split('-').reverse().join('/'):'')+'.';li.append(note);}
 el('activity-list').append(li);}

 el('activity-content').hidden=activities.length===0;el('activity-status').textContent=activities.length?activities.length+' atividade(s) carregada(s).':'Ainda não há atividades registradas desde a ativação do histórico.';
 }catch(error){clear();el('activity-status').textContent='';el('activity-error').textContent=error.message||'Falha de conexão. Tente novamente.';}
 finally{busy=false;el('reload-activity').disabled=false;el('main').removeAttribute('aria-busy');}}
 el('reload-activity').onclick=load;window.addEventListener('pagehide',clear);window.addEventListener('pageshow',event=>{if(event.persisted)load();});load();
})();
