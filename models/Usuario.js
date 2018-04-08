var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var uniqueValidator = require('mongoose-unique-validator');
var rolesValids = {
    values: ['admin-role', 'user-role'],
    message: 'el rol {VALUE} no es un rol permitido'
};

var usuarioSchema = new Schema({
    nombre: { type: String, required: [true, 'El nombre es un campo obligatorio'] },
    email: { type: String, required: [true, 'El correo es un campo obligatorio'], unique: true },
    password: { type: String, required: [true, 'El password es un campo obligatorio'] },
    img: { type: String, required: false },
    role: { type: String, required: false, default: 'user-role', enum: rolesValids }
}, { collection: 'usuarios' });
usuarioSchema.plugin(uniqueValidator, { message: 'El comapo {PATH} debe ser único' });

module.exports = mongoose.model('Usuario', usuarioSchema);