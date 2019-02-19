var mongoose = require('mongoose');
var uniqueValidator = require('mongoose-unique-validator');

var Schema = mongoose.Schema;

var validsRoles = {
    values: ['ADMIN_ROLE', 'USER_ROLE'],
    message: '{VALUE} role not valid'
}

var userSchema = new Schema({
    name: { type: String, required: [true, 'Name is required'] },
    lastname: { type: String },
    email: { type: String, unique:true, required: [true, 'Email is required'] },
    password: { type: String, required: [true, 'Password is required'] },
    img: { type: String },
    role: { type: String, required: [true, 'Role is required'], default: 'USER_ROLE', enum: validsRoles }
});

userSchema.plugin( uniqueValidator, { message: 'The {PATH} must be unique' } );

module.exports = mongoose.model('User', userSchema);