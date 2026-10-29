'use strict';
(()=>{
 const el=id=>document.getElementById(id),fields=['currentPassword','newPassword','confirmPassword'];let busy=false,submitted=false;
 function clearFields(){for(const id of fields){el(id).value='';el(id).type='password';}el('show-new-password').textContent='Mostrar nova senha';el('show-new-password').setAttribute('aria-pressed','false');}
 function errors(){el('password-error').textContent='';for(const id of fields){el(id).removeAttribute('aria-invalid');el(id+'-error').textContent='';}}
 function invalid(id,message){if(!fields.includes(id))return;el(id).setAttribute('aria-invalid','true');el(id+'-error').textContent=message;}
 async function load(){if(busy)return;busy=true;el('retry-settings').hidden=true;el('settings-content').hidden=true;el('settings-error').textContent='';el('settings-status').textContent='Verificando sua sessão…';
 try{const response=await fetch('/api/auth/me',{credentials:'same-origin',cache:'no-store'});if(response.status===401){location.replace('login.html');return;}if(!response.ok)throw new Error('Não foi possível verificar a sessão. Tente novamente.');el('settings-content').hidden=false;el('data-tools').hidden=false;el('settings-status').textContent='';}
 catch(error){el('settings-status').textContent='';el('settings-error').textContent=error.message;el('retry-settings').hidden=false;}finally{busy=false;if(!el('retry-settings').hidden)el('retry-settings').focus();}}
 el('retry-settings').onclick=load;
 el('show-new-password').onclick=()=>{const show=el('newPassword').type==='password';for(const id of ['newPassword','confirmPassword'])el(id).type=show?'text':'password';el('show-new-password').textContent=show?'Ocultar nova senha':'Mostrar nova senha';el('show-new-password').setAttribute('aria-pressed',String(show));};
 el('password-form').onsubmit=async event=>{
  event.preventDefault();if(busy||submitted)return;errors();el('password-status').textContent='';let first;
  for(const id of fields)if(!el(id).checkValidity()){invalid(id,el(id).validationMessage);first??=el(id);}
  if(el('newPassword').value!==el('confirmPassword').value){invalid('confirmPassword','As senhas precisam ser iguais.');first??=el('confirmPassword');}
  if(el('newPassword').value&&el('newPassword').value===el('currentPassword').value){invalid('newPassword','Escolha uma senha diferente da atual.');first??=el('newPassword');}
  if(first){el('password-error').textContent='Revise os campos indicados.';first.focus();return;}
  const body=Object.fromEntries(new FormData(event.target));busy=true;event.target.setAttribute('aria-busy','true');event.target.querySelectorAll('input,button').forEach(n=>n.disabled=true);el('password-status').textContent='Alterando senha…';
  try{const response=await fetch('/api/account/password',{method:'POST',credentials:'same-origin',headers:{'Content-Type':'application/json'},body:JSON.stringify(body)});if(response.status===401){clearFields();location.replace('login.html');return;}let data;try{data=await response.json();}catch{throw new TypeError('Resposta inesperada do servidor.');}if(!response.ok)throw Object.assign(new Error(data.message||'Não foi possível alterar a senha.'),{errors:data.errors});
   submitted=true;clearFields();el('password-form').hidden=true;el('data-tools').hidden=true;el('password-success').hidden=false;el('password-success-message').textContent=data.message;el('login-again').focus();
  }catch(error){el('password-status').textContent='';el('password-error').textContent=error instanceof TypeError?'Não foi possível confirmar a alteração. Tente entrar com a nova senha antes de repetir; se ela não funcionar, use a senha anterior.':error.message||'Não foi possível concluir. Tente novamente.';for(const [id,message]of Object.entries(error.errors||{})){invalid(id,message);}first=fields.map(id=>el(id)).find(field=>field.getAttribute('aria-invalid')==='true')||el('password-error');}
  finally{busy=false;event.target.removeAttribute('aria-busy');event.target.querySelectorAll('input,button').forEach(n=>n.disabled=false);if(first)first.focus();}
 };
 window.addEventListener('pagehide',()=>{clearFields();el('settings-content').hidden=true;el('data-tools').hidden=true;});window.addEventListener('pageshow',event=>{if(event.persisted)location.reload();});load();
})();
