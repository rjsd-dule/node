const express= require('express');
const routes=require('./routes');
const path=require('path');
const bodyparser=require('body-parser');
const expressValidator=require('express-validator');
const passport=require('./config/passport');
const flash=require('connect-flash');
const session=require('express-session');
const cookieParser=require('cookie-parser');
//helpers con algunas funciones 
const helpers =require('./helpers');

//crear conexion a la db
const db=require('./config/db');
//db.authenticate()
	
//Import models
require('./models/Proyecto');
require('./models/Tareas');
require('./models/users');
db.sync()
  .then(()=> console.log('Conexion exitosa a la db'))
  .catch(error => console.log(error));
//crear un app de express
const app=express();

//donde cargar los archivos estaticos
app.use(express.static('public'));

//habilitar pug (jade)
app.set('view engine','pug');

//habilitar bodyParser para leer datos del formulario
app.use(bodyparser.urlencoded({extended:true}));

//agregamos express validator a toda  la aplicacion 
//app.use(expressValidator());


//añadir la carpeta de las vistas
app.set('views',path.join(__dirname,'./views'));

//agregar flash message
app.use(flash());

app.use(cookieParser());
// sessiones nos permite navegar entre distintas paginas sin volver a autenticar
app.use(session({
	secret:'supersecreto',
	resave:false,
	saveUninitialized:false,
}));

app.use(passport.initialize());
app.use(passport.session());

//pasar var dump a la app
app.use((req,res,next)=>{
	res.locals.vardump=helpers.vardump;
	res.locals.mensaje=req.flash();
	next();
});

//Middleware 
app.use((req,res,next)=>{
 const fecha= new Date();
     res.locals.year=fecha.getFullYear();
	next();
});




app.use('/',routes());

app.listen(3000);
//puerto 