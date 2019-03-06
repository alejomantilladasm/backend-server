var express = require('express');
var app = express();
var Hospital = require('../models/Hospital');
var Usuario = require('../models/Usuario');
var Medico = require('../models/Medico');


app.get('/coleccion/:tabla/:busuqeda', (req, res) => {

    var tabla = req.params.tabla;
    var busuqeda = req.params.busuqeda;

    var regex = new RegExp(busuqeda, 'i');
    var promesa;

    switch (tabla) {

        case 'usuarios':
            promesa = busuqedaUsuarios(busuqeda, regex);
            break;

        case 'medicos':
            promesa = busuqedaMedicos(busuqeda, regex);
            break;
        case 'hospitales':
            promesa = busuqedaHospitales(busuqeda, regex);
            break;
        default:
            return res.status(400).json({
                ok: 'false',
                mensaje: 'El consumo solo puede ser usuarios, medicos, hospitales'
            });


    }

    return promesa.then(data => {
        res.status(200).json({
            ok: 'true',
            [tabla]: data
        });
    });

});

app.get('/todo/:busqueda', (req, res, next) => {

    var busuqeda = req.params.busqueda;
    var regex = new RegExp(busuqeda, 'i');

    Promise.all([busuqedaHospitales(busuqeda, regex), busuqedaUsuarios(busuqeda, regex), busuqedaMedicos(busuqeda, regex)]).then(respuestas => {
        res.status(200).json({
            ok: 'true',
            hospitales: respuestas[0],
            usuarios: respuestas[1],
            medicos: respuestas[2]
        });
    });


    //busuqedaHospitales(busuqeda, regex).then(hospitales => {
    //busuqedaUsuaiors(busuqeda, regex).then(usuarios => {
    /*busuqedaMedicos(busuqeda, regex).then(medicos => {
        res.status(200).json({
            ok: 'true',
            //hospitales: hospitales,
            //usuarios: usuarios,
            medicos: medicos
        });
    });*/

});

function busuqedaHospitales(busuqeda, regex) {

    return new Promise((resolve, rejects) => {
        Hospital.find({ nombre: regex }).populate('usuario', 'nombre email').exec((err, hospitales) => {
            if (err) {
                rejects('Error al recuperar hospitales, ', err);
            } else {
                resolve(hospitales);
            }
        })
    });

};

function busuqedaUsuarios(busuqeda, regex) {

    return new Promise((resolve, rejects) => {
        Usuario.find({}, 'nombre email role google img').or([{ nombre: regex }, { email: regex }]).exec((err, usuarios) => {
            if (err) {
                rejects('Error al recuperar usuarios, ', err);
            } else {
                resolve(usuarios);
            }
        })
    });

};

function busuqedaMedicos(busuqeda, regex) {

    return new Promise((resolve, rejects) => {
        Medico.find({ nombre: regex }).populate('usuario', 'nombre email img').populate('hospital', 'nombre').exec((err, medicos) => {
            if (err) {
                rejects('Error al recuperar medicos, ', err);
            } else {
                resolve(medicos);
            }
        })
    });

};
module.exports = app;