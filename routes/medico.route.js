var express = require('express');
var app = express();
var Medico = require('../models/Medico');
var mdAutenticacion = require('../middlewares/autenticacion');

// ---------------------------------------------------------
//  Recuperar todos los medicos...
// ---------------------------------------------------------

app.get('/', (req, res, next) => {
    Medico.find({}, (err, medicos) => {
        if (err) {
            return res.status(500).json({
                mensaje: 'Error cargando medicos ...!',
                ok: 'false',
                errors: err
            });
        }
        res.status(200).json({
            ok: 'true',
            medicos: medicos

        });
    });
});

// ---------------------------------------------------------
//  Crear medico...
// ---------------------------------------------------------
app.post('/', mdAutenticacion.verificaToken, (req, res, next) => {

    var body = req.body;

    var medico = new Medico({
        nombre: body.nombre,
        img: body.img,
        usuario: body.usuario,
        hospital: body.hospital
    });

    medico.save((err, usr) => {

        if (err) {
            return res.status(400).json({
                mensaje: 'Error creando medico ...!',
                ok: 'false',
                errors: err
            });
        }
        res.status(201).json({
            ok: 'true',
            medico: usr,
            medicoToken: req.medico
        });
    })


});

// ---------------------------------------------------------
//  Actualizar medico...
// ---------------------------------------------------------
app.put('/:id', mdAutenticacion.verificaToken, (req, res, next) => {
    var id = req.params.id;

    Medico.findById(id, (err, medico) => {
        if (err) {
            return res.status(500).json({
                mensaje: 'Error recuperando medico ...!',
                ok: 'false',
                errors: err
            });
        }

        if (!medico) {
            res.status(400).json({
                ok: 'false',
                mensaje: 'El medico con el id ' + id + ' no se encuentra ...!'
            });
        }


        var body = req.body;



        medico.nombre = body.nombre;



        medico.save((err, usr) => {

            if (err) {
                return res.status(400).json({
                    mensaje: 'Error actualizando medico ...!',
                    ok: 'false',
                    errors: err
                });
            }
            res.status(200).json({
                ok: 'true',
                mensaje: 'medico actualizando ...!',
            });
        })

    });


});

// ---------------------------------------------------------
//  Eliminar medico...
// ---------------------------------------------------------
app.delete('/:id', mdAutenticacion.verificaToken, (req, res, next) => {
    var id = req.params.id;

    Medico.findByIdAndRemove(id, (err, medico) => {

        if (err) {
            return res.status(500).json({
                mensaje: 'Error eliminado medico ...!',
                ok: 'false',
                errors: err
            });
        } else
        if (!medico) {
            res.status(200).json({
                ok: 'true',
                mensaje: 'El medico con el id ' + id + ' no existe ...!',
            });
        } else
        if (medico) {
            res.status(200).json({
                ok: 'true',
                mensaje: 'medico eliminado ...!',
            });
        }

    });


});


module.exports = app;