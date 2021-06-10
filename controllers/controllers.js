const Proyectos=require('../models/proyecto');
const Tareas  = require('../models/Tareas');


module.exports={
	home:async(req,resp)=>{
	   console.log(resp.locals.usuario);
	   const proyectos=await Proyectos.findAll();
       resp.render('index',{
       	namepage:'Proyectos '+resp.locals.year,
       	proyectos
       });
},//---------------------------------------------------------------
new_proyect:async(req,resp)=>{
	const proyectos=await Proyectos.findAll();
	   resp.render('new_proyect',{namepage:'new_proyect',proyectos});
},//--------------------------------------------------------------
nuevo_proyecto: async(req,resp)=>{
	console.log('req.body----<> ');
	console.log(req.body);
	const proyectos=await Proyectos.findAll();
	const {nombre}=req.body;
	let errores=[];
	if (!nombre) {
		errores.push({"texto":"Agrega un nombre al proyecto"});
	}

	if (errores.length> 0) {
		resp.render('new_proyect',{namepage:'nuevo-proyecto',errores,proyectos});
	}else{
		const userId=resp.locals.usuario.id;
		const proyecto = await Proyectos.create({nombre,userId});
       resp.redirect('/');
	}
},//------------------------------------------------------------------
 form_proyect_url:async(req,res)=>{
   const proyectosPromise=await Proyectos.findAll();
 	 const proyectoPromise=Proyectos.findOne({
 		where:{url:req.params.var_url}
 	});
 	const [proyectos,proyecto]=await Promise.all([proyectosPromise,proyectoPromise]);
 	// consulatar tareas del proyecto actual
 	const tareas = await Tareas.findAll({
 		where:{fk_Idproyecto:proyecto.id},
 		include:[
 		  {model:Proyectos}
 		]
 	});
 	 console.log(tareas);
   if (!proyecto) return next();
   res.render('homework',{namepage:'homework '+req.params.var_url,proyecto,proyectos,tareas});
 
 },
 update_form:async(req,res)=>{
 	console.log('out req.params.var_url '+req.params.var_url);
 	const proyectosPromise=await Proyectos.findAll();
 	const proyectoPromise=Proyectos.findOne({
 		where:{id:req.params.var_url}
 	});
 	const [proyectos,proyecto]=await Promise.all([proyectosPromise,proyectoPromise]);
 	console.log('salida de datos de la base de datos ',proyectos);
    res.render('new_proyect',{
    	namepage:'Editar Proyecto',proyectos,proyecto
    });
 },
 update_proyect:async(req,res)=>{
   const proyectos=await Proyectos.findAll();
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