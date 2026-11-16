import {agendaToday} from './agenda.mjs';
export function registerReminders(app,pool,requireUser){
 app.use('/api/reminders',requireUser);
 app.param('reminderId',(req,res,next,id)=>{if(!/^[a-f0-9]{8}-[a-f0-9]{4}-[a-f0-9]{4}-[a-f0-9]{4}-[a-f0-9]{12}$/i.test(id))return res.status(400).json({message:'Identificador inválido.'});next();});
 app.get('/api/reminders',async(req,res)=>{const {rows}=await pool.query("SELECT id,title,type,to_char(event_date,'YYYY-MM-DD') AS date,to_char(event_time,'HH24:MI') AS time,reminder_days AS \"reminderDays\" FROM gestational_events WHERE user_id=$1 AND NOT done AND NOT reminder_seen AND reminder_days IS NOT NULL AND event_date >= $2::date AND event_date-reminder_days::integer <= $2::date ORDER BY event_date,event_time,id",[req.user.id,agendaToday()]);res.json({reminders:rows});});
 app.post('/api/reminders/:reminderId/seen',async(req,res)=>{const {rowCount}=await pool.query('UPDATE gestational_events SET reminder_seen=true WHERE id=$1 AND user_id=$2 AND reminder_days IS NOT NULL AND NOT done',[req.params.reminderId,req.user.id]);if(!rowCount)return res.status(404).json({message:'Lembrete não encontrado.'});res.sendStatus(204);});
}
