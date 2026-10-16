
'use strict';
(()=>{
 const options=document.getElementById('attention-options');
 const choices=[...options.querySelectorAll('input[type="checkbox"]')];
 const result=document.getElementById('attention-result');
 const list=document.getElementById('attention-selected');
 const announcement=document.getElementById('attention-announcement');
 const clear=document.getElementById('clear-attention');
 function update(){
  const selected=choices.filter(choice=>choice.checked);
  list.replaceChildren();
  for(const choice of selected){const item=document.createElement('li');item.textContent=choice.closest('label').querySelector('span').textContent;list.append(item);}
  result.hidden=selected.length===0;
  clear.hidden=selected.length===0;
  announcement.textContent=selected.length?`${selected.length} sinal(is) selecionado(s). Procure atendimento de saúde imediatamente. Informe que está grávida e descreva o que está sentindo.`:'Nenhum sinal selecionado. A lista não avalia seu estado de saúde.';
 }
 options.addEventListener('change',update);
 clear.addEventListener('click',()=>{for(const choice of choices)choice.checked=false;update();choices[0].focus();});
 // Reset restored form values; this consultation concerns the current moment.
 window.addEventListener('pageshow',()=>{for(const choice of choices)choice.checked=false;update();});
 update();
})();
