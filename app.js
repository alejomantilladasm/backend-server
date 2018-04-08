// Requires
var express = require('express');
var mongoose = require('mongoose');
var bodyParser = require('body-parser');

// Inicializar variables
var app = express();


// parse application/x-www-form-urlencoded

// parse application/json
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());


// Importar rutas
var appRoutes = require('./routes/app.route');
var usuarioRoutes = require('./routes/usuario.route');
var authRoutes = require('./routes/auth.route');

//Conexión a la base de datos
mongoose.connect('mongodb://localhost:27017/hospitalDb', (err, res) => {
    if (err) throw err;

    console.log('\x1b[32mMongoDb Conexion establecida...!\x1b[0m');
});


// Escuchar peticiones
app.listen(3000, () => {
    // Ejemplo de colocar colores en mensajes de consola
    console.log('Express server puerto 3000', '\x1b[32m online\x1b[0m ');
});

//Rutas
app.use('/auth', authRoutes);
app.use('/usuario', usuarioRoutes);
app.use('/', appRoutes);



// mongod --dbpath D:\mongoDb\data\db