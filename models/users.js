const Sequelize=require('sequelize');
const Proyectos=require('../models/Proyecto');
const bcrypt=require('bcrypt-nodejs');
const db = require('../config/db');

const users=db.define('users',{
	id:{
		type:Sequelize.INTEGER,
		primaryKey:true,
		autoIncrement:true
	},
	email:{
      type:Sequelize.STRING(60),
      allowNull:false,
      validate:{
      	isEmail:{
      		msg:'Agrega un email Valido'
      	},
      	notEmpty:{
      		msg:'El Email No puede estar vacio'
      	}
      	
      },
      unique:{
      		args:true,
      		msg:'Usuario Ya registrado'
      	}
	},
	password:{
    type:Sequelize.STRING(60),
    allowNull:false,
    validate:{
    	notEmpty:{
    		msg:'El password no p uede estar vacio'
    	}
    }
	}
},{
	hooks:{
		beforeCreate(users){
		   users.password=bcrypt.hashSync(users.password,bcrypt.genSaltSync(10));
           console.log('users :',users);
		}
	}
});
// metodos personalizados
users.prototype.verificarPasword=function(password){
	return bcrypt.compareSync(password,this.password);
}
users.hasMany(Proyectos);// crea el forenkey de la tabla de proyectos

module.exports=users