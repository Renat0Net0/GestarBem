export function manausToday(now=new Date()){
 return new Intl.DateTimeFormat('en-CA',{timeZone:'America/Manaus',year:'numeric',month:'2-digit',day:'2-digit'}).format(now);
}
function dateString(value){return typeof value==='string'&&/^\d{4}-\d{2}-\d{2}$/.test(value)?value:null;}
const text=(value,max)=>typeof value==='string'?value.slice(0,max):'';
export async function loadAssistantContext(pool,owner,today=manausToday()){
 const [profile,events,records]=await Promise.all([
 pool.query("SELECT to_char(dum,'YYYY-MM-DD') AS dum FROM gestational_profiles WHERE user_id=$1",[owner]),
 pool.query("SELECT title,type,to_char(event_date,'YYYY-MM-DD') AS date,to_char(event_time,'HH24:MI') AS time FROM gestational_events WHERE user_id=$1 AND NOT done AND event_date >= $2::date ORDER BY event_date,event_time,id LIMIT 8",[owner,today]),
 pool.query("SELECT type,value,to_char(record_date,'YYYY-MM-DD') AS date FROM gestational_records WHERE user_id=$1 ORDER BY record_date DESC,created_at DESC,id LIMIT 12",[owner])
 ]);
 const dum=dateString(profile.rows[0]?.dum),days=dum?Math.floor((Date.parse(today+'T12:00:00Z')-Date.parse(dum+'T12:00:00Z'))/86400000):NaN;
 return {asOf:today,dum,estimatedWeeks:Number.isFinite(days)&&days>=0&&days<=315?Math.floor(days/7):null,estimateNotice:'Estimativa por calendário, não datação clínica.',
 upcomingEvents:events.rows.slice(0,8).map(e=>({title:text(e.title,100),type:text(e.type,40),date:dateString(e.date),time:text(e.time,5)})),
 recentRecords:records.rows.slice(0,12).map(r=>({type:text(r.type,40),value:text(r.value,200),date:dateString(r.date)})),
 limitations:'Somente próximos 8 compromissos abertos e últimos 12 registros. Ausência de um item aqui não comprova ausência no acompanhamento. Valores são declarados, sem avaliação clínica.'};
}
