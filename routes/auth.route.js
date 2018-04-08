var express = require('express');
var app = express();
var Usuario = require('../models/Usuario');
var bcrypt = require('bcryptjs');
var jwt = require('jsonwebtoken');
var SEED = require('../config/config').SEED;

app.get('/login', (req, res, next) => {

    var body = req.body;

    // Usuario.findOne({ email: body.email }, (err, usuario) => {
    Usuario.find({ email: body.email }, (err, usuario) => {

        if (err) {
            return res.status(500).json({
                mensaje: 'Error login usuario ...!',
                ok: 'false',
                errors: err
            });
        }
        if (0 === usuario.length) {
            res.status(400).json({
                ok: 'false',
                mensaje: 'El usuario no existe ...!',
            });
        } else {
            if (bcrypt.compareSync(body.password, usuario[0].password)) {
                //Crear token
                var token = jwt.sign({ usuaior: usuario[0] }, SEED, { expiresIn: 14400 });

                res.status(200).json({
                    ok: 'true',
                    mensaje: 'Usuario autenticado ...!',
                    token: token
                });
            } else {


                res.status(200).json({
                    ok: 'true',
                    mensaje: 'Usuario y contraseña no concuerdan ...!'
                });
            }

        }

    });
});

module.exports = app;