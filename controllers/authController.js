const passport=require('passport');

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
	}
}