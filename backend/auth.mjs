import {scrypt,randomBytes,timingSafeEqual,createHash} from 'node:crypto';
import {promisify} from 'node:util';
const derive=promisify(scrypt),options={N:32768,r:8,p:3,maxmem:64*1024*1024};
export const tokenHash=t=>createHash('sha256').update(t).digest('hex');
export async function hashPassword(password){const salt=randomBytes(16).toString('hex');const key=await derive(password,salt,64,options);return `${salt}:${key.toString('hex')}`;}
export async function verifyPassword(password,hash){if(typeof hash!=='string'||!/^([a-f0-9]{32}):([a-f0-9]{128})$/.test(hash))return false;const [salt,key]=hash.split(':');const actual=await derive(password,salt,64,options);return timingSafeEqual(actual,Buffer.from(key,'hex'));}
export function registrationErrors(body={}){if(!body||typeof body!=='object'||Array.isArray(body))body={};const errors={};if(typeof body.name!=='string'||!body.name.trim()||body.name.trim().length>80)errors.name='Informe um nome com até 80 caracteres.';if(typeof body.email!=='string'||body.email.length>254||!/^\S+@[^\s@]+\.[^\s@]+$/.test(body.email))errors.email='Informe um e-mail válido.';if(typeof body.password!=='string'||body.password.length<15||body.password.length>128)errors.password='Use uma senha de 15 a 128 caracteres.';if(body.password!==body.confirmPassword)errors.confirmPassword='As senhas precisam ser iguais.';return errors;}
