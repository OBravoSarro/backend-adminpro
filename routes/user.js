var express = require('express');
var bcrypt = require('bcryptjs');

var mdAuthentication = require('../middlewares/authentication');

var app = express();
var User = require('../models/user');
var PAGINATE_LIMIT = require('../config/config').PAGINATE_LIMIT;


// =============================================
// Get users
// =============================================

app.get('/', (req, res, next) => {

    var from = req.query.from || 0;
    from = Number(from);

    var size = req.query.size || PAGINATE_LIMIT;
    size = Number(size);

    User.find({ }, 'name lastname email img role google')
    .skip(from*size)
    .limit(size)
    .exec(
        (err, users) => {
            if( err ){
                return res.status(500).json({
                    ok: false,
                    message: 'User error DB',
                    errors: err
                });
            }

            User.countDocuments({}, (err, result) => {

                if( err ){
                    return res.status(500).json({
                        ok: false,
                        message: 'User error DB',
                        errors: err
                    });
                }

                res.status(200).json({
                    ok: true,
                    users: users,
                    total: result,
                    pagination:{
                        actual: from,
                        pages: Math.ceil(result/size),
                        size: size
                    }
                });

            });

        });
});

// =============================================
// New user
// =============================================
app.post('/', mdAuthentication.verifyToken,  (req, res) => {

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
        }

        res.status(201).json({
            ok: true,
            data: userSave,
            userAuth: req.user
        });

    });

});

// =============================================
// Update user
// =============================================
app.put('/:id', mdAuthentication.verifyToken, (req, res) => {

    var id = req.params.id;
    var body = req.body;

    User.findById( id, ( err, user ) => {
        if( err ){
            return res.status(500).json({
                ok: false,
                message: 'Find by id error',
                errors: err
            });
        }

        if( !user ){
            return res.status(400).json({
                ok: false,
                message: 'User not found',
                errors: err
            });
        }

        user.name = body.name;
        user.lastname = body.lastname;
        user.email = body.email;
        user.role = body.role;

        user.save( ( err, userSave ) => {
            if( err ){
                return res.status(400).json({
                    ok: false,
                    message: 'Update user error DB',
                    errors: err
                });
            }

            userSave.password = "";

            res.status(200).json({
                ok: true,
                user: userSave
            });

        });

    });

});

// =============================================
//  Delete user
// =============================================
app.delete('/:id', mdAuthentication.verifyToken, (req, res) => {

    var id = req.params.id;

    User.findByIdAndRemove( id, ( err, userData ) => {
        if( err ){
            return res.status(500).json({
                ok: false,
                message: 'Delete errorr',
                errors: err
            });
        }

        if( !userData ){
            return res.status(400).json({
                ok: false,
                message: 'User not found',
                errors: {message: "User not found"}
            });
        }

        return res.status(200).json({
            ok: true,
            user: userData
        });


    });

});

module.exports = app;