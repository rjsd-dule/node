const Proyectos=require('../models/proyecto');
const Tareas  = require('../models/Tareas');


module.exports={
	home:async(req,resp)=>{
	  // console.log(resp.locals.usuario);
	 // 
	   const usersid=resp.locals.usuario.id
	   const proyectos=await Proyectos.findAll({where:{fk_usuarioId:usersid}});
	   console.log('---> ',proyectos)
       resp.render('index',{
       	namepage:'Proyectos '+resp.locals.year,
       	proyectos
       });
},//---------------------------------------------------------------
new_proyect:async(req,resp)=>{
	const usersid=resp.locals.usuario.id
	const proyectos=await Proyectos.findAll({where:{fk_usuarioId:usersid}});
	   resp.render('new_proyect',{namepage:'new_proyect',proyectos});
},//--------------------------------------------------------------
nuevo_proyecto: async(req,resp)=>{
	console.log('req.body----<> ');
	console.log(req.body);
	const usersid=resp.locals.usuario.id
  const proyectos=await Proyectos.findAll({where:{fk_usuarioId:usersid}});
	const {nombre}=req.body;
	let errores=[];
	if (!nombre) {
		errores.push({"texto":"Agrega un nombre al proyecto"});
	}

	if (errores.length> 0) {
		resp.render('new_proyect',{namepage:'nuevo-proyecto',errores,proyectos});
	}else{ 
		const fk_usuarioId=resp.locals.usuario.id;
		console.log('verificando la entrada del id '+fk_usuarioId);
		const proyecto = await Proyectos.create({nombre,fk_usuarioId});
       resp.redirect('/'); 
	}
},//------------------------------------------------------------------
 form_proyect_url:async(req,res)=>{
 	 const usersid=res.locals.usuario.id;
 	 console.log('usersid-usersid ['+usersid);
   const proyectosPromise= Proyectos.findAll({where:{fk_usuarioId:usersid}});
 	 const proyectoPromise=Proyectos.findOne({
 		where:{url:req.params.var_url,fk_usuarioId:usersid}
 	});
 	 console.log('proyectosPromise ----<',proyectosPromise);
 	 console.log('proyectoPromise  ---->',proyectoPromise);
 	const [proyectos,proyecto]=await Promise.all([proyectosPromise,proyectoPromise]);
 	// consulatar tareas del proyecto actual
 	const tareas = await Tareas.findAll({
 		where:{fk_Idproyecto:proyecto.id},
 		include:[
 		  {model:Proyectos}
 		]
 	});
 	 console.log('tareassss ',tareas);
   if (!proyecto) return next();
   res.render('homework',{namepage:'homework '+req.params.var_url,proyecto,proyectos,tareas});
 
 },
 update_form:async(req,res)=>{
 	console.log('out req.params.var_url '+req.params.var_url);
 	const usersid=res.locals.usuario.id
	const proyectosPromise=await Proyectos.findAll({where:{fk_usuarioId:usersid}});

 	const proyectoPromise=Proyectos.findOne({
 		where:{id:req.params.var_url,fk_usuarioId:usersid}
 	});
 	const [proyectos,proyecto]=await Promise.all([proyectosPromise,proyectoPromise]);
 	console.log('salida de datos de la base de datos ',proyectos);
    res.render('new_proyect',{
    	namepage:'Editar Proyecto',proyectos,proyecto
    });
 },
 update_proyect:async(req,res)=>{
 	 const usersid=res.locals.usuario.id
	 const proyectos=await Proyectos.findAll({where:{fk_usuarioId:usersid}});
	const {nombre}=req.body;
	let errores=[];
	if (!nombre) {
		errores.push({"texto":"Agrega un nombre al proyecto"});
	}

	if (errores.length> 0) {
		resp.render('new_proyect',{namepage:'nuevo-proyecto',errores,proyectos});
	}else{
		await Proyectos.update(
			{nombre:nombre},
			{where:{id:req.params.var_url}}
			);
       res.redirect('/');
	}
 },
 delete_proyect:async(req,res,next)=>{
 	//req, query o params
 	const {urlProyecto}=req.query;
 	const resultado=await Proyectos.destroy({where:{url:urlProyecto}});
 	if (!resultado) {
 		return next();
 	}
 	res.status(200).send('Elimando de manera correcta');
 	console.log(req);
 }
}