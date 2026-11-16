import test from 'node:test';import assert from 'node:assert/strict';import {profileErrors} from './profile.mjs';
const check=body=>profileErrors(body,'2026-10-10');
test('perfil aceita campos opcionais vazios e dia bissexto válido',()=>{assert.deepEqual(check({dum:'',notes:''}),{});assert.deepEqual(check({dum:'2024-02-29',notes:'Observação fictícia'}),{});});
test('perfil rejeita data impossível, formato incorreto e futuro',()=>{for(const dum of ['2026-02-29','2026-04-31','10/10/2026','2026-10-11','1899-12-31'])assert.ok(check({dum,notes:''}).dum);});
test('perfil rejeita corpo e campos malformados e observação excessiva',()=>{for(const body of [null,[],42,{}, {dum:2026,notes:null}])assert.ok(Object.keys(check(body)).length);assert.ok(check({dum:'',notes:'x'.repeat(1001)}).notes);assert.deepEqual(check({dum:'',notes:'x'.repeat(1000)}),{});});
