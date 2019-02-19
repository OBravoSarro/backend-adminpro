var express = require('express');
var bcrypt = require('bcryptjs');

var app = express();

var User = require('../models/user');


// =============================================
// Get users
// =============================================

app.get('/', (req, res, next) => {
    User.find({ }, 'name lastname email img role')
    .exec(
        (err, users) => {
            if( err ){
                return res.status(500).json({
                    ok: false,
                    message: 'User error DB',
                    errors: err
                });
            }else{
                res.status(200).json({
                    ok: true,
                    users: users
                });
            }
        });
});

// =============================================
// New user
// =============================================
app.post('/', (req, res) => {

    var body = req.body;

    var user = new User({
        name: body.name,
        lastname: body.lastname,
        email: body.email,
        password: bcrypt.hashSync(body.password, 10),
        img: body.img,
        role: body.role
    });

    user.save( ( err, userSave ) => {
        if( err ){
            return res.status(400).json({
                ok: false,
                message: 'New user error DB',
                errors: err
            });
        }else{
            res.status(201).json({
                ok: true,
                user: userSave
            });
        }
    });

});




module.exports = app;