const Sequelize= require('sequelize');
const db=require('../config/db');

const Proyectos=db.define('Proyectos',{
	id:{
		type:Sequelize.INTEGER,
		primaryKey:true,
		autoIncrement:true
	},
	nombre:Sequelize.STRING(100),
	url:Sequelize.STRING(100)
},
 /* {
  	hooks:{
  		beforeCreate(proyectos){
  			const url=slug(proyectos.nombre).toLowerCase();
  			proyectos.url=`${url}-${shorid.generate()}`;
  		}
  	}
  }*/
);

module.exports=Proyectos;