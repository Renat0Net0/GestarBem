import {randomUUID} from 'node:crypto';
export const eventTypes=['Consulta','Exame','Vacinação','Medicamento','Medição','Outra atividade'];
export function eventErrors(body){
 if(!body||typeof body!=='object'||Array.isArray(body))return {title:'Preencha os dados do compromisso.'};const errors={};
 if(typeof body.title!=='string'||!body.title.trim()||body.title.trim().length>100)errors.title='Informe um título de até 100 caracteres.';
 if(!eventTypes.includes(body.type))errors.type='Escolha um tipo da lista.';
 const d=typeof body.date==='string'?new Date(body.date+'T12:00:00Z'):new Date(NaN);
 if(typeof body.date!=='string'||!/^\d{4}-\d{2}-\d{2}$/.test(body.date)||!Number.isFinite(d.getTime())||d.toISOString().slice(0,10)!==body.date||body.date<'1900-01-01'||body.date>'2100-12-31')errors.date='Informe uma data válida entre 1900 e 2100.';
 if(typeof body.time!=='string'||!/^([01]\d|2[0-3]):[0-5]\d$/.test(body.time))errors.time='Informe um horário válido.';
 if(typeof body.notes!=='string'||body.notes.length>1000)errors.notes='Use até 1.000 caracteres.';
 if(typeof body.done!=='boolean')errors.done='Informe um estado válido.';return errors;
}
const columns="id,title,type,to_char(event_date,'YYYY-MM-DD') AS date,to_char(event_time,'HH24:MI') AS time,notes,done";
export function registerAgenda(app,pool,requireUser){
 app.use('/api/events',requireUser);
 app.param('eventId',(req,res,next,id)=>{if(!/^[a-f0-9]{8}-[a-f0-9]{4}-[a-f0-9]{4}-[a-f0-9]{4}-[a-f0-9]{12}$/i.test(id))return res.status(400).json({message:'Identificador inválido.'});next();});
 app.get('/api/events',async(req,res)=>{const {rows}=await pool.query(`SELECT ${columns} FROM gestational_events WHERE user_id=$1 ORDER BY event_date,event_time,id`,[req.user.id]);res.json({events:rows});});
 app.post('/api/events',async(req,res)=>{const errors=eventErrors(req.body);if(Object.keys(errors).length)return res.status(422).json({message:'Revise os campos indicados.',errors});const b=req.body;const {rows}=await pool.query(`INSERT INTO gestational_events(id,user_id,title,type,event_date,event_time,notes,done) VALUES($1,$2,$3,$4,$5,$6,$7,$8) RETURNING ${columns}`,[randomUUID(),req.user.id,b.title.trim(),b.type,b.date,b.time,b.notes,b.done]);res.status(201).json({event:rows[0]});});
 app.put('/api/events/:eventId',async(req,res)=>{const errors=eventErrors(req.body);if(Object.keys(errors).length)return res.status(422).json({message:'Revise os campos indicados.',errors});const b=req.body;const {rows}=await pool.query(`UPDATE gestational_events SET title=$1,type=$2,event_date=$3,event_time=$4,notes=$5,done=$6,updated_at=now() WHERE id=$7 AND user_id=$8 RETURNING ${columns}`,[b.title.trim(),b.type,b.date,b.time,b.notes,b.done,req.params.eventId,req.user.id]);if(!rows[0])return res.status(404).json({message:'Compromisso não encontrado.'});res.json({event:rows[0]});});
 app.delete('/api/events/:eventId',async(req,res)=>{const {rowCount}=await pool.query('DELETE FROM gestational_events WHERE id=$1 AND user_id=$2',[req.params.eventId,req.user.id]);if(!rowCount)return res.status(404).json({message:'Compromisso não encontrado.'});res.sendStatus(204);});
}
