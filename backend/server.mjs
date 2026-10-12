import express from 'express';
import helmet from 'helmet';
import {rateLimit} from 'express-rate-limit';
import pg from 'pg';
import {randomUUID,randomBytes} from 'node:crypto';
import {fileURLToPath} from 'node:url';
import {hashPassword,verifyPassword,registrationErrors,tokenHash} from './auth.mjs';
import {registerActivity} from './activity.mjs';
import {registerReminders} from './reminders.mjs';
import {registerRecords} from './records.mjs';
import {registerAgenda} from './agenda.mjs';
import {profileErrors} from './profile.mjs';
const production=process.env.NODE_ENV==='production';
if(!process.env.DATABASE_URL)throw new Error('Configure DATABASE_URL antes de iniciar.');
const origin=new URL(process.env.APP_ORIGIN||'http://localhost:3000').origin;
if(production&&!origin.startsWith('https://'))throw new Error('Produção exige APP_ORIGIN com HTTPS.');
const pool=new pg.Pool({connectionString:process.env.DATABASE_URL,max:10,connectionTimeoutMillis:5000});
const app=express();app.disable('x-powered-by');
// Configure TRUST_PROXY apenas de acordo com a topologia real do proxy.
if(process.env.TRUST_PROXY==='1')app.set('trust proxy',1);
app.use(helmet());app.use(express.json({limit:'16kb'}));
app.use('/api',(_req,res,next)=>{res.set('Cache-Control','no-store');next();});
app.use('/api',rateLimit({windowMs:15*60*1000,limit:200,standardHeaders:'draft-8',legacyHeaders:false,message:{message:'Muitas solicitações. Aguarde alguns minutos.'}}));
app.use('/api',(req,res,next)=>{if(!['GET','HEAD','OPTIONS'].includes(req.method)&&req.get('origin')!==origin)return res.status(403).json({message:'Origem da solicitação não autorizada.'});next();});
const authLimiter=rateLimit({windowMs:15*60*1000,limit:15,standardHeaders:'draft-8',legacyHeaders:false,message:{message:'Muitas tentativas. Aguarde 15 minutos.'}});
const cookieName=production?'__Host-gestarbem_session':'gestarbem_session';
const cookieOptions={httpOnly:true,secure:production,sameSite:'strict',path:'/',maxAge:8*60*60*1000};
function sessionToken(req){const part=(req.headers.cookie||'').split(';').map(s=>s.trim()).find(s=>s.startsWith(cookieName+'='));const t=part?.slice(cookieName.length+1);return t&&/^[a-f0-9]{64}$/.test(t)?t:null;}
async function requireUser(req,res,next){const token=sessionToken(req);if(!token)return res.status(401).json({message:'Entre na sua conta para continuar.'});const {rows}=await pool.query('SELECT u.id,u.name,u.email FROM sessions s JOIN users u ON u.id=s.user_id WHERE s.token_hash=$1 AND s.expires_at>now()',[tokenHash(token)]);if(!rows[0])return res.status(401).json({message:'Sessão encerrada. Entre novamente.'});req.user=rows[0];next();}
app.get('/api/health',async(_req,res)=>{await pool.query('SELECT 1');res.json({status:'ok'});});
app.post('/api/auth/register',authLimiter,async(req,res)=>{const errors=registrationErrors(req.body);if(Object.keys(errors).length)return res.status(422).json({message:'Revise os campos indicados.',errors});const {name,email,password}=req.body;try{await pool.query('INSERT INTO users(id,name,email,password_hash) VALUES($1,$2,$3,$4)',[randomUUID(),name.trim(),email.trim().toLowerCase(),await hashPassword(password)]);}catch(e){if(e.code!=='23505')throw e;}// Resposta idêntica para endereço já cadastrado, evitando enumeração.
res.status(202).json({message:'Solicitação recebida. Se você já tem uma conta, entre com sua senha. Caso não consiga, procure o suporte do projeto.'});});
const dummyHash=await hashPassword(randomBytes(32).toString('hex'));
app.post('/api/auth/login',authLimiter,async(req,res)=>{const {email,password}=req.body||{};if(typeof email!=='string'||email.length>254||typeof password!=='string'||password.length>128)return res.status(422).json({message:'Informe e-mail e senha válidos.'});const {rows}=await pool.query('SELECT id,name,email,password_hash FROM users WHERE email=$1',[email.trim().toLowerCase()]);const user=rows[0];const valid=await verifyPassword(password,user?.password_hash||dummyHash);if(!user||!valid)return res.status(401).json({message:'E-mail ou senha incorretos.'});const token=randomBytes(32).toString('hex');const old=sessionToken(req);const client=await pool.connect();try{await client.query('BEGIN');if(old)await client.query('DELETE FROM sessions WHERE token_hash=$1',[tokenHash(old)]);await client.query("INSERT INTO sessions(token_hash,user_id,expires_at) VALUES($1,$2,now()+interval '8 hours')",[tokenHash(token),user.id]);await client.query('COMMIT');}catch(e){await client.query('ROLLBACK');throw e;}finally{client.release();}res.cookie(cookieName,token,cookieOptions);res.json({user:{id:user.id,name:user.name,email:user.email}});});
app.get('/api/auth/me',requireUser,(req,res)=>res.json({user:req.user}));
app.post('/api/auth/logout',async(req,res)=>{const token=sessionToken(req);if(token)await pool.query('DELETE FROM sessions WHERE token_hash=$1',[tokenHash(token)]);res.clearCookie(cookieName,{httpOnly:true,secure:production,sameSite:'strict',path:'/'});res.sendStatus(204);});
// Proprietária determinada pela sessão; nenhum user_id enviado é utilizado.
app.get('/api/profile',requireUser,async(req,res)=>{const {rows}=await pool.query("SELECT to_char(dum,'YYYY-MM-DD') AS dum,notes,updated_at FROM gestational_profiles WHERE user_id=$1",[req.user.id]);res.json({profile:rows[0]||{dum:null,notes:'',updated_at:null}});});
app.post('/api/profile',requireUser,async(req,res)=>{const errors=profileErrors(req.body);if(Object.keys(errors).length)return res.status(422).json({message:'Revise os campos indicados.',errors});const {dum,notes}=req.body;const {rows}=await pool.query("INSERT INTO gestational_profiles(user_id,dum,notes) VALUES($1,$2,$3) ON CONFLICT(user_id) DO UPDATE SET dum=EXCLUDED.dum,notes=EXCLUDED.notes,updated_at=now() RETURNING to_char(dum,'YYYY-MM-DD') AS dum,notes,updated_at",[req.user.id,dum||null,notes]);res.json({profile:rows[0]});});
registerAgenda(app,pool,requireUser);
registerRecords(app,pool,requireUser);
registerReminders(app,pool,requireUser);
registerActivity(app,pool,requireUser);
// Entrada autenticada; index.html conserva a demonstração independente.
app.get('/',(_req,res)=>res.redirect('/login.html'));
app.use(express.static(fileURLToPath(new URL('../frontend/',import.meta.url))));
app.use('/api',(_req,res)=>res.status(404).json({message:'Recurso não encontrado.'}));
app.use((err,_req,res,_next)=>{if(err.type==='entity.parse.failed')return res.status(400).json({message:'Formato JSON inválido.'});if(err.type==='entity.too.large')return res.status(413).json({message:'Solicitação muito grande.'});console.error('Falha interna:',err.code||err.name);res.status(500).json({message:'Não foi possível concluir. Tente novamente mais tarde.'});});
await pool.query('SELECT 1');const server=app.listen(Number(process.env.PORT||3000),'127.0.0.1',()=>console.log('GestarBem iniciado em',origin));
const cleanup=setInterval(()=>pool.query('DELETE FROM sessions WHERE expires_at<=now()').catch(()=>console.error('Falha ao limpar sessões.')),3600000);cleanup.unref();
process.on('SIGTERM',()=>{clearInterval(cleanup);server.close(()=>pool.end());});
