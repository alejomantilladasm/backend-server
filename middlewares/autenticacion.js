var jwt = require('jsonwebtoken');
var SEED = require('../config/config').SEED;

// ---------------------------------------------------------
//  Verificar token...
// ---------------------------------------------------------
exports.verificaToken = function(req, res, next) {
    var token = req.query.token;
    jwt.verify(token, SEED, (err, decode) => {

        if (err) {
            return res.status(401).json({
                mensaje: 'Token no válido ...!',
                ok: 'false',
                errors: err
            });
        } else {
            // return res.status(200).json({
            //     ok: 'true',
            //     decode: decode
            // });
            req.usuario = decode.usuaior;
            next();
        }

    });
};