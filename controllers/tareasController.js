const Proyectos= require('../models/Proyecto');
const Tareas  = require('../models/Tareas');
const slug=require('slug');

module.exports={
	agregarTarea: async(req,res,next)=>{      
	  const proyecto = await Proyectos.findOne({where:{url:req.params.url}});
	  //read valor de imput
	  const {tarea}=req.body;
	  //estado 0 incompleto y id del proyecto
	  const estado=0;
	  const fk_Idproyecto=proyecto.id;
	  //insert in database
	  const resultado = await Tareas.create({tarea , estado , fk_Idproyecto});
	  try {
	  	 console.log('->>>>>>>>>>>>',resultado);
		  if(!resultado){
	          next(error);
		  }
		   //reedirect
       res.redirect(`/proyectos/${req.params.url}`);
	  }catch(error){
	  	 console.log(error);
	  	 process.exit();
	  }
	  
	},
	changestate:async(req,res,next)=>{
	 console.log('parametro -><-- ',req.params);
	 const {id}=req.params;
	 const tarea=await Tareas.findOne({
	 	where:{
	 		id
	 	}
	 });
	 console.log('tareas id ---<',tarea);
	 //change state
	 let estado=0;
	 if (tarea.estado==estado)
	 	 estado=1;
	 tarea.estado=estado;
	 const resultado=await tarea.save();
	 if(!resultado) return next();
     res.status(200).send('Todo bien todo correcto');
	},
	eliminarTarea:async(req,res,next)=>{
	  const {id}=req.params;
	  const resultado=await Tareas.destroy({where:{
	  	id
	  }});
	  if(!resultado) return next();
      res.status(200).send('elimanando');
	}
}