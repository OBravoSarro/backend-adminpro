// Requires
var express = require('express');
var mongoose = require('mongoose');

// Inicializar variables
var app = express();

// Conexion a base de datos
mongoose.connection.openUri('mongodb://localhost:27017/hospitalDB', (err, res) => {
    if(err) throw err;
    console.log('DB port 27017: \x1b[32m%s\x1b[0m','online');
});

//Rutas
app.get('/', (req, res, next) => {
    res.status(200).json({
        ok: true,
        message: 'success'
    });
});

// Escuchar peticiones
app.listen(3000, () => {
    console.log('Express server port 3000: \x1b[32m%s\x1b[0m','online');
});