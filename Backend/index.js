'use strict'

var mongoose = require('mongoose');
var app = require('./app')
var port = 3900;

mongoose.Promise = global.Promise;
mongoose.connect('mongodb://localhost:27017/sistema_creacion_horarios', { useNewUrlParser: true, useUnifiedTopology: true})
        .then(() => {
            console.log("Conexion a BD Exitosa!");

            // Crear servidor y recibir peticiones HTTP
            app.listen(port, () =>{
                console.log("Servidor Exitoso http://localhost:"+port);
            });
        });

