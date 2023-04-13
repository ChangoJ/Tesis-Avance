'use strict'

var validator = require('validator');
var aula = require('../models/aula');
var fs = require('fs');
var path = require('path');
const { default: mongoose } = require('mongoose');

var controller = {

    save: (req, res) => {
        // Recoger parametros por post
        var params = req.body;
        console.log("FUKK")

        // Validar datos (validator)
        try {
            var validate_nombre = !validator.isEmpty(params.nombre); 
            var validate_ubicacion = !validator.isEmpty(params.ubicacion);  
            var validate_compartida = !validator.isEmpty(params.compartida);
            var validate_abreviatura = !validator.isEmpty(params.abreviatura);
            var validate_color = !validator.isEmpty(params.color);


        } catch (err) {
            return res.status(200).send({
                status: 'error',
                message: 'Faltan datos por enviar'
            });
        }

        if (validate_nombre &&   validate_ubicacion &&  validate_abreviatura && validate_compartida && validate_color) {

            
            //Crear el objeto a guardar
            var aula1 = new aula();


            //asignar valores
            aula1.nombre = params.nombre;
            aula1.ubicacion = params.ubicacion;
            aula1.abreviatura = params.abreviatura;
            aula1.compartida = params.compartida;
            aula1.color = params.color;
            
        

            //guardar el articulo
            aula1.save().then( (aulaStored) => {

                if (!aulaStored) {
                    return res.status(404).send({
                        status: 'error',
                        message: 'El aula no se ha guardado.'
                    });
                }

                // devolder respuesta
                return res.status(200).send({
                    status: 'success',
                    aula: aulaStored
                });

            });



        } else {
            return res.status(200).send({
                status: 'error',
                message: 'Los datos no son validos'
            });
        }
    },

    getAulas: (req, res) => {

        var query = aula.find({});

        var last = req.params.last;

        if (last || last != undefined) {
            query.limit(5);
        }

        //find 
        query.sort('-_id').then((aulas) => {

            if (!aulas) {
                return res.status(404).send({
                    status: 'error',
                    message: 'No hay aulas para mostrar'
                });
            }

            return res.status(200).send({
                status: 'success',
                aulas
            });

        });

    },

    getAula: (req, res) => {

        //recoger el id de la url

        var aulaId = req.params.id
        console.log(aulaId);
        var aulaIdValid = mongoose.Types.ObjectId.isValid(aulaId);
        //comprobar que existe
        if(aulaIdValid){

        
        if (!aulaId || aula == null) {
            return res.status(404).send({
                status: 'error',
                message: 'No existe la aula'
            });
        } else {
            aula.findById(aulaId).then((aula) => {

                if (!aula) {
                    return res.status(404).send({
                        status: 'error',
                        message: 'No existe la aula'
                    });
                }

                return res.status(200).send({
                    status: 'success',
                    aula
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
        var aulaId = req.params.id

        //recoger datos del put

        var params = req.body;
        
        var aulaIdValid = mongoose.Types.ObjectId.isValid(aulaId);
        //validar datos
        try {
            var validate_nombre = !validator.isEmpty(params.nombre); 
            var validate_ubicacion = !validator.isEmpty(params.ubicacion);  
            var validate_compartida = !validator.isEmpty(params.compartida);
            var validate_abreviatura = !validator.isEmpty(params.abreviatura);
            var validate_color = !validator.isEmpty(params.color);
        } catch (err) {
            return res.status(200).send({
                status: 'error',
                message: 'Faltan datos por enviar'
            });
        }

        if ( aulaId.match(/^[0-9a-fA-F]{24}$/) && aulaIdValid && validate_nombre &&   validate_ubicacion &&  validate_abreviatura && validate_compartida && validate_color) {
           
            aula.findOneAndUpdate({ _id: aulaId }, params, { new: true }).then( (aulaUpdated) => {
                
                if (!aulaUpdated) {
                    return res.status(404).send({
                        status: 'error',
                        message: 'No existe la aula'
                    });
                }

                return res.status(200).send({
                    status: 'success',
                    aula: aulaUpdated
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

        var aulaId = req.params.id;


        aula.findByIdAndDelete({ _id: aulaId }).then((aulaRemoved) => {
            
            if (!aulaRemoved) {
                return res.status(404).send({
                    status: 'error',
                    message: 'Aula no existe'
                });
            }

            return res.status(200).send({
                status: 'success',
                aula: aulaRemoved
            });
        });
    },

    search: (req, res) => {

        //sacar strin a buscar

        var searchString = req.params.search1;
        //find and 

        aula.find({
            "$or": [
                {
                    "nombre": { "$regex": searchString, "$options": "i"}
                },
                {
                    "ubicacion": { "$regex": searchString, "$options": "i"}
                },
                {
                    "abreviatura": { "$regex": searchString, "$options": "i"}
                }
            ]
        })
           .sort([['date', 'descending']])
            .then((aulas) => {
                if (!aulas || aulas.length <= 0) {
                    return res.status(404).send({
                        status: 'error',
                        message: 'No hay aulas para mostrar'
                    });
                }
                
                return res.status(200).send({
                    status: 'success',
                    aulas
                    
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