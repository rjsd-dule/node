//  obtener el cliente
const Sequelize = require ('sequelize');
const slug=require('slug');
const shortid=require('shortid');
const sequelize= new Sequelize('uptasnode','root','',{
	host:'localhost',
	dialect:'mysql',
	port:'3306',
	operatorsAliases:false,
	define:{
		timestamps:false
	},

	pool:{
		max:5,
		min:0,
		acquire:30000,
		idle:10000

	},
	hooks:{
		beforeCreate(proyecto){
			const url=slug(proyecto.nombre).toLowerCase();
			proyecto.url=`${url}-${shortid.generate()}`;
			console.log('Before insert ');
		}
	}
});   
 
 module.exports=sequelize;