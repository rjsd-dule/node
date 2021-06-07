const users=require('../models/users');
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
           res.redirect('/iniciar-session');
		}catch(error){
			console.log('------------------');
			console.log(error.message);
			console.log('------------------');
		   req.flash('error',error.errors.map(error=>error.message));
           res.render('createAcount',{namepage:'crear cuenta',mensaje:req.flash(),email,password});
		}
		
	}
}