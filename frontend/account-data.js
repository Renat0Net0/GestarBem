'use strict';
(()=>{
 const el=id=>document.getElementById(id);
 let busy=false;
 for(const action of ['export','delete']){
  const form=el('data-'+action+'-form');
  form.onsubmit=async event=>{
   event.preventDefault();if(busy)return;
   const error=el('data-'+action+'-error'),status=el('data-'+action+'-status');
   error.textContent='';status.textContent='';
   if(!form.reportValidity())return;
   const body={currentPassword:el('data-'+action+'-password').value};
   if(action==='delete')body.confirmation=el('data-delete-confirmation').value;
   busy=true;form.setAttribute('aria-busy','true');
   document.querySelectorAll('#data-tools input,#data-tools button').forEach(n=>n.disabled=true);
   status.textContent=action==='export'?'Preparando arquivo…':'Excluindo conta…';
   try{
    const r=await fetch('/api/account/'+action,{method:'POST',credentials:'same-origin',headers:{'Content-Type':'application/json'},body:JSON.stringify(body)});
    if(r.status===401){location.replace('login.html');return;}
    const data=await r.json();if(!r.ok)throw new Error(data.message||'Não foi possível concluir.');
    if(action==='export'){
     const url=URL.createObjectURL(new Blob([JSON.stringify(data,null,2)],{type:'application/json'}));
     const a=document.createElement('a');a.href=url;a.download='gestarbem-dados.json';document.body.append(a);a.click();a.remove();setTimeout(()=>URL.revokeObjectURL(url),1000);
     status.textContent='Arquivo preparado. Verifique os downloads; ele contém informações pessoais.';
    }else{
     el('data-tools').hidden=true;el('settings-content').hidden=true;el('data-deleted').hidden=false;
     el('data-deleted-message').textContent=data.message;el('data-deleted-title').focus();
    }
   }catch(e){status.textContent='';error.textContent=e instanceof TypeError?'Não foi possível confirmar a operação. Se pediu exclusão, confira se ainda consegue entrar antes de tentar novamente.':e.message;error.focus();}
   finally{form.reset();busy=false;form.removeAttribute('aria-busy');document.querySelectorAll('#data-tools input,#data-tools button').forEach(n=>n.disabled=false);}
  };
 }
 window.addEventListener('pagehide',()=>{for(const f of document.querySelectorAll('#data-tools form'))f.reset();});
})();
