import {hashPassword,verifyPassword} from './auth.mjs';
export function passwordChangeErrors(body){
 if(!body||typeof body!=='object'||Array.isArray(body))body={};
 const errors={};
 if(typeof body.currentPassword!=='string'||!body.currentPassword.length||body.currentPassword.length>128)errors.currentPassword='Informe sua senha atual.';
 if(typeof body.newPassword!=='string'||body.newPassword.length<6||body.newPassword.length>128)errors.newPassword='Use uma senha de 6 a 128 caracteres.';
 if(body.newPassword!==body.confirmPassword)errors.confirmPassword='As senhas precisam ser iguais.';
 if(!errors.newPassword&&body.newPassword===body.currentPassword)errors.newPassword='Escolha uma senha diferente da atual.';
 return errors;
}
export function registerAccountSettings(app,pool,requireUser,limiter,cookieName){
 app.post('/api/account/password',requireUser,limiter,async(req,res)=>{
  const errors=passwordChangeErrors(req.body);
  if(Object.keys(errors).length)return res.status(422).json({message:'Revise os campos indicados.',errors});
  const client=await pool.connect();
  try{
   await client.query('BEGIN');
   const {rows}=await client.query('SELECT password_hash FROM users WHERE id=$1 FOR UPDATE',[req.user.id]);
   if(!rows[0]){await client.query('ROLLBACK');return res.status(401).json({message:'Entre novamente para continuar.'});}
   if(!await verifyPassword(req.body.currentPassword,rows[0].password_hash)){
    await client.query('ROLLBACK');
    return res.status(422).json({message:'Confira a senha atual.',errors:{currentPassword:'A senha atual não está correta.'}});
   }
   const hash=await hashPassword(req.body.newPassword);
   await client.query('UPDATE users SET password_hash=$1 WHERE id=$2',[hash,req.user.id]);
   await client.query('DELETE FROM sessions WHERE user_id=$1',[req.user.id]);
   await client.query('COMMIT');
   res.clearCookie(cookieName,{httpOnly:true,secure:cookieName.startsWith('__Host-'),sameSite:'strict',path:'/'});
   res.status(200).json({message:'Senha alterada. Entre novamente com sua nova senha.'});
  }catch(error){await client.query('ROLLBACK');throw error;}finally{client.release();}
 });
}
