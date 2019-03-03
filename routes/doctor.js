var express = require('express');
var app = express();

var mdAuthentication = require('../middlewares/authentication');

var Doctor = require('../models/doctor');
var PAGINATE_LIMIT = require('../config/config').PAGINATE_LIMIT;

// =============================================
// Get doctors
// =============================================

app.get('/', (req, res, next) => {

    var from = req.query.from || 0;
    from = Number(from);

    var size = req.query.size || PAGINATE_LIMIT;
    size = Number(size);

    Doctor.find({ }, 'name img user hospital')
    .skip(from*size)
    .limit(size)
    .populate('user', 'name lastname email img')
    .populate('hospital', 'name')
    .exec(
        (err, dataRes) => {
            if( err ){
                return res.status(500).json({
                    ok: false,
                    message: 'Doctor error DB',
                    errors: err
                });
            }

            Doctor.countDocuments({}, (err, result) => {

                if( err ){
                    return res.status(500).json({
                        ok: false,
                        message: 'User error DB',
                        errors: err
                    });
                }

                res.status(200).json({
                    ok: true,
                    data: dataRes,
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
// New doctor
// =============================================
app.post('/', mdAuthentication.verifyToken,  (req, res) => {

    var body = req.body;

    var doctor = new Doctor({
        name: body.name,
        img: body.img,
        user: req.user._id,
        hospital: body.hospital
    });

    doctor.save( ( err, dataRes ) => {
        if( err ){
            return res.status(400).json({
                ok: false,
                message: 'New doctor error DB',
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
// Update doctor
// =============================================
app.put('/:id', mdAuthentication.verifyToken, (req, res) => {

    var id = req.params.id;
    var body = req.body;

    Doctor.findById( id, ( err, doctor ) => {
        if( err ){
            return res.status(500).json({
                ok: false,
                message: 'Find by id error',
                errors: err
            });
        }

        if( !doctor ){
            return res.status(400).json({
                ok: false,
                message: 'Doctor not found',
                errors: {message: "Doctor not found"}
            });
        }

        doctor.name = body.name;
        doctor.user = req.user._id;
        doctor.hospital = body.hospital;

        doctor.save( ( err, dataRes ) => {
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
//  Delete doctor
// =============================================
app.delete('/:id', mdAuthentication.verifyToken, (req, res) => {

    var id = req.params.id;

    Doctor.findByIdAndRemove( id, ( err, dataRes ) => {
        if( err ){
            return res.status(500).json({
                ok: false,
                message: 'Delete doctor error',
                errors: err
            });
        }

        if( !dataRes ){
            return res.status(400).json({
                ok: false,
                message: 'Doctor not found',
                errors: {message: "Doctor not found"}
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