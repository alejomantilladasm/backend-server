var express = require('express');
var app = express();
var Usuario = require('../models/Usuario');
var bcrypt = require('bcryptjs');
var jwt = require('jsonwebtoken');
var SEED = require('../config/config').SEED;
//Google
var CLIENT_ID = require('../config/config').CLIENT_ID;
const { OAuth2Client } = require('google-auth-library');
const client = new OAuth2Client(CLIENT_ID);
async function verify(token) {
    const ticket = await client.verifyIdToken({
        idToken: token,
        audience: CLIENT_ID, // Specify the CLIENT_ID of the app that accesses the backend
        // Or, if multiple clients access the backend:
        //[CLIENT_ID_1, CLIENT_ID_2, CLIENT_ID_3]
    });
    const payload = ticket.getPayload();
    //const userid = payload['sub'];
    // If request specified a G Suite domain:
    //const domain = payload['hd'];
    return {
        nombre: payload.name,
        email: payload.email,
        img: payload.picture,
        google: true
    };
}

app.post('/google', async(req, res, next) => {


    var token = req.body.token;
    var userGoogle = await verify(token).catch(err => {
        return res.status(403).json({
            mensaje: 'Token no validoe...! ',
            ok: 'false'
        });
    });



    if (userGoogle.email) {

        Usuario.findOne({ email: userGoogle.email }, (err, usuario) => {
            if (err) {
                return res.status(500).json({
                    mensaje: 'Error login usuario ...!',
                    ok: 'false',
                    errors: err
                });
            }

            if (usuario) {

                if (usuario.google === false) {
                    return res.status(400).json({
                        mensaje: 'Usar autetición normal ...!',
                        ok: 'false'
                    });
                } else {
                    //Crear token
                    var token = jwt.sign({ usuaior: usuario }, SEED, { expiresIn: 14400 });

                    res.status(200).json({
                        ok: 'true',
                        mensaje: 'Usuario autenticado ...!',
                        token: token,
                        usuario: usuario
                    });
                }


            } else {
                //Usuario no existe hay que crearlo
                var usuarioNuevo = new Usuario({
                    nombre: userGoogle.nombre,
                    email: userGoogle.email,
                    password: '-.-',
                    google: true,
                    img: userGoogle.img,
                });


                usuarioNuevo.save((err, usr) => {

                    if (err) {
                        return res.status(400).json({
                            mensaje: 'Error creando usuario de google ...!',
                            ok: 'false',
                            errors: err
                        });
                    }
                    //Crear token
                    var token = jwt.sign({ usuaior: usr }, SEED, { expiresIn: 14400 });

                    res.status(200).json({
                        ok: 'true',
                        usuario: usr,
                        usuarioToken: token
                    });
                })
            }
        });
    }












});

module.exports = app;