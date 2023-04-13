'use strict'

var validator = require('validator');
var asignatura = require('../models/asignatura');
var fs = require('fs');
var path = require('path');
const { default: mongoose } = require('mongoose');

var controller = {

    save: (req, res) => {
        // Recoger parametros por post
        var params = req.body;

        // Validar datos (validator)
        try {
            var validate_nombre = !validator.isEmpty(params.nombre); /* 
            var validate_carrera = !validator.isEmpty(params.carrera);   */
            /* var validate_semestre = !validator.isEmpty(params.semestre); */
            var validate_abreviatura = !validator.isEmpty(params.abreviatura);
            var validate_color = !validator.isEmpty(params.color);


        } catch (err) {
            return res.status(200).send({
                status: 'error',
                message: 'Faltan datos por enviar'
            });
        }
        console.log(params.carrera.length)
        console.log(params.semestre.length)

        if (validate_nombre && params.carrera.length !== 0 && params.semestre.length !== 0 && params.profesor.length !== 0  && validate_abreviatura && validate_color) {


            //Crear el objeto a guardar
            var asignatura1 = new asignatura();


            //asignar valores
            asignatura1.nombre = params.nombre;
            asignatura1.carrera = params.carrera;
            asignatura1.semestre = params.semestre;
            asignatura1.profesor = params.profesor;
            asignatura1.abreviatura = params.abreviatura;
            asignatura1.color = params.color;



            //guardar el articulo
            asignatura1.save().then((asignaturaStored) => {

                if (!asignaturaStored) {
                    return res.status(404).send({
                        status: 'error',
                        message: 'La asignatura no se ha guardado.'
                    });
                }

                // devolder respuesta
                return res.status(200).send({
                    status: 'success',
                    asignatura: asignaturaStored
                });

            });



        } else {
            return res.status(200).send({
                status: 'error',
                message: 'Los datos no son validos'
            });
        }
    },

    getAsignaturas: (req, res) => {

        var query = asignatura.find({});

        var last = req.params.last;

        if (last || last != undefined) {
            query.limit(5);
        }

        //find 
        query.sort('-_id').then((asignaturas) => {

            if (!asignaturas) {
                return res.status(404).send({
                    status: 'error',
                    message: 'No hay articulos para mostrar'
                });
            }

            return res.status(200).send({
                status: 'success',
                asignaturas
            });

        });

    },

    getAsignatura: (req, res) => {

        //recoger el id de la url

        var asignaturaId = req.params.id
        var asignaturaIdValid = mongoose.Types.ObjectId.isValid(asignaturaId);
        console.log(asignaturaIdValid);
        //comprobar que existe
        if (asignaturaIdValid) {
            if (!asignaturaId || asignatura == null) {
                return res.status(404).send({
                    status: 'error',
                    message: 'No existe la asignatura'
                });
            } else {
                asignatura.findById(asignaturaId).then((asignatura) => {

                    if (!asignatura) {
                        return res.status(404).send({
                            status: 'error',
                            message: 'No existe la asignatura'
                        });
                    }

                    return res.status(200).send({
                        status: 'success',
                        asignatura
                    });

                });
            }
        } else {
            return res.status(200).send({
                status: 'error',
                message: 'La validacion no es correcta'
            });
        }
    },

    update: (req, res) => {
        //recoger el id del articulo por la url
        var asignaturaId = req.params.id

        //recoger datos del put

        var params = req.body;

        //validar datos
        try {
            var validate_nombre = !validator.isEmpty(params.nombre);
            /* var validate_carrera = !validator.isEmpty(params.carrera);
            var validate_semestre = !validator.isEmpty(params.semestre); */
            var validate_abreviatura = !validator.isEmpty(params.abreviatura);
            var validate_color = !validator.isEmpty(params.color);
        } catch (err) {
            return res.status(200).send({
                status: 'error',
                message: 'Faltan datos por enviar'
            });
        }

        if (asignaturaId.match(/^[0-9a-fA-F]{24}$/) && validate_nombre && params.carrera.length !== 0 && params.semestre.length !== 0 && params.profesor.length !== 0 && validate_abreviatura && validate_color) {

            asignatura.findOneAndUpdate({ _id: asignaturaId }, params, { new: true }).then((asignaturaUpdated) => {

                if (!asignaturaUpdated) {
                    return res.status(404).send({
                        status: 'error',
                        message: 'No existe la asignatura'
                    });
                }

                return res.status(200).send({
                    status: 'success',
                    asignatura: asignaturaUpdated
                });

            });
        } else {
            return res.status(200).send({
                status: 'error',
                message: 'La validacion no es correcta'
            });
        }

    },

    delete: (req, res) => {

        var asignaturaId = req.params.id;


        asignatura.findByIdAndDelete({ _id: asignaturaId }).then((asignaturaRemoved) => {

            if (!asignaturaRemoved) {
                return res.status(404).send({
                    status: 'error',
                    message: 'Articulo no existe'
                });
            }

            return res.status(200).send({
                status: 'success',
                asignatura: asignaturaRemoved
            });
        });
    },

    search: (req, res) => {

        //sacar strin a buscar

        var searchString = req.params.search1;
        var search2Int = req.params.search2;
        console.log(searchString)
        //find and 

        asignatura.find({
            "$and": [
                {
                    "carrera": { "$regex": searchString, "$options": "i" }
                },
                {
                    "semestre": { "$regex": search2Int, "$options": "i" }
                }
            ]
        })
            .sort([['date', 'descending']])
            .then((asignaturas) => {
                if (!asignaturas || asignaturas.length <= 0) {
                    return res.status(404).send({
                        status: 'error',
                        message: 'No hay asignaturas para mostrar'
                    });
                }

                return res.status(200).send({
                    status: 'success',
                    asignaturas
                });
            })

    },

    searchOne: (req, res) => {

        //sacar strin a buscar

        var searchString = req.params.search1;
        //find and 
        asignatura.find({
            "$or": [
                {
                    "carrera": { "$regex": searchString, "$options": "i" }
                },
                {
                    "semestre": { "$regex": searchString, "$options": "i" }
                },
                {
                    "profesor": { "$elemMatch": { "nombre": { "$regex": searchString, "$options": "i" } } }
                },
                {
                    "nombre": { "$regex": searchString, "$options": "i" }
                },
                {
                    "abreviatura": { "$regex": searchString, "$options": "i" }
                }
            ]
        })
            .sort([['date', 'descending']])
            .then((asignaturas) => {
                if (!asignaturas || asignaturas.length <= 0) {
                    return res.status(404).send({
                        status: 'error',
                        message: 'No hay asignaturas para mostrar'
                    });
                }

                return res.status(200).send({
                    status: 'success',
                    asignaturas
                });
            })

    }


}; //end controller


module.exports = controller;