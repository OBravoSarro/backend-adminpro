var express = require('express');
var app = express();

var mdAuthentication = require('../middlewares/authentication');

var Hospital = require('../models/hospital');

// =============================================
// Get hospitals
// =============================================

app.get('/', (req, res, next) => {
    Hospital.find({ }, 'name img user')
    .exec(
        (err, dataRes) => {
            if( err ){
                return res.status(500).json({
                    ok: false,
                    message: 'Hospital error DB',
                    errors: err
                });
            }

            res.status(200).json({
                ok: true,
                data: dataRes
            });

        });
});

// =============================================
// New hospital
// =============================================
app.post('/', mdAuthentication.verifyToken,  (req, res) => {

    var body = req.body;

    var hospital = new Hospital({
        name: body.name,
        img: body.img,
        user: req.user._id
    });

    hospital.save( ( err, dataRes ) => {
        if( err ){
            return res.status(400).json({
                ok: false,
                message: 'New hospital error DB',
                errors: err
            });
        }

        res.status(201).json({
            ok: true,
            data: dataRes,
            userAuth: req.user
        });

    });

});

// =============================================
// Update hospital
// =============================================
app.put('/:id', mdAuthentication.verifyToken, (req, res) => {

    var id = req.params.id;
    var body = req.body;

    Hospital.findById( id, ( err, hospital ) => {
        if( err ){
            return res.status(500).json({
                ok: false,
                message: 'Find by id error',
                errors: err
            });
        }

        if( !hospital ){
            return res.status(400).json({
                ok: false,
                message: 'Hospital not found',
                errors: {message: "Hospital not found"}
            });
        }

        hospital.name = body.name;
        hospital.user = req.user._id;

        hospital.save( ( err, dataRes ) => {
            if( err ){
                return res.status(400).json({
                    ok: false,
                    message: 'Update user error DB',
                    errors: err
                });
            }

            res.status(200).json({
                ok: true,
                data: dataRes,
                userAuth: req.user
            });

        });

    });

});

// =============================================
//  Delete hostpital
// =============================================
app.delete('/:id', mdAuthentication.verifyToken, (req, res) => {

    var id = req.params.id;

    Hospital.findByIdAndRemove( id, ( err, dataRes ) => {
        if( err ){
            return res.status(500).json({
                ok: false,
                message: 'Delete hospital error',
                errors: err
            });
        }

        if( !dataRes ){
            return res.status(400).json({
                ok: false,
                message: 'Hospital not found',
                errors: {message: "Hospital not found"}
            });
        }

        return res.status(200).json({
            ok: true,
            data: dataRes,
            userAuth: req.user
        });


    });

});

module.exports = app;