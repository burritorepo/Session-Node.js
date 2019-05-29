var express = require('express')
routes = require('./routes'),
user = require('./routes/user'),
http = require('http'),// para crear el servidor
path = require('path'); // para ubicar las plantillas

var session = require('express-session'); // para generar la session
var app = express(); // instanciar express
var mysql = require('mysql'); // para conectarse a la db
var bodyParser = require('body-parser');
var connection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'nodelogin'
});

connection.connect();

global.db = connection; // variable global generada en la app principal que se usa en user.js, es ese archivo elq llamara a los templates

app.set('port', process.env.port | 4000); // en produccion usara el puerto por defecto o el 4000
app.set('views',__dirname+'/views');
app.set('view engine','ejs'); // parte de la sintaxis de ejs para mostrar archivos dentro de views
app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json()); // todas las respuestas seran en JSON
app.use(express.static(path.join(__dirname,'public')));

app.use(session({
    secret: 'keyboard cat',
    resave: false,
    saveUninitialized: true,
    cookie: {maxAge:60000}
}));

app.get('/', routes.index);
app.get('/signup',user.signup);
app.post('/signup',user.signup);
app.get('/login',routes.index);
app.post('/login',user.login);
app.get('/home/dashboard',user.dashboard);
app.get('/home/logout',user.logout);
app.get('/home/profile',user.profile);

app.listen(4000);