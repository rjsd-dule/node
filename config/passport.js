const passport=require('passport');
const localStrategy=require('passport-local').Strategy;

//referencia al modelo donde se va autenticar
const Usuarios=require('../models/users');

//local strategy - login con credenciales propias (usuario , passport)
passport.use(
   new localStrategy(
        {
        	usernameField:'email',
        	passportField:'password'
        },
        async(email,password,done)=>{
              try {
                  const usuario=await Usuarios.findOne({
                  	where:{email:email,activo:1}
                  });
                  //el usuario no existe , password incorrecto 
                  if(!usuario.verificarPasword(password)){
                     return done(null,false,{
                 	message:'password incorrecto'
                    })
                  }
                  //el email existe , y el password correcto
                  return done(null,usuario)
              }catch(error){
                 return done(null,false,{
                 	message:'Usuario no registrado'
                 })
              }
        }
   	)
);

//serializar el usuario 
passport.serializeUser((usuario,callback)=>{
	callback(null,usuario);
});
//deserializar el usuario
passport.deserializeUser((usuario,callback)=>{
	callback(null,usuario);
});

module.exports=passport;