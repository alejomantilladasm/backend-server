var express = require('express');
var app = express();
var Hospital = require('../models/Hospital');
var mdAutenticacion = require('../middlewares/autenticacion');

// ---------------------------------------------------------
//  Recuperar todos los hospitales...
// ---------------------------------------------------------

app.get('/', (req, res, next) => {
    var desde = req.query.desde || 0;
    desde = Number(desde);
    Hospital.find({}, (err, hospitales) => {
        if (err) {
            return res.status(500).json({
                mensaje: 'Error cargando hospitales ...!',
                ok: 'false',
                errors: err
            });
        }
        Hospital.count({}, (err, count) => {
            res.status(200).json({
                ok: 'true',
                hospitales: hospitales,
                total: count
            });
        });

    }).populate('usuario', 'nombre email').limit(5).skip(desde);
});

// ---------------------------------------------------------
//  Crear hospital...
// ---------------------------------------------------------
app.post('/', mdAutenticacion.verificaToken, (req, res, next) => {

    var body = req.body;

    var hospital = new Hospital({
        nombre: body.nombre,
        usuario: req.usuario._id,
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
        hospital.usuario = req.usuario._id;




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


// ==========================================
// Obtener Hospital por ID
// ==========================================
app.get('/:id', (req, res) => {
    var id = req.params.id;
    Hospital.findById(id)
        .populate('hospital', 'nombre img email')
        .exec((err, hospital) => {
            if (err) {
                return res.status(500).json({
                    ok: false,
                    mensaje: 'Error al buscar hospital',
                    errors: err
                });
            }
            if (!hospital) {
                return res.status(400).json({
                    ok: false,
                    mensaje: 'El hospital con el id ' + id + 'no existe',
                    errors: { message: 'No existe un hospitalcon ese ID' }
                });
            }
            res.status(200).json({
                ok: true,
                hospital: hospital
            });
        })
});


module.exports = app;