const users=require('../models/users');
enviarEmail=require('../handler/email');
module.exports={
	form_createAcount:(req,res,next)=>{
         res.render('createAcount',{namepage:'crear cuenta'});
	},
	form_iniciarSession:(req,res,next)=>{
		 const {error}=res.locals.mensaje;
         res.render('iniciarSession',{namepage:'Iniciar Session',error});
	},
	createAcount:async(req,res)=>{
		console.log(req.body);
		const {email,password}=req.body;
		try{
	           await users.create({
				email,password
			 });

           //crear una url de confirmar
             const confirmarUrl=`http://${req.headers.host}/confirmar/${email}`;

           //crear objeto de usuario
             const usuario={
             	email
             }
           //enviar email
            await enviarEmail.enviar({
             usuario,
             subject:'Confirma tu cuenta updask',
             confirmarUrl,
             archivo:'confirmar-cuenta'
            });
           //redirigir al usuario
           req.flash('error','Enviamos un correo , confirma tu cuenta');
           res.redirect('/iniciar-session');
		}catch(error){
			console.log('------------------');
			console.log(error.message);
			console.log('------------------');
		   req.flash('error',error.errors.map(error=>error.message));
           res.render('createAcount',{namepage:'crear cuenta',mensaje:req.flash(),email,password});
		}
		
	},
	//Cambiar el estado de una cuenta
	confirmarCuenta:async(req,res)=>{
		const usuario=await users.findOne({
			where:{
				email:req.params.email
			}
		});

		//si no existe el usuario
		if (!usuario) {
			req.flash('error','No valido');
			res.render('/crear-cuenta');
		}
		usuario.activo=1;
		await usuario.save();
		req.flash('correcto','Cuenta Activada Correctamente');
		res.redirect('/iniciar-session');

	}
}