var express = require('express');

var app = express();

const STORAGE = require('../config/config').STORAGE;
const ASSETS = require('../config/config').ASSETS;
const path = require('path');
const fs = require('fs');

app.get('/:collection/:img', (req, res, next) => {

    const collection = req.params.collection;
    const img = req.params.img;

    const pathImg = path.resolve( __dirname, `.${ STORAGE[collection] }${ img }` );

    if( fs.existsSync( pathImg ) ){
        res.sendFile( pathImg );
    } else {
        const pathNoImg = path.resolve( __dirname, `.${ ASSETS.noImg }` );
        res.sendFile( pathNoImg );
    }

});

module.exports = app;