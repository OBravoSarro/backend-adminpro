var express = require('express');
var app = express();

var mdAuthentication = require('../middlewares/authentication');

var Hospital = require('../models/hospital');
var PAGINATE_LIMIT = require('../config/config').PAGINATE_LIMIT;

// =============================================
// Get hospitals
// =============================================

app.get('/', (req, res, next) => {

    var from = req.query.from || 0;
    from = Number(from);

    var size = req.query.size || PAGINATE_LIMIT;
    size = Number(size);

    Hospital.find({ }, 'name img user')
    .skip(from*size)
    .limit(size)
    .populate('user', 'name lastname email img')
    .exec(
        (err, dataRes) => {
            if( err ){
                return res.status(500).json({
                    ok: false,
                    message: 'Hospital error DB',
                    errors: err
                });
            }

            Hospital.countDocuments({}, (err, result) => {

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