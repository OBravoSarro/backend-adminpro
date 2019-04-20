const express = require('express');
const fileUpload = require('express-fileupload');
const fs = require('fs');
const app = express();

var User = require('../models/user');
var Hospital = require('../models/hospital');
var Doctor = require('../models/doctor');

var STORAGE = require('../config/config').STORAGE;

// default options
app.use(fileUpload());

app.put('/:collection/:id', (req, res, next) => {

    const collection = req.params.collection;
    const id = req.params.id;

    if( !req.files ){
        return res.status(400).json({
            ok: false,
            message: 'No file to upload',
            errors: {message: 'No file to upload'}
        });
    }

    // Get file name
    const file = req.files.img;
    let extension = file.name.split('.');
    extension = extension[extension.length - 1];
    // Valid extensions
    const validExtensions = ['png','jpg','jpeg','gif'];
    const validCollections = ['users','hospitals','doctors'];

    if(validExtensions.indexOf(extension) < 0){
        return res.status(400).json({
            ok: false,
            message: 'Invalid file',
            errors: {message: 'File formats: ' + validExtensions.join(', ')}
        });
    }

    // Name file generator
    const nameFile = `${ id }-${ new Date().getMilliseconds() }.${ extension }`;

    switch (collection) {
        case 'users':
            uploadToUser( id, nameFile, file, res );
            break;

        case 'hospitals':
            uploadToHospital( id, nameFile, file, res );
            break;

        case 'doctors':
            uploadToDoctor( id, nameFile, file, res );
            break;

        default:
            res.status(400).json({
                ok: false,
                message: 'Invalid collection',
                errors: {message: 'Collections ' + validCollections.join(', ')}
            });
            break;
    }

});

function mvFile( file, path, res ){
    file.mv( path, err => {
        if( err ){
            return res.status(500).json({
                ok: false,
                message: 'Upload error',
                errors: {message: 'Upload error', err}
            });
        }
    });
}

function deleteFile( path ){
    if( fs.existsSync( path ) ){
        fs.unlinkSync( path );
    }
}

function uploadToUser( id, nameFile, file, res ) {
    // Buscamos el elemento
    User.findById( id, ( err, user ) => {
        if( err ){
            return res.status(500).json({
                ok: false,
                message: 'Error user',
                errors: {message: 'Error user', err}
            });
        }
        if(!user){
            return res.status(400).json({
                ok: false,
                message: 'User not found',
                errors: {message: 'User not found'}
            });
        }

        // Capturamos nueva ruta y antigua y movemos el fichero
        const path = STORAGE.user+nameFile;
        const oldPath = STORAGE.user+user.img;
        mvFile( file, path, res );

        // Updatamos el collection y si hay error borramos el fichero nuevo
        user.img = nameFile;
        user.save( user, (err, userUpdate) => {
            if( err ){
                deleteFile( path );
                return res.status(500).json({
                    ok: false,
                    message: 'Error user',
                    errors: {message: 'Error user', err}
                });
            }

            if(!userUpdate){
                deleteFile( path );
                return res.status(400).json({
                    ok: false,
                    message: 'User not found',
                    errors: {message: 'User not found'}
                });
            }

            // Si no hay error borramos el fichero antiguo
            deleteFile( oldPath );

            userUpdate.password = ":(";

            return res.status(200).json({
                ok: true,
                message: 'success',
                data: userUpdate
            });

        });

    });

}

function uploadToHospital( id, nameFile, file, res ) {
    // Buscamos el elemento
    Hospital.findById( id, ( err, hospital ) => {
        if( err ){
            return res.status(500).json({
                ok: false,
                message: 'Error hospital',
                errors: {message: 'Error hospital', err}
            });
        }
        if(!hospital){
            return res.status(400).json({
                ok: false,
                message: 'Hospital not found',
                errors: {message: 'Hospital not found'}
            });
        }

        // Capturamos nueva ruta y antigua y movemos el fichero
        const path = STORAGE.hospital+nameFile;
        const oldPath = STORAGE.hospital+hospital.img;
        mvFile( file, path, res );

        // Updatamos el collection y si hay error borramos el fichero nuevo
        hospital.img = nameFile;
        hospital.save( hospital, (err, hospitalUpdate) => {
            if( err ){
                deleteFile( path );
                return res.status(500).json({
                    ok: false,
                    message: 'Error hospital',
                    errors: {message: 'Error hospital', err}
                });
            }

            if(!hospitalUpdate){
                deleteFile( path );
                return res.status(400).json({
                    ok: false,
                    message: 'Hospital not found',
                    errors: {message: 'Hospital not found'}
                });
            }

            // Si no hay error borramos el fichero antiguo
            deleteFile( oldPath );

            return res.status(200).json({
                ok: true,
                message: 'success',
                data: hospitalUpdate
            });

        });

    });

}

function uploadToDoctor( id, nameFile, file, res ) {
    // Buscamos el elemento
    Doctor.findById( id, ( err, doctor ) => {
        if( err ){
            return res.status(500).json({
                ok: false,
                message: 'Error doctor',
                errors: {message: 'Error doctor', err}
            });
        }
        if(!doctor){
            return res.status(400).json({
                ok: false,
                message: 'Doctor not found',
                errors: {message: 'Doctor not found'}
            });
        }

        // Capturamos nueva ruta y antigua y movemos el fichero
        const path = STORAGE.doctor+nameFile;
        const oldPath = STORAGE.doctor+doctor.img;
        mvFile( file, path, res );

        // Updatamos el collection y si hay error borramos el fichero nuevo
        doctor.img = nameFile;
        doctor.save( doctor, (err, doctorUpdate) => {
            if( err ){
                deleteFile( path );
                return res.status(500).json({
                    ok: false,
                    message: 'Error doctor',
                    errors: {message: 'Error doctor', err}
                });
            }

            if(!doctorUpdate){
                deleteFile( path );
                return res.status(400).json({
                    ok: false,
                    message: 'Doctor not found',
                    errors: {message: 'Doctor not found'}
                });
            }

            // Si no hay error borramos el fichero antiguo
            deleteFile( oldPath );

            return res.status(200).json({
                ok: true,
                message: 'success',
                data: doctorUpdate
            });

        });

    });

}


module.exports = app;