import test from 'node:test';
import assert from 'node:assert/strict';
import pg from 'pg';
import {registerActivity} from './activity.mjs';

test('histórico com PostgreSQL real em tabelas temporárias',async t=>{
 assert.ok(process.env.DATABASE_URL,'Configure DATABASE_URL no .env.');
 const client=new pg.Client({connectionString:process.env.DATABASE_URL,connectionTimeoutMillis:5000});
 await client.connect();
 try{
  await client.query('BEGIN');
  await client.query('SET LOCAL search_path TO pg_temp, pg_catalog');
  await client.query(`
   CREATE TEMP TABLE activity_log (
    id bigint GENERATED ALWAYS AS IDENTITY,owner_user_id uuid,entity_type text,
    entity_id uuid,action text,occurred_at timestamptz
   ) ON COMMIT DROP;
   CREATE TEMP TABLE gestational_records (id uuid,user_id uuid,type text,value text,record_date date) ON COMMIT DROP;
   CREATE TEMP TABLE gestational_events (id uuid,user_id uuid,type text,title text,event_date date) ON COMMIT DROP;
   CREATE TEMP TABLE gestational_profiles (user_id uuid) ON COMMIT DROP;
  `);
  const a='00000000-0000-4000-8000-000000000001',b='00000000-0000-4000-8000-000000000002';
  const record='00000000-0000-4000-8000-000000000003',event='00000000-0000-4000-8000-000000000004';
  const missing='00000000-0000-4000-8000-000000000005';
  await client.query('INSERT INTO gestational_records VALUES ($1,$2,$3,$4,$5)',[record,b,'Peso','70 kg','2026-10-12']);
  await client.query('INSERT INTO gestational_events VALUES ($1,$2,$3,$4,$5)',[event,a,'Consulta','Consulta fictícia A','2026-10-12']);
  await client.query('INSERT INTO gestational_profiles VALUES ($1),($2)',[a,b]);
  for(const [owner,type,id,action] of [[a,'record',record,'updated'],[a,'event',event,'created'],[a,'profile',a,'updated'],[a,'record',missing,'deleted'],[b,'record',record,'created']]){
   await client.query("INSERT INTO activity_log(owner_user_id,entity_type,entity_id,action,occurred_at) VALUES($1,$2,$3,$4,'2026-10-12T12:00:00Z')",[owner,type,id,action]);
  }
  let handler;function guard(){}
  registerActivity({get(path,middleware,fn){assert.equal(path,'/api/activity');assert.equal(middleware,guard);handler=fn;}},client,guard);
  async function read(owner,extra={}){
   let payload;await handler({user:{id:owner},query:{owner_user_id:b},body:{user_id:b},...extra},{json(value){payload=value;}});
   return payload.activities;
  }
  await t.test('cada conta recebe apenas suas atividades; identidade enviada é ignorada',async()=>{
   const ar=await read(a),br=await read(b);
   assert.equal(ar.length,4);assert.equal(br.length,1);
   assert.equal(br[0].itemSummary,'Peso: 70 kg');
   assert.equal(ar.some(row=>row.id===br[0].id),false);
  });
  await t.test('itens de outra conta e itens excluídos não revelam descrição ou data',async()=>{
   const rows=await read(a);
   const foreign=rows.find(row=>row.entityId===record),deleted=rows.find(row=>row.entityId===missing);
   assert.equal(foreign.itemSummary,null);assert.equal(foreign.itemDate,null);
   assert.equal(deleted.itemSummary,null);assert.equal(deleted.itemDate,null);
   assert.equal(deleted.action,'deleted');
   assert.equal(rows.find(row=>row.entityId===event).itemSummary,'Consulta: Consulta fictícia A');
   assert.equal(rows.find(row=>row.entityType==='profile').itemSummary,'Perfil gestacional');
  });
  await t.test('limita a 50 e desempata datas iguais pela atividade mais recente',async()=>{
   await client.query("INSERT INTO activity_log(owner_user_id,entity_type,entity_id,action,occurred_at) SELECT $1,'profile',$1,'updated','2026-10-13T12:00:00Z' FROM generate_series(1,55)",[a]);
   const rows=await read(a);
   assert.equal(rows.length,50);assert.equal(rows.every(row=>row.entityType==='profile'),true);
   for(let i=1;i<rows.length;i++)assert.ok(BigInt(rows[i-1].id)>BigInt(rows[i].id));
   assert.equal((await read(b)).length,1);
  });
 }finally{
  try{await client.query('ROLLBACK');}finally{await client.end();}
 }
});
