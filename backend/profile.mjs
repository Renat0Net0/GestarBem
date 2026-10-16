export function localDate(now=new Date()){return `${now.getFullYear()}-${String(now.getMonth()+1).padStart(2,'0')}-${String(now.getDate()).padStart(2,'0')}`;}
export function profileErrors(body,today=localDate()){
 const errors={};if(!body||typeof body!=='object'||Array.isArray(body))return {dum:'Envie uma data ou deixe o campo vazio.',notes:'Envie observações em texto.'};
 if(typeof body.dum!=='string')errors.dum='Informe uma data ou deixe o campo vazio.';
 else if(body.dum){const d=new Date(body.dum+'T12:00:00Z');if(!/^\d{4}-\d{2}-\d{2}$/.test(body.dum)||!Number.isFinite(d.getTime())||d.toISOString().slice(0,10)!==body.dum)errors.dum='Informe uma data válida.';else if(body.dum>today)errors.dum='A data não pode estar no futuro.';else if(body.dum<'1900-01-01')errors.dum='Confira o ano informado.';}
 if(typeof body.notes!=='string'||body.notes.length>1000)errors.notes='Use observações com até 1.000 caracteres.';
 return errors;
}
