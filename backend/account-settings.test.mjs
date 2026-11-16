import test from 'node:test';
import assert from 'node:assert/strict';
import {passwordChangeErrors,registerAccountSettings} from './account-settings.mjs';
import {hashPassword,verifyPassword} from './auth.mjs';

const valid={currentPassword:'antiga123',newPassword:'nova12',confirmPassword:'nova12'};
test('troca aceita 6 e 128 caracteres e rejeita limites, confirmação e senha repetida',()=>{
 for(const length of [5,6,128,129]){
  const password='x'.repeat(length);
  assert.equal(Boolean(passwordChangeErrors({...valid,newPassword:password,confirmPassword:password}).newPassword),length<6||length>128);
 }
 assert.ok(passwordChangeErrors({...valid,confirmPassword:'outra'}).confirmPassword);
 assert.ok(passwordChangeErrors({...valid,newPassword:valid.currentPassword,confirmPassword:valid.currentPassword}).newPassword);
 for(const body of [null,[],42,{}])assert.ok(passwordChangeErrors(body).currentPassword);
});

const oldHash=await hashPassword(valid.currentPassword);
function fixture({missing=false,failDelete=false}={}){
 const calls=[];let released=false,handler;
 const client={async query(sql,params){
  calls.push({sql,params});
  if(sql.startsWith('SELECT'))return {rows:missing?[]:[{password_hash:oldHash}]};
  if(failDelete&&sql.startsWith('DELETE'))throw new Error('falha simulada');
  return {rows:[]};
 },release(){released=true;}};
 function guard(){} function limiter(){}
 const app={post(path,...handlers){
  assert.equal(path,'/api/account/password');
  assert.equal(handlers[0],guard);assert.equal(handlers[1],limiter);
  handler=handlers[2];
 }};
 registerAccountSettings(app,{async connect(){return client;}},guard,limiter,'gb_session');
 const response={statusCode:200,body:null,cookie:null,status(code){this.statusCode=code;return this;},json(body){this.body=body;return this;},clearCookie(name,options){this.cookie={name,options};}};
 return {calls,response,run(body=valid){return handler({user:{id:'conta-A'},body},response);},get released(){return released;}};
}
test('senha atual incorreta faz rollback sem alterar senha ou sessões',async()=>{
 const f=fixture();await f.run({...valid,currentPassword:'incorreta'});
 assert.equal(f.response.statusCode,422);assert.ok(f.response.body.errors.currentPassword);
 assert.deepEqual(f.calls.map(x=>x.sql.split(' ')[0]),['BEGIN','SELECT','ROLLBACK']);
 assert.equal(f.response.cookie,null);assert.equal(f.released,true);
});
test('troca válida usa conta da sessão, grava hash e invalida todas as suas sessões após atualização',async()=>{
 const f=fixture();await f.run({...valid,user_id:'conta-B'});
 assert.deepEqual(f.calls.map(x=>x.sql.split(' ')[0]),['BEGIN','SELECT','UPDATE','DELETE','COMMIT']);
 assert.deepEqual(f.calls[1].params,['conta-A']);
 assert.equal(f.calls[2].params[1],'conta-A');
 assert.notEqual(f.calls[2].params[0],valid.newPassword);
 assert.equal(await verifyPassword(valid.newPassword,f.calls[2].params[0]),true);
 assert.equal(await verifyPassword(valid.currentPassword,f.calls[2].params[0]),false);
 assert.match(f.calls[3].sql,/DELETE FROM sessions WHERE user_id=\$1/);
 assert.deepEqual(f.calls[3].params,['conta-A']);
 assert.equal(f.response.statusCode,200);assert.equal(f.response.cookie.name,'gb_session');
 assert.equal(f.response.cookie.options.httpOnly,true);assert.equal(f.released,true);
});
test('falha ao invalidar sessões faz rollback sem sucesso ou limpeza de cookie',async()=>{
 const f=fixture({failDelete:true});
 await assert.rejects(f.run(),/falha simulada/);
 assert.equal(f.calls.at(-1).sql,'ROLLBACK');
 assert.equal(f.calls.some(x=>x.sql==='COMMIT'),false);
 assert.equal(f.response.body,null);assert.equal(f.response.cookie,null);assert.equal(f.released,true);
});
test('conta removida retorna 401 e libera conexão sem atualizar dados',async()=>{
 const f=fixture({missing:true});await f.run();
 assert.equal(f.response.statusCode,401);
 assert.deepEqual(f.calls.map(x=>x.sql.split(' ')[0]),['BEGIN','SELECT','ROLLBACK']);
 assert.equal(f.released,true);
});
test('campos inválidos são rejeitados antes de acessar o banco',async()=>{
 const f=fixture();await f.run({...valid,newPassword:'curta'});
 assert.equal(f.response.statusCode,422);assert.deepEqual(f.calls,[]);
});
