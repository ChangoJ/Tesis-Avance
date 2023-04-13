'use strict'

var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var ProfesorScheme = Schema({
    nombre: String,
    contrato: String,
    cargo: String,
    area: String
});

module.exports = mongoose.model('Profesor', ProfesorScheme);
