'use strict';
(()=>{
 const el=id=>document.getElementById(id);
 const topics=[
  {
    "id": "enjoo",
    "title": "Enjoo leve",
    "source": "https://www.nhs.uk/pregnancy/common-symptoms/vomiting-and-morning-sickness/",
    "tips": [
      "Faça pequenas refeições mais frequentes.",
      "Evite cheiros e alimentos que desencadeiam o enjoo.",
      "Experimente água em pequenos goles ao longo do dia."
    ],
    "help": "Procure avaliação se os vômitos persistirem, houver perda de peso, urina muito escura, fraqueza ou dificuldade para manter líquidos. Não espere uma tentativa caseira se houver piora importante."
  },
  {
    "id": "azia",
    "title": "Azia leve",
    "source": "https://www.nhs.uk/pregnancy/common-symptoms/indigestion-and-heartburn/",
    "tips": [
      "Prefira porções menores e mais frequentes.",
      "Permaneça sentada com postura ereta durante e após comer.",
      "Evite comer nas três horas anteriores a dormir.",
      "Observe se alimentos gordurosos, picantes ou cafeína pioram o desconforto."
    ],
    "help": "Se persistir, houver dificuldade para engolir, perda de peso ou dor abdominal, procure sua equipe. Dor no peito ou dor forte abaixo das costelas não deve ser presumida como azia: busque atendimento imediatamente."
  },
  {
    "id": "constipacao",
    "title": "Intestino preso",
    "source": "https://www.nhs.uk/pregnancy/common-symptoms/common-health-problems/",
    "tips": [
      "Inclua frutas, verduras, feijão e cereais integrais nas refeições.",
      "Mantenha a hidratação, respeitando restrições individuais."
    ],
    "help": "Se persistir ou preocupar, converse com a equipe. Não interrompa ferro prescrito nem use laxantes por conta própria. Dor abdominal forte exige atendimento imediato."
  },
  {
    "id": "costas",
    "title": "Desconforto nas costas",
    "source": "https://www.nhs.uk/pregnancy/common-symptoms/back-pain/",
    "tips": [
      "Evite carregar objetos pesados.",
      "Ao abaixar, flexione os joelhos e mantenha as costas alinhadas.",
      "Apoie bem as costas ao sentar e reserve momentos de descanso."
    ],
    "help": "Dor nova nas costas no segundo ou terceiro trimestre precisa de orientação rápida da equipe. Procure atendimento se houver dor forte, febre, sangramento, dor ao urinar ou perda de sensibilidade nas pernas ou região íntima."
  },
  {
    "id": "cansaco",
    "title": "Cansaço cotidiano",
    "source": "https://www.nhs.uk/pregnancy/common-symptoms/tiredness/",
    "tips": [
      "Distribua as tarefas e aceite ajuda quando disponível.",
      "Faça pausas para descansar.",
      "Reserve tempo para dormir e mantenha refeições regulares."
    ],
    "help": "Cansaço súbito ou muito intenso, diferente do habitual, precisa de avaliação. Se vier com falta de ar, dor no peito ou desmaio, procure atendimento imediatamente."
  },
  {
    "id": "sono",
    "title": "Dificuldade para dormir",
    "source": "https://www.nhs.uk/pregnancy/common-symptoms/tiredness/",
    "tips": [
      "Tente uma rotina tranquila antes de dormir.",
      "Evite bebidas com cafeína à noite.",
      "Use travesseiros para apoiar a barriga e entre os joelhos.",
      "Após 28 semanas, procure iniciar o sono de lado; se acordar de costas, volte para o lado."
    ],
    "help": "Converse com a equipe se a falta de sono persistir ou afetar sua rotina, especialmente com tristeza persistente ou perda de interesse pelas atividades."
  },
  {
    "id": "hemorroidas",
    "title": "Desconforto por hemorroidas já identificadas",
    "source": "https://www.nhs.uk/pregnancy/common-symptoms/piles/",
    "tips": [
      "Evite fazer força para evacuar.",
      "Use higiene delicada, sem esfregar a região.",
      "Um pano limpo umedecido em água fria pode aliviar o desconforto local.",
      "Fibras e água ajudam a manter as fezes macias."
    ],
    "help": "Sangramento novo ou sem causa conhecida deve ser avaliado; não atribua automaticamente a hemorroidas. Se não souber se o sangue é vaginal, procure atendimento. Pomadas precisam de orientação profissional."
  },
  {
    "id": "calor",
    "title": "Sensação de calor sem febre",
    "source": "https://www.nhs.uk/pregnancy/common-symptoms/common-health-problems/",
    "tips": [
      "Use roupas leves e folgadas.",
      "Mantenha o ambiente ventilado."
    ],
    "help": "Não confunda sensação de calor com febre. Temperatura de 38 °C ou mais exige avaliação imediata, assim como mal-estar importante."
  },
  {
    "id": "caibras",
    "title": "Cãibras ocasionais nos pés ou panturrilhas",
    "source": "https://www.nhs.uk/pregnancy/common-symptoms/common-health-problems/",
    "tips": [
      "Movimente suavemente os tornozelos, se estiver confortável e sem restrição da equipe.",
      "Durante uma cãibra habitual, um alongamento suave do pé em direção à canela pode ajudar."
    ],
    "help": "Dor persistente em uma perna, com inchaço, vermelhidão ou calor local precisa de atendimento imediato; não trate como cãibra nem massageie a região."
  },
  {
    "id": "inchaco",
    "title": "Inchaço gradual nos dois pés ou tornozelos",
    "source": "https://www.nhs.uk/pregnancy/common-symptoms/swollen-ankles-feet-and-fingers/",
    "tips": [
      "Evite ficar muito tempo em pé.",
      "Descanse com os pés apoiados em posição elevada.",
      "Escolha calçados confortáveis e meias que não apertem."
    ],
    "help": "Inchaço súbito, especialmente no rosto ou nas mãos, dor de cabeça forte ou alterações visuais exigem atendimento imediato. Inchaço doloroso em uma perna também precisa de avaliação urgente."
  }
];
 const select=el('symptom-care-topic'),panel=el('symptom-care-content'),blocked=el('symptom-care-blocked');
 for(const topic of topics){const opt=document.createElement('option');opt.value=topic.id;opt.textContent=topic.title;select.append(opt);}
 function update(){
  const urgent=[...el('symptom-signs').querySelectorAll('input[type="checkbox"]')].some(c=>c.checked);
  const isSymptom=el('e-type').value==='Sintoma';
  blocked.hidden=!urgent||!isSymptom;
  panel.replaceChildren();panel.hidden=true;
  if(urgent||!isSymptom)return;
  const topic=topics.find(t=>t.id===select.value);if(!topic)return;
  const heading=document.createElement('h4');heading.textContent=topic.title;
  const list=document.createElement('ul');
  for(const tip of topic.tips){const li=document.createElement('li');li.textContent=tip;list.append(li);}
  const help=document.createElement('p');help.textContent='Quando buscar orientação: '+topic.help;
  const source=document.createElement('a');source.href=topic.source;source.textContent='Fonte: NHS (em inglês, nova aba)';source.target='_blank';source.rel='noopener noreferrer';
  panel.append(heading,list,help,source);panel.hidden=false;
 }
 select.addEventListener('change',update);
 el('symptom-signs').addEventListener('change',update);
 function reset(){select.value='';panel.replaceChildren();panel.hidden=true;blocked.hidden=true;}
 el('e-type').addEventListener('change',reset);
 el('event-dialog').addEventListener('close',reset);
 window.addEventListener('pagehide',reset);window.addEventListener('pageshow',reset);
 reset();
})();
