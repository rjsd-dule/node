//  obtener el cliente
const Sequelize = require ('sequelize');
const slug=require('slug');
const shortid=require('shortid');
//obtener valores de variables.env
require('dotenv').config({path:'variables.env'});
const sequelize= new Sequelize(
	process.env.BD_NOMBRE, //name database
	process.env.BD_USER,  //users database
	process.env.BD_PASS, // password database
	{
	host:process.env.BD_HOST,//'localhost',
	dialect:'mysql',
	port:process.env.BD_PORT,
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