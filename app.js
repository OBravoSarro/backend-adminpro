// Requires
var express = require('express');
var mongoose = require('mongoose');
var bodyParser = require('body-parser');

//Import routes
var appRoutes = require('./routes/app');
var appUser = require('./routes/user');

// Inicializar variables
var app = express();

// Conexion a base de datos
mongoose.set('useCreateIndex', true);
mongoose.connect('mongodb://localhost:27017/hospitalDB', { useNewUrlParser: true }, (err, res) => {
    if(err) throw err;
    console.log('DB port 27017: \x1b[32m%s\x1b[0m','online');
});


// Body Parser
// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

//  routes
app.use('/', appRoutes);
app.use('/user', appUser);

// Escuchar peticiones
app.listen(3000, () => {
    console.log('Express server port 3000: \x1b[32m%s\x1b[0m','online');
});