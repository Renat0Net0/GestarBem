'use strict';
(()=>{
 const el=id=>document.getElementById(id);
 const options=el('attention-options'),choices=[...options.querySelectorAll('input[type="checkbox"]')];
 const flow=el('attention-flow'),result=el('attention-result'),list=el('attention-selected');
 const selected=()=>choices.filter(c=>c.checked);
 const label=c=>c.closest('label').querySelector('span').textContent;
 let other=false;
 function clearReport(){
  for(const id of ['attention-started','attention-description','attention-report'])el(id).value='';
  el('attention-preparation').hidden=true;el('attention-prepare').setAttribute('aria-expanded','false');
 }
 function reset(focus=false){
  choices.forEach(c=>c.checked=false);other=false;clearReport();list.replaceChildren();result.hidden=true;
  el('attention-announcement').textContent='';flow.hidden=true;el('attention-start').hidden=false;
  if(focus)el('attention-start').focus();
 }
 function update(announce=true){
  clearReport();list.replaceChildren();const items=selected();
  result.hidden=!items.length&&!other;
  el('attention-result-title').textContent=items.length?'2. Procure atendimento imediatamente':'2. Sua preocupação merece orientação';
  el('attention-guidance').textContent=items.length
   ?'Você informou sinais de atenção atuais. Procure atendimento de saúde imediatamente. Não aguarde resposta da IA.'
   :'Não encontrar ou não selecionar um sinal não significa ausência de risco. Se algo preocupa você ou não sabe se é sério, converse com sua equipe de saúde.';
  for(const c of items){
   const li=document.createElement('li');
   li.textContent=label(c)+' — sinal informado nesta consulta.';
   list.append(li);
  }
  if(announce)el('attention-announcement').textContent=items.length
   ?items.length+' sinal(is) selecionado(s). Procure atendimento imediatamente.'
   :other?'A lista não cobre todos os sintomas. Procure orientação da equipe de saúde.':'Nenhum sinal selecionado. Esta consulta não avalia seu estado de saúde.';
 }
 el('attention-start').onclick=()=>{flow.hidden=false;el('attention-start').hidden=true;el('attention-step-title').focus();};
 options.addEventListener('change',()=>{other=false;update();});
 el('attention-review').onclick=()=>{
  if(!selected().length){el('attention-announcement').textContent='Selecione um sinal ou escolha Não encontrei o que sinto. Não selecionar sinais não indica que está tudo bem.';choices[0].focus();return;}
  update(false);el('attention-result-title').focus();
 };
 el('attention-other').onclick=()=>{
  // Preserve any selected urgent signs; this action must not downgrade them.
  other=true;update();el('attention-result-title').focus();
 };
 el('attention-prepare').onclick=()=>{
  const open=el('attention-preparation').hidden;el('attention-preparation').hidden=!open;
  el('attention-prepare').setAttribute('aria-expanded',String(open));
  if(open)el('attention-preparation-title').focus();
 };
 el('attention-build-report').onclick=()=>{
  const signs=selected().map(label);
  const lines=['Relato preparado pela própria usuária para o atendimento.','Estou grávida.'];
  lines.push(signs.length?'Sinais que informei: '+signs.join('; ')+'.':'Minha preocupação não está identificada na lista de sinais.');
  const started=el('attention-started').value.trim(),description=el('attention-description').value.trim();
  if(started)lines.push('Quando começou: '+started);
  if(description)lines.push('O que desejo relatar: '+description);
  lines.push('Este relato não é diagnóstico nem avaliação clínica.');
  el('attention-report').value=lines.join('\n');el('attention-report').focus();
  el('attention-announcement').textContent='Relato preparado somente nesta tela. Não foi enviado nem salvo.';
 };
 el('clear-attention').onclick=()=>reset(true);
 window.addEventListener('pagehide',()=>reset());
 window.addEventListener('pageshow',()=>reset());
 reset();
})();
