// Requires
var express = require('express');
var mongoose = require('mongoose');

// Inicializar variables
var app = express();

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

app.get('/', (req, res, next) => {
    res.status(200).json({
        mensaje: 'El servicio aun no esta definido',
        ok: 'true'
    });
});

// mongod --dbpath D:\mongoDb\data\db