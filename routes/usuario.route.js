var express = require('express');
var app = express();
var Usuario = require('../models/Usuario');
var bcrypt = require('bcryptjs');
var jwt = require('jsonwebtoken');
// var SEED = require('../config/config').SEED;
var mdAutenticacion = require('../middlewares/autenticacion');

// ---------------------------------------------------------
//  Recuperar todos los usuarios...
// ---------------------------------------------------------

app.get('/', (req, res, next) => {
    var desde = req.query.desde || 0;
    desde = Number(desde);

    Usuario.find({}, 'nombre email img role')
        .limit(5).skip(desde)
        .exec((err, usuarios) => {
            if (err) {
                return res.status(500).json({
                    mensaje: 'Error cargando usuarios ...!',
                    ok: 'false',
                    errors: err
                });
            }

            Usuario.count({}, (err, count) => {
                res.status(200).json({
                    ok: 'true',
                    usuarios: usuarios,
                    total: count

                });
            });

        });
});


// ---------------------------------------------------------
//  Verificar token...
// ---------------------------------------------------------
// app.use('/', (req, res, next) => {
//     var token = req.query.token;
//     jwt.verify(token, SEED, (err, decode) => {

//         if (err) {
//             return res.status(401).json({
//                 mensaje: 'Token no válido ...!',
//                 ok: 'false',
//                 errors: err
//             });
//         } else {
//             next();
//         }

//     });
// });

// ---------------------------------------------------------
//  Crear usuario...
// ---------------------------------------------------------
app.post('/', (req, res, next) => {

    var body = req.body;


    var hash = bcrypt.hashSync(body.password, 10);

    var usuario = new Usuario({
        nombre: body.nombre,
        email: body.email,
        password: hash,
        img: body.img,
        role: body.role
    });

    usuario.save((err, usr) => {

        if (err) {
            return res.status(400).json({
                mensaje: 'Error creando usuario ...!',
                ok: 'false',
                errors: err
            });
        }
        res.status(201).json({
            ok: 'true',
            usuario: usr,
            usuarioToken: req.usuario
        });
    })


});

// ---------------------------------------------------------
//  Actualizar usuario...
// ---------------------------------------------------------
app.put('/:id', mdAutenticacion.verificaToken, (req, res, next) => {
    var id = req.params.id;

    Usuario.findById(id, (err, usuario) => {
        if (err) {
            return res.status(500).json({
                mensaje: 'Error recuperando usuario ...!',
                ok: 'false',
                errors: err
            });
        }

        if (!usuario) {
            res.status(400).json({
                ok: 'false',
                mensaje: 'El usuario con el id ' + id + ' no se encuentra ...!'
            });
        }


        var body = req.body;



        usuario.nombre = body.nombre;
        usuario.email = body.email;
        usuario.role = body.role;



        usuario.save((err, usr) => {
            if (err) {
                return res.status(400).json({
                    mensaje: 'Error actualizando usuario ...!',
                    ok: 'false',
                    errors: err
                });
            }
            usr.password = '-.-';
            res.status(200).json({
                ok: 'true',
                mensaje: 'Usuario actualizando ...!',
                usuario: usr
            });
        })

    });


});

// ---------------------------------------------------------
//  Eliminar usuario...
// ---------------------------------------------------------
app.delete('/:id', mdAutenticacion.verificaToken, (req, res, next) => {
    var id = req.params.id;

    Usuario.findByIdAndRemove(id, (err, usuario) => {

        if (err) {
            return res.status(500).json({
                mensaje: 'Error eliminado usuario ...!',
                ok: 'false',
                errors: err
            });
        } else
        if (!usuario) {
            res.status(200).json({
                ok: 'true',
                mensaje: 'El usuario con el id ' + id + ' no existe ...!',
            });
        } else
        if (usuario) {
            res.status(200).json({
                ok: 'true',
                mensaje: 'Usuario eliminado ...!',
            });
        }

    });


});


module.exports = app;