'use strict'

var validator = require('validator');
var profesor = require('../models/profesor');
var fs = require('fs');
var path = require('path');
const { default: mongoose } = require('mongoose');

var controller = {

    save: (req, res) => {
        // Recoger parametros por post
        var params = req.body;

        // Validar datos (validator)
        try {
            var validate_nombre = !validator.isEmpty(params.nombre);  
            var validate_contrato = !validator.isEmpty(params.contrato);
            var validate_cargo = !validator.isEmpty(params.cargo);
            var validate_area = !validator.isEmpty(params.area);


        } catch (err) {
            return res.status(200).send({
                status: 'error',
                message: 'Faltan datos por enviar'
            });
        }

        if (validate_nombre &&  validate_contrato && validate_cargo && validate_area) {

            
            //Crear el objeto a guardar
            var profesor1 = new profesor();


            //asignar valores
            profesor1.nombre = params.nombre;
            profesor1.contrato = params.contrato;
            profesor1.cargo = params.cargo;
            profesor1.area = params.area;
        

            //guardar el articulo
            profesor1.save().then( (profesorStored) => {

                if (!profesorStored) {
                    return res.status(404).send({
                        status: 'error',
                        message: 'El profesor no se ha guardado.'
                    });
                }

                // devolder respuesta
                return res.status(200).send({
                    status: 'success',
                    profesor: profesorStored
                });

            });



        } else {
            return res.status(200).send({
                status: 'error',
                message: 'Los datos no son validos'
            });
        }
    },

    getProfesores: (req, res) => {

        var query = profesor.find({});

        var last = req.params.last;

        if (last || last != undefined) {
            query.limit(5);
        }

        //find 
        query.sort('-_id').then((profesores) => {

            if (!profesores) {
                return res.status(404).send({
                    status: 'error',
                    message: 'No hay profesores para mostrar'
                });
            }

            return res.status(200).send({
                status: 'success',
                profesores
            });

        });

    },

    getProfesor: (req, res) => {

        //recoger el id de la url

        var profesorId = req.params.id
        var profesorIdValid = mongoose.Types.ObjectId.isValid(profesorId);
        //comprobar que existe
        if(profesorIdValid){

        
        if (!profesorId || profesor == null) {
            return res.status(404).send({
                status: 'error',
                message: 'No existe el profesor'
            });
        } else {
            profesor.findById(profesorId).then((profesor) => {

                if (!profesor) {
                    return res.status(404).send({
                        status: 'error',
                        message: 'No existe el profesor'
                    });
                }

                return res.status(200).send({
                    status: 'success',
                    profesor
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
        var profesorId = req.params.id

        //recoger datos del put

        var params = req.body;
        
        var profesorIdValid = mongoose.Types.ObjectId.isValid(profesorId);
        //validar datos
        try {
            var validate_nombre = !validator.isEmpty(params.nombre); 
            var validate_contrato = !validator.isEmpty(params.contrato);
            var validate_cargo = !validator.isEmpty(params.cargo);
            var validate_area = !validator.isEmpty(params.area);
        } catch (err) {
            return res.status(200).send({
                status: 'error',
                message: 'Faltan datos por enviar'
            });
        }

        if ( profesorId.match(/^[0-9a-fA-F]{24}$/) && profesorIdValid && validate_nombre &&  validate_contrato && validate_cargo && validate_area ) {
           
            profesor.findOneAndUpdate({ _id: profesorId }, params, { new: true }).then( (profesorUpdated) => {
                
                if (!profesorUpdated) {
                    return res.status(404).send({
                        status: 'error',
                        message: 'No existe el profesor'
                    });
                }

                return res.status(200).send({
                    status: 'success',
                    profesor: profesorUpdated
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

        var profesorId = req.params.id;


        profesor.findByIdAndDelete({ _id: profesorId }).then((profesorRemoved) => {
            
            if (!profesorRemoved) {
                return res.status(404).send({
                    status: 'error',
                    message: 'Profesor no existe'
                });
            }

            return res.status(200).send({
                status: 'success',
                profesor: profesorRemoved
            });
        });
    },

    search: (req, res) => {

        //sacar strin a buscar

        var searchString = req.params.search1;
        //find and 

        profesor.find({
            "$or": [
                {
                    "nombre": { "$regex": searchString, "$options": "i"}
                }
                ,
                
                {
                    "abreviatura": { "$regex": searchString, "$options": "i"}
                },
                {
                    "contrato": { "$regex": searchString, "$options": "i"}
                },
                {
                    "area": { "$regex": searchString, "$options": "i"}
                },
                {
                    "cargo": { "$regex": searchString, "$options": "i"}
                }
            ]
        })
           .sort([['date', 'descending']])
            .then((profesores) => {
                if (!profesores || profesores.length <= 0) {
                    return res.status(404).send({
                        status: 'error',
                        message: 'No hay profesores para mostrar'
                    });
                }

                return res.status(200).send({
                    status: 'success',
                    profesores
                });
            })

    },

    /* searchOne: (req, res) => {

        //sacar strin a buscar

        var searchString = req.params.search1;
        //find and 
        console.log(searchString)
        asignatura.find({
            "$or": [
                {
                    "carrera": { "$regex": searchString}
                },
                {
                    "semestre": { "$regex": searchString}
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
            }) */

   
            


}; //end controller


module.exports = controller;