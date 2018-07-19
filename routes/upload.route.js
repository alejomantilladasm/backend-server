var express = require('express');
const fileUpload = require('express-fileupload');
var fs = require('fs');

var app = express();
var Usuario = require('../models/Usuario');
var Medico = require('../models/Medico');
var Hospital = require('../models/Hospital');

app.use(fileUpload());

app.put('/:tipo/:id', (req, res, next) => {

    var tipo = req.params.tipo;
    var id = req.params.id;

    console.log(tipo, id);

    var tiposValidos = ['usuarios', 'medicos', 'hospitales'];
    if (tiposValidos.indexOf(tipo) < 0) {
        return res.status(400).json({
            ok: false,
            mensaje: 'Tipo no valido',
            errors: {
                mensaje: 'Los tipos permitidos son ' + tiposValidos.join(', ')
            }
        });
    }

    if (!req.files) {
        return res.status(400).json({
            ok: false,
            mensaje: 'no existe un archivo seleccionado',
            errors: {
                mensaje: 'Debe seleccionar una imagen para continuar'
            }
        });
    }

    var nombre = req.files.imagen.name.split('.');
    var extension = nombre[nombre.length - 1];

    var extesionesValidas = ['png', 'jpg', 'gif', 'jpeg'];

    if (extesionesValidas.indexOf(extension) < 0) {
        return res.status(400).json({
            ok: false,
            mensaje: 'Extension no valida',
            errors: {
                mensaje: 'Las extenciones permitidas son ' + extesionesValidas.join(', ')
            }
        });
    }

    //Definir nombre nuevo para el archivo
    var nuevoNombre = `${id}-${new Date().getMilliseconds()}.${extension}`;
    //almacenar en directorio el archivo
    var path = `./uploads/${tipo}/${nuevoNombre}`;
    req.files.imagen.mv(path, err => {

        if (err) {
            return res.status(400).json({
                ok: false,
                mensaje: 'Error al mover archivo',
                errors: err
            });
        }
    });




    subirPorTipo(tipo, nuevoNombre, id, res)

    /*res.status(200).json({
        mensaje: 'Archivo movido..! ',
        ok: 'true',
        nuevoNombre: nuevoNombre
    });*/


});

function subirPorTipo(tipo, nombre, id, res) {

    if (tipo === 'usuarios') {

        Usuario.findById(id, (err, usuario) => {

            if (err) {
                return res.status(400).json({
                    ok: false,
                    mensaje: 'Usuario no existe...!',
                    errors: err
                });
            }


            var pathAnterior = './uploads/usuarios/' + usuario.img;
            if (fs.existsSync(pathAnterior)) {
                fs.unlink(pathAnterior);
            }

            usuario.img = nombre;
            usuario.save((err, usuarioActualizado) => {

                if (err) {
                    return res.status(500).json({
                        ok: false,
                        mensaje: 'Error al actualizar el usuario...!',
                        errors: err
                    });
                }

                res.status(200).json({
                    ok: 'true',
                    usuario: usuarioActualizado.img
                });

            });

        });


    } else
    if (tipo === 'medicos') {

        Medico.findById(id, (err, medico) => {

            if (err) {
                return res.status(400).json({
                    ok: false,
                    mensaje: 'Medico no existe...!',
                    errors: err
                });
            }


            var pathAnterior = './uploads/medicos/' + medico.img;
            if (fs.existsSync(pathAnterior)) {
                fs.unlink(pathAnterior);
            }

            medico.img = nombre;
            medico.save((err, medicoActualizado) => {

                if (err) {
                    return res.status(500).json({
                        ok: false,
                        mensaje: 'Error al actualizar el medico...!',
                        errors: err
                    });
                }

                res.status(200).json({
                    ok: 'true',
                    medico: medicoActualizado.img
                });

            });

        });




    } else
    if (tipo === 'hospitales') {


        Hospital.findById(id, (err, hospital) => {

            if (err) {
                return res.status(400).json({
                    ok: false,
                    mensaje: 'Hospital no existe...!',
                    errors: err
                });
            }


            var pathAnterior = './uploads/hospitales/' + hospital.img;
            if (fs.existsSync(pathAnterior)) {
                fs.unlink(pathAnterior);
            }

            hospital.img = nombre;
            hospital.save((err, hospitalActualizado) => {

                if (err) {
                    return res.status(500).json({
                        ok: false,
                        mensaje: 'Error al actualizar el hospital...!',
                        errors: err
                    });
                }

                res.status(200).json({
                    ok: 'true',
                    hospital: hospitalActualizado.img
                });

            });

        });



    }


}

module.exports = app;