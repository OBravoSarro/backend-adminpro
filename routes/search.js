var express = require('express');

var app = express();

var Hospital = require('../models/hospital');
var Doctor = require('../models/doctor');
var User = require('../models/user');

var PAGINATE_LIMIT = require('../config/config').PAGINATE_LIMIT;


// =============================================
// Search all
// =============================================
app.get('/all', (req, res, next) => {

    let size = req.query.size || PAGINATE_LIMIT;
    size = Number(size);

    const search = req.query.search || '';
    const regex = new RegExp( search, 'i' );

    Promise.all( [
        searchHospitals( regex, size ),
        searchDoctors( regex, size ),
        searchUsers( regex, size ) ]
    ).then(( data ) => {
        res.status(200).json({
            ok: true,
            data: {
                hospitals: data[0],
                doctors: data[1],
                users: data[2]
            }
        });
    });

});

// =============================================
// Search collection
// =============================================
app.get('/:collection', (req, res, next) => {

    let size = req.query.size || PAGINATE_LIMIT;
    size = Number(size);

    const search = req.query.search || '';
    const regex = new RegExp( search, 'i' );

    let  collectionFunction;

    switch (req.params.collection) {
        case 'hospitals':
        collectionFunction = searchHospitals( regex, size );
            break;
        case 'doctors':
        collectionFunction = searchDoctors( regex, size );
            break;
        case 'users':
        collectionFunction = searchUsers( regex, size );
            break;
        default:
            res.status(400).json({
                ok: false,
                message: 'Collection not found',
                error: { message: 'Collection not found' }
            });
            break;
    }

    collectionFunction.then(( data ) => {
        res.status(200).json({
            ok: true,
            data: data
        });
    });

});



function searchHospitals(searchRegexp, size){
    return new Promise( (resolve, reject) => {
        Hospital.find({ name: searchRegexp },  'name img user')
            .limit( size )
            .populate('user', 'name lastname email img')
            .exec(( err, hospitals ) => {
                if( err ){
                    reject('Hospitals error', err);
                }else{
                    resolve( hospitals );
                }
            });
    });
}

function searchDoctors(searchRegexp, size){
    return new Promise( (resolve, reject) => {
        Doctor.find({ name: searchRegexp })
            .limit( size )
            .populate('user', 'name lastname email img')
            .populate('hospital', 'name')
            .exec(( err, doctors ) => {
                if( err ){
                    reject('Doctors error', err);
                }else{
                    resolve( doctors );
                }
            });
    });
}

function searchUsers(searchRegexp, size){
    return new Promise( (resolve, reject) => {
        User.find({}, 'name lastname email role img')
            .or( [ { name: searchRegexp }, { lastname: searchRegexp }, { email: searchRegexp } ] )
            .limit( size )
            .exec(( err, users ) => {
                if( err ){
                    reject('Users error', err);
                }else{
                    resolve( users );
                }
            });
    });
}

module.exports = app;