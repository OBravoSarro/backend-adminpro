var express = require('express');
var bcrypt = require('bcryptjs');
var jwt = require('jsonwebtoken');

var SEED = require('../config/config').SEED;

var app = express();
var User = require('../models/user');


// =============================================
// Login user
// =============================================
app.post('/', (req, res) => {

    var body = req.body;

    User.findOne({ email: body.email }, (err, userDB) => {

        if( err ){
            return res.status(500).json({
                ok: false,
                message: 'Login error',
                errors: err
            });
        }

        if( !userDB ){
            return res.status(400).json({
                ok: false,
                message: 'Email not found',
                errors: err
            });
        }

        if( !bcrypt.compareSync( body.password, userDB.password )){
            return res.status(400).json({
                ok: false,
                message: 'Password not valid',
                errors: err
            });
        }

        // Crear token
        userDB.password = ":)";
        var token = jwt.sign({ user: userDB }, SEED, { expiresIn: 14400 }); // 4 horas

        res.status(200).json({
            ok: true,
            user: userDB,
            token: token,
            id: userDB._id
        });

    });



});

module.exports = app;