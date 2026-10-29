import test from 'node:test';
import assert from 'node:assert/strict';
import {registerAccountData} from './account-data.mjs';
import {hashPassword} from './auth.mjs';
const hash=await hashPassword('senha123');
function fixture({fail=false,missing=false}={}){
 const calls=[],routes={};let released=false,cleared=false;
 const client={async query(sql,args){
  calls.push({sql,args});
  if(sql.startsWith('SELECT')&&sql.includes('FROM users'))return {rows:missing?[]:[{id:'A',name:'Ana',email:'ana@example.test',password_hash:hash}]};
  if(fail&&sql.startsWith('DELETE FROM users'))throw new Error('db');
  return {rows:[]};
 },release(){released=true;}};
 const guard=()=>{},limit=()=>{};
 registerAccountData({post(path,g,l,fn){assert.equal(g,guard);assert.equal(l,limit);routes[path]=fn;}},{connect:async()=>client},guard,limit,'__Host-gestarbem_session');
 const res={code:200,status(c){this.code=c;return this;},json(b){this.body=b;return this;},set(){},clearCookie(_n,o){assert.equal(o.secure,true);cleared=true;}};
 return {calls,res,run:async(action,body)=>routes['/api/account/'+action]({user:{id:'A'},body},res),get released(){return released;},get cleared(){return cleared;}};
}
test('exclusão exige confirmação e senha antes de acessar o banco',async()=>{
 const f=fixture();await f.run('delete',{currentPassword:'senha123',confirmation:'sim'});
 assert.equal(f.res.code,422);assert.equal(f.calls.length,0);
});
test('senha incorreta faz rollback e preserva os dados',async()=>{
 const f=fixture();await f.run('delete',{currentPassword:'errada',confirmation:'EXCLUIR'});
 assert.equal(f.res.code,422);assert.equal(f.calls.at(-1).sql,'ROLLBACK');assert.equal(f.calls.some(c=>c.sql.startsWith('DELETE')),false);assert.ok(f.released);
});
test('exclusão usa apenas conta autenticada e limpa atividade após gatilhos',async()=>{
 const f=fixture();await f.run('delete',{currentPassword:'senha123',confirmation:'EXCLUIR',user_id:'B'});
 assert.equal(f.res.code,200);assert.equal(f.calls.at(-1).sql,'COMMIT');
 for(const c of f.calls.filter(c=>c.args))assert.deepEqual(c.args,['A']);
 assert.match(f.calls.at(-2).sql,/DELETE FROM activity_log/);assert.ok(f.cleared);assert.ok(f.released);
});
test('falha no banco não confirma exclusão nem remove cookie',async()=>{
 const f=fixture({fail:true});await assert.rejects(f.run('delete',{currentPassword:'senha123',confirmation:'EXCLUIR'}));
 assert.equal(f.calls.at(-1).sql,'ROLLBACK');assert.equal(f.cleared,false);assert.ok(f.released);
});
test('exportação exige senha e exclui credenciais e sessões',async()=>{
 const f=fixture();await f.run('export',{currentPassword:'senha123',user_id:'B'});
 assert.equal(f.res.code,200);assert.equal(f.res.body.account.id,'A');
 assert.equal(JSON.stringify(f.res.body).includes(hash),false);
 assert.equal(f.calls.some(c=>c.sql.includes('FROM sessions')),false);
 for(const c of f.calls.filter(c=>c.args))assert.deepEqual(c.args,['A']);
 assert.equal(f.calls.at(-1).sql,'COMMIT');assert.ok(f.released);
});
test('conta ausente retorna 401 sem excluir nada',async()=>{
 const f=fixture({missing:true});await f.run('delete',{currentPassword:'senha123',confirmation:'EXCLUIR'});
 assert.equal(f.res.code,401);assert.equal(f.calls.at(-1).sql,'ROLLBACK');
});
