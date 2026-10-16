export function registerActivity(app,pool,requireUser){
 app.get('/api/activity',requireUser,async(req,res)=>{
  const {rows}=await pool.query(`SELECT a.id::text AS id,a.entity_type AS "entityType",a.entity_id AS "entityId",a.action,a.occurred_at AS "occurredAt",
   CASE WHEN a.entity_type='record' AND r.id IS NOT NULL THEN r.type || ': ' || r.value
        WHEN a.entity_type='event' AND e.id IS NOT NULL THEN e.type || ': ' || e.title
        WHEN a.entity_type='profile' AND p.user_id IS NOT NULL THEN 'Perfil gestacional'
        ELSE NULL END AS "itemSummary",
   CASE WHEN a.entity_type='record' THEN to_char(r.record_date,'YYYY-MM-DD')
        WHEN a.entity_type='event' THEN to_char(e.event_date,'YYYY-MM-DD')
        ELSE NULL END AS "itemDate"
   FROM activity_log a
   LEFT JOIN gestational_records r ON a.entity_type='record' AND r.id=a.entity_id AND r.user_id=a.owner_user_id
   LEFT JOIN gestational_events e ON a.entity_type='event' AND e.id=a.entity_id AND e.user_id=a.owner_user_id
   LEFT JOIN gestational_profiles p ON a.entity_type='profile' AND p.user_id=a.entity_id AND p.user_id=a.owner_user_id
   WHERE a.owner_user_id=$1 ORDER BY a.occurred_at DESC,a.id DESC LIMIT 50`,[req.user.id]);
  res.json({activities:rows});
 });
}
