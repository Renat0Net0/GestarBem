'use strict';
(()=>{
const el=id=>document.getElementById(id);let saved=null,working=false,welcomeBusy=false;
const today=()=>{const d=new Date();return `${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,'0')}-${String(d.getDate()).padStart(2,'0')}`;};
el('dum').max=today();
const welcome=el('welcome-dialog');
el('welcome-dum').max=today();
function offerWelcome(){
 if(saved && saved.updated_at==null && !saved.dum && !welcome.open){
  welcome.showModal();el('welcome-title').focus();
 }
}
async function finishWelcome(withDate){
 if(welcomeBusy)return;
 const input=el('welcome-dum'),error=el('welcome-error');
 error.textContent='';input.removeAttribute('aria-invalid');input.max=today();
 if(withDate&&(!input.value||!input.checkValidity())){
  input.setAttribute('aria-invalid','true');error.textContent=input.value?input.validationMessage:'Escolha uma data, ou use Não sei ou Fazer mais tarde.';input.focus();return;
 }
 welcomeBusy=true;el('welcome-form').setAttribute('aria-busy','true');
 const controls=['welcome-dum','welcome-save','welcome-unknown','welcome-later'];
 controls.forEach(id=>el(id).disabled=true);
 el('welcome-status').textContent='Salvando sua escolha…';
 try{
  // A profile row persists the first-visit decision, including an empty DUM.
  saved=await api({dum:withDate?input.value:'',notes:saved?.notes||''});
  fill();el('profile-section').hidden=false;
  welcome.close();el('profile-status').textContent=withDate?'DUM salva. Você pode alterá-la em Meu perfil.':'Você pode informar a DUM depois em Meu perfil.';
  el('account-name').tabIndex=-1;el('account-name').focus();
 }catch(e){
  error.textContent=e.errors?.dum||e.message||'Não foi possível salvar sua escolha. Tente novamente.';
  error.focus();
 }finally{
  welcomeBusy=false;controls.forEach(id=>el(id).disabled=false);
  el('welcome-form').removeAttribute('aria-busy');el('welcome-status').textContent='';
 }
}
el('welcome-form').onsubmit=e=>{e.preventDefault();finishWelcome(true);};
el('welcome-unknown').onclick=()=>finishWelcome(false);
el('welcome-later').onclick=()=>finishWelcome(false);
welcome.addEventListener('cancel',e=>{e.preventDefault();finishWelcome(false);});

async function api(body){const r=await fetch('/api/profile',{method:body===undefined?'GET':'POST',credentials:'same-origin',headers:body===undefined?{}:{'Content-Type':'application/json'},body:body===undefined?undefined:JSON.stringify(body)});if(r.status===401){location.replace('login.html');throw new Error('Sessão encerrada.');}const data=await r.json();if(!r.ok)throw Object.assign(new Error(data.message),{errors:data.errors});return data.profile;}
function summary(){const dum=saved?.dum;if(!dum){el('gestation-summary').textContent='Informe a DUM para ver a estimativa de semanas.';return;}const days=Math.floor((Date.parse(today()+'T12:00:00Z')-Date.parse(dum+'T12:00:00Z'))/86400000);el('gestation-summary').textContent=days>=0&&days<=294?`Estimativa pelo calendário: ${Math.floor(days/7)} semanas e ${days%7} dias.`:'A DUM informada está fora da faixa de até 42 semanas usada nesta estimativa. Confira a data com seu profissional.';}
function clear(){el('profile-error').textContent='';for(const id of ['dum','notes']){el(id).removeAttribute('aria-invalid');el(id+'-error').textContent='';}}
function fill(){el('dum').value=saved.dum||'';el('notes').value=saved.notes;summary();clear();}
function lock(value){working=value;el('dum').disabled=el('notes').disabled=value;el('save-profile').disabled=el('reload-profile').disabled=el('retry-profile').disabled=value;el('gestational-form').setAttribute('aria-busy',String(value));}
async function load(){if(working)return;lock(true);el('profile-load-error').textContent='';el('profile-load-status').textContent='Carregando perfil…';try{saved=await api();fill();el('profile-section').hidden=false;el('retry-profile').hidden=true;el('profile-load-status').textContent='Perfil carregado.';offerWelcome();}catch(error){el('profile-load-status').textContent='';el('profile-load-error').textContent='Não foi possível carregar seu perfil. Tente novamente em alguns instantes.';el('retry-profile').hidden=false;}finally{lock(false);}}
el('retry-profile').onclick=load;
el('reload-profile').onclick=()=>{if(saved){fill();el('profile-status').textContent='Alterações não salvas foram canceladas.';el('dum').focus();}};
el('gestational-form').onsubmit=async event=>{event.preventDefault();if(working)return;clear();el('profile-status').textContent='';el('dum').max=today();let first;for(const id of ['dum','notes'])if(!el(id).checkValidity()){el(id).setAttribute('aria-invalid','true');el(id+'-error').textContent=el(id).validationMessage;first??=el(id);}if(first){el('profile-error').textContent='Revise os campos indicados.';first.focus();return;}lock(true);el('profile-status').textContent='Salvando perfil…';try{saved=await api({dum:el('dum').value,notes:el('notes').value});summary();el('profile-status').textContent='Perfil salvo no banco de dados.';}catch(error){el('profile-status').textContent='';el('profile-error').textContent=error.message||'Não foi possível salvar. Tente novamente.';for(const [id,text]of Object.entries(error.errors||{}))if(['dum','notes'].includes(id)){el(id).setAttribute('aria-invalid','true');el(id+'-error').textContent=text;first??=el(id);}first?.focus();}finally{lock(false);first?.focus();}};
load();window.addEventListener('pageshow',event=>{if(event.persisted){el('profile-section').hidden=true;load();}});
})();
