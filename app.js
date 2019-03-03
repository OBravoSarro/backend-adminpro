// Requires
var express = require('express');
var mongoose = require('mongoose');
var bodyParser = require('body-parser');

//Import routes
var appRoutes = require('./routes/app');
var appUser = require('./routes/user');
var appLogin = require('./routes/login');
var appHospital = require('./routes/hospital');
var appDoctor = require('./routes/doctor');
var appSearch = require('./routes/search');
var appUpload = require('./routes/upload');
var appImgs = require('./routes/imgs');

//var STORAGE = require('./config/config').STORAGE;

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

// Server index config
/* var serveIndex = require('serve-index');
app.use(express.static(__dirname + '/'))
app.use('/'+STORAGE.storageFolder, serveIndex(__dirname + '/'+STORAGE.storageFolder)); */

// Routes
app.use('/', appRoutes);
app.use('/user', appUser);
app.use('/login', appLogin);
app.use('/hospital', appHospital);
app.use('/doctor', appDoctor);
app.use('/search', appSearch);
app.use('/upload', appUpload);
app.use('/img', appImgs);

// Escuchar peticiones
app.listen(3000, () => {
    console.log('Express server port 3000: \x1b[32m%s\x1b[0m','online');
});