'use strict'

var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var AulaScheme = Schema({
    nombre: String,
    ubicacion: String,
    abreviatura: String,
    compartida: String,
    color: String
});

module.exports = mongoose.model('Aula', AulaScheme);
