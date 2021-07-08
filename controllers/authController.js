const passport=require('passport');
const Usuarios=require('../models/users');
const Sequelize=require('sequelize');
const crypto=require('crypto');
const bcrypt=require('bcrypt-nodejs');
const enviarEmail=require('../handler/email');
const Op=Sequelize.Op;

//exports.autenticarUsuario=;

module.exports={
	autenticarUsuario:passport.authenticate('local',{
    successRedirect:'/',
    failureRedirect:'/iniciar-session',
    failureFlash:true,
    badRequestMessage:'Ambos Campos son obligatorios'
}),
   usuarioAutenticado:(req,res,next)=>{
      if(req.isAuthenticated()){
      	 return next();
      }
       return res.redirect('/iniciar-session');
   },
   cerrar_sesion:(req,res,next)=>{
     req.session.destroy(()=>{
          res.redirect('/iniciar-session');
     });
	},
   formRestablecerPassword:(req,res)=>{
      res.render('restablecer',{namepage:'Restablecer'});
     console.log(req.session);
   }, 
   enviarToken:async(req,res)=>{ //genera un token si el usuario es valido
     //verificar que el usuario existe
     console.log(req.body);
     const {email}=req.body;
     const usuario=await Usuarios.findOne({where:{email}});

     if(!usuario){
        req.flash('Error','No existe el email');
      //  res.redirect('/reestablecer');
        res.render('restablecer',{
         namepage:'Reestablecer tu passport',
         mensaje:req.flash()
      });
     }

     usuario.token=crypto.randomBytes(20).toString('hex');
     usuario.expiracion=Date.now()+3600000;
     //guardarlos en la base de datos
     await usuario.save();
     console.log('token '+usuario.token+'\n fecha '+usuario.expiracion);
     //url de reset  
     const resetUrl=`http://${req.headers.host}/reestablecer/${usuario.token}`;//nos dara la url actual con el token
   // res.redirect(`http://${req.headers.host}/reestablecer/${usuario.token}`);
    console.log(resetUrl);
    //enviar el correo con el token 
     await enviarEmail.enviar({
      usuario,
      subject:'Password Reset',
      resetUrl,
      archivo:'restablecer-password'
     });
     //finalizar proceso 
     req.flash('correcto','Se envio un mensaje a tu correo');
     res.redirect('/iniciar-session');
   },
   validarToken:async(req,res)=>{
     // res.json(req.params.token);
     console.log('token de usuario -> '+req.params.token);
      const usuario=await Usuarios.findOne({
         where:{
            token:req.params.token
         }
      });
      // si no encuentra el usuario
      if (!usuario){
         req.flash('error','No Válido');
         res.redirect('/reestablecer');
      }
      //formulario para generar el password
      res.render('resetPassword',{
         namepage:'Reestablecer passport'
      });
      console.log(usuario);
   },
   //change password for new
   actualizarPassword:async(req,res)=>{
      //verifica el token valido pero tambien la fecha de expiracion 
      const usuario=await Usuarios.findOne({
         where:{
            token:req.params.token,
            expiracion:{
               [Op.gte]:Date.now
            }
         }
      });
      //verificamos si el usuario existe
      if(!usuario){
         req.flash('error','No valido');
         res.redirect('/reestablecer');
      }
      //hashear el nuevo password
      usuario.token=null;
      usuario.expiracion=null;
      usuario.password=bcrypt.hashSync(req.body.password,bcrypt.genSaltSync(10));
      //guardamos el nuevo password
      await usuario.save();
      req.flash('correcto','Tu password se ha modificado correctamente');
      res.redirect('/iniciar-session');
   }
}