export function registerActivity(app,pool,requireUser){
 app.get('/api/activity',requireUser,async(req,res)=>{
  const {rows}=await pool.query("SELECT id::text AS id,entity_type AS \"entityType\",entity_id AS \"entityId\",action,occurred_at AS \"occurredAt\" FROM activity_log WHERE owner_user_id=$1 ORDER BY occurred_at DESC,id DESC LIMIT 50",[req.user.id]);
  res.json({activities:rows});
 });
}
