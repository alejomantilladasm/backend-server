var express = require('express');
var app = express();

app.get('/', (req, res, next) => {
    res.status(200).json({
        mensaje: 'El servicio raíz responde...! ',
        ok: 'true'
    });
});

module.exports = app;