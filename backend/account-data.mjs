import {verifyPassword} from './auth.mjs';

// Separate from password changes so the same session and origin protection apply.
export function registerAccountData(app,pool,requireUser,limiter,cookieName){
 app.post('/api/account/export',requireUser,limiter,async(req,res)=>{
  const password=req.body?.currentPassword;
  if(typeof password!=='string'||!password.length||password.length>128)
   return res.status(422).json({message:'Informe sua senha atual.'});
  const client=await pool.connect();
  try{
   await client.query('BEGIN ISOLATION LEVEL REPEATABLE READ READ ONLY');
   const {rows}=await client.query('SELECT id,name,email,created_at,password_hash FROM users WHERE id=$1',[req.user.id]);
   if(!rows[0]){await client.query('ROLLBACK');return res.status(401).json({message:'Entre novamente.'});}
   if(!await verifyPassword(password,rows[0].password_hash)){await client.query('ROLLBACK');return res.status(422).json({message:'Senha atual incorreta.'});}
   const profile=await client.query('SELECT dum,notes,updated_at FROM gestational_profiles WHERE user_id=$1',[req.user.id]);
   const events=await client.query('SELECT id,title,type,event_date,event_time,notes,done,reminder_days,reminder_seen,created_at,updated_at FROM gestational_events WHERE user_id=$1 ORDER BY event_date,event_time,id',[req.user.id]);
   const records=await client.query('SELECT id,type,value,record_date,notes,created_at,updated_at FROM gestational_records WHERE user_id=$1 ORDER BY record_date,id',[req.user.id]);
   const activity=await client.query('SELECT entity_type,entity_id,action,occurred_at FROM activity_log WHERE owner_user_id=$1 ORDER BY occurred_at,id',[req.user.id]);
   await client.query('COMMIT');
   const {id,name,email,created_at}=rows[0];
   res.set('Cache-Control','no-store');
   res.set('Content-Disposition','attachment; filename="gestarbem-dados.json"');
   res.json({schemaVersion:1,exportedAt:new Date().toISOString(),account:{id,name,email,created_at},profile:profile.rows[0]||null,events:events.rows,records:records.rows,activity:activity.rows});
  }catch(e){await client.query('ROLLBACK');throw e;}finally{client.release();}
 });
 app.post('/api/account/delete',requireUser,limiter,async(req,res)=>{
  const {currentPassword,confirmation}=req.body||{};
  if(typeof currentPassword!=='string'||!currentPassword.length||currentPassword.length>128||confirmation!=='EXCLUIR')
   return res.status(422).json({message:'Informe sua senha e digite EXCLUIR para confirmar.'});
  const client=await pool.connect();
  try{
   await client.query('BEGIN');
   const {rows}=await client.query('SELECT password_hash FROM users WHERE id=$1 FOR UPDATE',[req.user.id]);
   if(!rows[0]){await client.query('ROLLBACK');return res.status(401).json({message:'Entre novamente.'});}
   if(!await verifyPassword(currentPassword,rows[0].password_hash)){await client.query('ROLLBACK');return res.status(422).json({message:'Senha atual incorreta.'});}
   // Child deletions produce activity entries; purge this owner's history last.
   for(const table of ['gestational_events','gestational_records','gestational_profiles','sessions'])
    await client.query('DELETE FROM '+table+' WHERE user_id=$1',[req.user.id]);
   await client.query('DELETE FROM users WHERE id=$1',[req.user.id]);
   await client.query('DELETE FROM activity_log WHERE owner_user_id=$1',[req.user.id]);
   await client.query('COMMIT');
   res.clearCookie(cookieName,{httpOnly:true,secure:cookieName.startsWith('__Host-'),sameSite:'strict',path:'/'});
   res.json({message:'Conta e dados removidos do banco ativo. Cópias já exportadas e dados tratados pelos fornecedores não são apagados por esta operação.'});
  }catch(e){await client.query('ROLLBACK');throw e;}finally{client.release();}
 });
}
