var express = require('express');
var bcrypt = require('bcryptjs');
var jwt = require('jsonwebtoken');

var SEED = require('../config/config').SEED;

var app = express();
var User = require('../models/user');

//Google
var CLIENT_ID = require('../config/config').CLIENT_ID;
const {OAuth2Client} = require('google-auth-library');
const client = new OAuth2Client(CLIENT_ID);


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
        var token = jwt.sign({ user: userDB }, SEED/* , { expiresIn: 14400 } */); // 4 horas

        res.status(200).json({
            ok: true,
            user: userDB,
            token: token,
            id: userDB._id,
            menu: getMenu(userDB.role)
        });

    });

});

// =============================================
// Login user Google
// =============================================

async function verify( token ) {
    const ticket = await client.verifyIdToken({
        idToken: token,
        audience: CLIENT_ID,  // Specify the CLIENT_ID of the app that accesses the backend
        // Or, if multiple clients access the backend:
        //[CLIENT_ID_1, CLIENT_ID_2, CLIENT_ID_3]
    });
    const payload = ticket.getPayload();
    //const userid = payload['sub'];
    // If request specified a G Suite domain:
    //const domain = payload['hd'];
    return {
        name: payload.given_name,
        lastname: payload.family_name,
        email: payload.email,
        img: payload.picture,
        google: true
    }
}

app.post('/google', async(req, res) => {

    var token = req.body.token;

    var googleUser = await verify( token ).catch(e => {
        return res.status(403).json({
            ok: false,
            message: 'Invalid token'
        });
    });
    User.findOne( { email: googleUser.email }, (err, userDB) => {
        if( err ){
            return res.status(500).json({
                ok: false,
                message: 'Login error',
                errors: err
            });
        }

        if( userDB ){
            if( !userDB.google ){
                return res.status(400).json({
                    ok: false,
                    message: 'This user is not from google',
                    errors: err
                });
            } else {
                userDB.password = ":)";
                var token = jwt.sign({ user: userDB }, SEED/* , { expiresIn: 14400 } */); // 4 horas

                res.status(200).json({
                    ok: true,
                    user: userDB,
                    token: token,
                    id: userDB._id,
                    menu: getMenu(userDB.role)
                });
            }
        } else {
            var user = new User();
            user.name = googleUser.name;
            user.lastname = googleUser.lastname;
            user.password = ":)";
            user.email = googleUser.email;
            user.img = googleUser.img;
            user.google = true;

            user.save((err, userDB) => {

                if( err ){
                    return res.status(500).json({
                        ok: false,
                        message: 'Register google error',
                        errors: err
                    });
                }

                userDB.password = ":)";
                var token = jwt.sign({ user: userDB }, SEED/* , { expiresIn: 14400 } */); // 4 horas

                res.status(200).json({
                    ok: true,
                    user: userDB,
                    token: token,
                    id: userDB._id,
                    menu: getMenu(userDB.role)
                });
            })
        }
    });

});

function getMenu (role) {
    var menu = [
		{
			title: 'General',
			icon: 'mdi mdi-gauge',
			submenu:[
				{ title: 'Dashboard', url:'/dashboard' },
				{ title: 'ProgressBar', url:'/progress' },
				{ title: 'Graphics', url:'/graph1' },
				{ title: 'Promises', url:'/promises' },
				{ title: 'Rxjs', url:'/rxjs' }
			]
		},
		{
			title: 'Maintenance',
			icon: 'mdi mdi-folder-lock-open',
			submenu: [
				{title: 'Hospitals', url: '/hospitals'},
				{title: 'Doctors', url: '/doctors'}
			]
		}
    ];

    if (role === 'ADMIN_ROLE') {
        menu[1].submenu.unshift({title: 'Users', url: '/users'});
    }

    return menu;
}

module.exports = app;