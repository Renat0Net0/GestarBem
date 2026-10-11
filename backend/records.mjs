import {randomUUID} from 'node:crypto';
import {agendaToday} from './agenda.mjs';
export const recordTypes=['Peso','Pressão arterial','Sintoma','Medicamento','Consulta realizada','Exame realizado','Vacina','Observação'];
export function recordErrors(body,today=agendaToday()){
 if(!body||typeof body!=='object'||Array.isArray(body))return {value:'Preencha os dados do registro.'};const errors={};
 if(typeof body.value!=='string'||!body.value.trim()||body.value.length>200)errors.value='Informe uma descrição ou valor com unidade de até 200 caracteres.';
 if(!recordTypes.includes(body.type))errors.type='Escolha um tipo da lista.';
 const d=typeof body.date==='string'?new Date(body.date+'T12:00:00Z'):new Date(NaN);
 if(typeof body.date!=='string'||!/^\d{4}-\d{2}-\d{2}$/.test(body.date)||!Number.isFinite(d.getTime())||d.toISOString().slice(0,10)!==body.date||body.date<'1900-01-01')errors.date='Informe uma data válida a partir de 1900.';
 else if(body.date>today)errors.date='A data do registro não pode estar no futuro.';
 if(typeof body.notes!=='string'||body.notes.length>1000)errors.notes='Use até 1.000 caracteres.';return errors;
}
const columns="id,value,type,to_char(record_date,'YYYY-MM-DD') AS date,notes";
export function registerRecords(app,pool,requireUser){
 app.use('/api/records',requireUser);
 app.param('recordId',(req,res,next,id)=>{if(!/^[a-f0-9]{8}-[a-f0-9]{4}-[a-f0-9]{4}-[a-f0-9]{4}-[a-f0-9]{12}$/i.test(id))return res.status(400).json({message:'Identificador inválido.'});next();});
 app.get('/api/records',async(req,res)=>{const {rows}=await pool.query(`SELECT ${columns} FROM gestational_records WHERE user_id=$1 ORDER BY record_date DESC,created_at DESC,id`,[req.user.id]);res.json({records:rows});});
 app.post('/api/records',async(req,res)=>{const errors=recordErrors(req.body);if(Object.keys(errors).length)return res.status(422).json({message:'Revise os campos indicados.',errors});const b=req.body;const {rows}=await pool.query(`INSERT INTO gestational_records(id,user_id,value,type,record_date,notes) VALUES($1,$2,$3,$4,$5,$6) RETURNING ${columns}`,[randomUUID(),req.user.id,b.value.trim(),b.type,b.date,b.notes]);res.status(201).json({record:rows[0]});});
 app.put('/api/records/:recordId',async(req,res)=>{const errors=recordErrors(req.body);if(Object.keys(errors).length)return res.status(422).json({message:'Revise os campos indicados.',errors});const b=req.body;const {rows}=await pool.query(`UPDATE gestational_records SET value=$1,type=$2,record_date=$3,notes=$4,updated_at=now() WHERE id=$5 AND user_id=$6 RETURNING ${columns}`,[b.value.trim(),b.type,b.date,b.notes,req.params.recordId,req.user.id]);if(!rows[0])return res.status(404).json({message:'Registro não encontrado.'});res.json({record:rows[0]});});
 app.delete('/api/records/:recordId',async(req,res)=>{const {rowCount}=await pool.query('DELETE FROM gestational_records WHERE id=$1 AND user_id=$2',[req.params.recordId,req.user.id]);if(!rowCount)return res.status(404).json({message:'Registro não encontrado.'});res.sendStatus(204);});
}
