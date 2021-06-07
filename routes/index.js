const express=require('express');
const routes=express.Router();
const controllers=require('../controllers/controllers')
const tareasController=require('../controllers/tareasController');
const usersController=require('../controllers/usuariosController');
const authController=require('../controllers/authController');
const {body}=require('express-validator/check');
module.exports=function(){
	//-----------------------------------------------------------GET
	routes.get('/',authController.usuarioAutenticado,authController.usuarioAutenticado,controllers.home);
	routes.get('/new-proyect',authController.usuarioAutenticado,controllers.new_proyect);
	routes.get('/proyectos/:var_url',authController.usuarioAutenticado,controllers.form_proyect_url);
	// Update Proyect ------------------------------------
	routes.get('/proyect/update/:var_url',authController.usuarioAutenticado,controllers.update_form);
	//------------------------------------------------------------POST
	routes.post('/nuevo-proyecto',authController.usuarioAutenticado,body('nombre').not().isEmpty().trim().escape(),controllers.nuevo_proyecto);
	routes.post('/nuevo-proyecto/:var_url',authController.usuarioAutenticado,body('nombre').not().isEmpty().trim().escape(),controllers.update_proyect);
    //delete 
    routes.delete('/proyectos/:url', authController.usuarioAutenticado,controllers.delete_proyect);
    //tareas 
    routes.post('/proyectos/:url',authController.usuarioAutenticado,tareasController.agregarTarea);
    //update tarea
    routes.patch('/tareas/:id',authController.usuarioAutenticado,tareasController.changestate);
    //delete tarea
    routes.delete('/tareas/:id',authController.usuarioAutenticado,tareasController.eliminarTarea);
    //crear cuenta 
    routes.get('/crear-cuenta',usersController.form_createAcount);
    routes.post('/create-cuenta',usersController.createAcount);
    //Iniciar Session
    routes.get('/iniciar-session',usersController.form_iniciarSession);
    routes.post('/iniciar-session',authController.autenticarUsuario);
    //cerrar session
    routes.get('/cerrar-sesion',authController.cerrar_sesion);
	return routes;
}