var express = require('express');
var app = express();
var Hospital = require('../models/Hospital');
var mdAutenticacion = require('../middlewares/autenticacion');

// ---------------------------------------------------------
//  Recuperar todos los hospitales...
// ---------------------------------------------------------

app.get('/', (req, res, next) => {
    Hospital.find({}, (err, hospitales) => {
        if (err) {
            return res.status(500).json({
                mensaje: 'Error cargando hospitales ...!',
                ok: 'false',
                errors: err
            });
        }
        res.status(200).json({
            ok: 'true',
            hospitales: hospitales

        });
    });
});

// ---------------------------------------------------------
//  Crear hospital...
// ---------------------------------------------------------
app.post('/', mdAutenticacion.verificaToken, (req, res, next) => {

    var body = req.body;

    var hospital = new Hospital({
        nombre: body.nombre,
        usuario: body.usuario,
        img: body.img
    });

    hospital.save((err, usr) => {

        if (err) {
            return res.status(400).json({
                mensaje: 'Error creando hospital ...!',
                ok: 'false',
                errors: err
            });
        }
        res.status(201).json({
            ok: 'true',
            hospital: usr,
            hospitalToken: req.hospital
        });
    })

});

// ---------------------------------------------------------
//  Actualizar hospital...
// ---------------------------------------------------------
app.put('/:id', mdAutenticacion.verificaToken, (req, res, next) => {
    var id = req.params.id;

    Hospital.findById(id, (err, hospital) => {
        if (err) {
            return res.status(500).json({
                mensaje: 'Error recuperando hospital ...!',
                ok: 'false',
                errors: err
            });
        }

        if (!hospital) {
            res.status(400).json({
                ok: 'false',
                mensaje: 'El hospital con el id ' + id + ' no se encuentra ...!'
            });
        }


        var body = req.body;



        hospital.nombre = body.nombre;
        if (body.usuario && '' != body.usuario) {
            hospital.usuario = body.usuario;
        }




        hospital.save((err, usr) => {

            if (err) {
                return res.status(400).json({
                    mensaje: 'Error actualizando hospital ...!',
                    ok: 'false',
                    errors: err
                });
            }
            res.status(200).json({
                ok: 'true',
                mensaje: 'hospital actualizando ...!',
            });
        })

    });


});

// ---------------------------------------------------------
//  Eliminar hospital...
// ---------------------------------------------------------
app.delete('/:id', mdAutenticacion.verificaToken, (req, res, next) => {
    var id = req.params.id;

    Hospital.findByIdAndRemove(id, (err, hospital) => {

        if (err) {
            return res.status(500).json({
                mensaje: 'Error eliminado hospital ...!',
                ok: 'false',
                errors: err
            });
        } else
        if (!hospital) {
            res.status(200).json({
                ok: 'true',
                mensaje: 'El hospital con el id ' + id + ' no existe ...!',
            });
        } else
        if (hospital) {
            res.status(200).json({
                ok: 'true',
                mensaje: 'hospital eliminado ...!',
            });
        }

    });


});


module.exports = app;