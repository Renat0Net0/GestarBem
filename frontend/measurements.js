'use strict';
(()=>{
 const el=id=>document.getElementById(id);let records=[],type='Peso';
 function parsedRecords(items,kind){
  return items.filter(r=>r.type===kind).map(r=>{
   const match=kind==='Peso'?String(r.value).match(/^([0-9]+(?:[.,][0-9]{1,2})?)\s*kg$/i):String(r.value).match(/^([0-9]{1,3})\s*\/\s*([0-9]{1,3})\s*mmHg$/i);
   if(!match)return null;const values=match.slice(1).map(v=>Number(v.replace(',','.')));
   if(values.some(v=>!Number.isFinite(v)||v<=0))return null;
   return {...r,values};
  }).filter(Boolean).sort((a,b)=>a.date.localeCompare(b.date)||String(a.id).localeCompare(String(b.id)));
 }
 function text(tag,value){const node=document.createElement(tag);node.textContent=value;return node;}
 function svgNode(tag,attrs={},content){const node=document.createElementNS('http://www.w3.org/2000/svg',tag);for(const [k,v]of Object.entries(attrs))node.setAttribute(k,String(v));if(content!==undefined)node.textContent=content;return node;}
 function render(){
  const all=parsedRecords(records,type),data=all.slice(-30),invalid=records.filter(r=>r.type===type).length-all.length;
  const pressure=type==='Pressão arterial',unit=pressure?'mmHg':'kg',series=pressure?['Sistólica','Diastólica']:['Peso'];
  el('chart-weight').setAttribute('aria-pressed',String(!pressure));el('chart-pressure').setAttribute('aria-pressed',String(pressure));
  el('measurements-section').hidden=false;el('measurements-plot').replaceChildren();el('measurements-table').replaceChildren();
  el('measurements-figure').hidden=!data.length;el('measurements-details').hidden=!data.length;
  el('measurements-status').textContent=(data.length?'Exibindo '+data.length+' de '+all.length+' medição(ões) de '+type+'.':'Nenhuma medição de '+type+' disponível para o gráfico.')+(invalid?' '+invalid+' registro(s) com formato não reconhecido; confira os valores na lista.':'');
  if(!data.length)return;
  const svg=svgNode('svg',{viewBox:'0 0 640 280',role:'img','aria-labelledby':'measurement-svg-title measurement-svg-desc'});
  svg.append(svgNode('title',{id:'measurement-svg-title'},'Histórico de '+type+' em '+unit),svgNode('desc',{id:'measurement-svg-desc'},'Medições em ordem de data. Consulte os valores completos na tabela abaixo. Sem limites clínicos ou avaliação de risco.'));
  const values=data.flatMap(r=>r.values),low=Math.min(...values),high=Math.max(...values),padding=Math.max((high-low)*0.15,1),min=Math.max(0,low-padding),max=high+padding;
  const x=i=>data.length===1?335:60+i*550/(data.length-1),y=v=>220-(v-min)*170/(max-min);
  for(let i=0;i<=4;i++){const value=min+(max-min)*i/4,py=y(value);svg.append(svgNode('line',{x1:60,x2:610,y1:py,y2:py,stroke:'#ddd'}),svgNode('text',{x:52,y:py+4,'text-anchor':'end','font-size':12,fill:'#392d46'},new Intl.NumberFormat('pt-BR',{maximumFractionDigits:1}).format(value)));}
  const colors=['#74325c','#493c95'];
  series.forEach((name,k)=>{if(data.length>1)svg.append(svgNode('polyline',{points:data.map((r,i)=>x(i)+','+y(r.values[k])).join(' '),fill:'none',stroke:colors[k],'stroke-width':2,'stroke-dasharray':k?'6 4':'none'}));data.forEach((r,i)=>{const circle=svgNode('circle',{cx:x(i),cy:y(r.values[k]),r:4,fill:colors[k]});circle.append(svgNode('title',{},name+': '+r.values[k]+' '+unit+' em '+r.date.split('-').reverse().join('/')));svg.append(circle);});svg.append(svgNode('text',{x:60+k*230,y:25,'font-size':14,fill:colors[k]},name+' ('+unit+')'+(k?' — linha tracejada':'')));});
  for(const i of [...new Set([0,Math.floor((data.length-1)/2),data.length-1])])svg.append(svgNode('text',{x:x(i),y:248,'text-anchor':'middle','font-size':12,fill:'#392d46'},data[i].date.split('-').reverse().join('/')));
  el('measurements-plot').append(svg);
  el('measurements-caption').textContent='Cada ponto representa uma medição, em ordem de data. Os espaços entre os pontos são iguais e não representam o intervalo de tempo. Medições do mesmo dia aparecem separadas; sua ordem dentro do dia não indica horário.';
  const table=el('measurements-table');table.append(text('caption','Valores de '+type+' apresentados no gráfico'));
  const head=document.createElement('thead'),row=document.createElement('tr');
  for(const label of ['Data',...series.map(name=>name+' ('+unit+')')]){const cell=text('th',label);cell.scope='col';row.append(cell);}head.append(row);table.append(head);
  const body=document.createElement('tbody');for(const item of data){const tr=document.createElement('tr');tr.append(text('td',item.date.split('-').reverse().join('/')));for(const value of item.values)tr.append(text('td',new Intl.NumberFormat('pt-BR',{maximumFractionDigits:2}).format(value)));body.append(tr);}table.append(body);
 }
 window.addEventListener('gestarbem:measurements',event=>{records=Array.isArray(event.detail)?event.detail:[];render();});
 for(const [id,kind]of [['chart-weight','Peso'],['chart-pressure','Pressão arterial']])el(id).onclick=()=>{type=kind;render();};
})();
