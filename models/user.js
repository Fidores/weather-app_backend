const mongooose = require('mongoose');
const jwt = require('jsonwebtoken');
const config = require('config');
const Joi = require('@hapi/joi');

const UserSchema = new mongooose.Schema({
    name: {
        type: String,
        min: 3,
        max: 128,
        required: true
    },
    password: {
        type: String,
        min: 5,
        max: 255,
        required: true
    },
    email: {
        type: String,
        unique: true,
        required: true
    },
    isAdmin: {
        type: Boolean,
        default: false
    },
    savedCities: [ String ]
});

UserSchema.methods.generateAuthToken = function () {
    return jwt.sign({
        _id: this._id,
        isAdmin: this.isAdmin
    }, config.get('authorization.key'));
}

const User = new mongooose.model('user', UserSchema);

const schema = Joi.object({
    name: Joi.string().min(3).max(128),
    password: Joi.string().min(5).max(255),
    email: Joi.string().email({tlds: false}).max(255),
    isAdmin: Joi.forbidden(),
    savedCities: Joi.forbidden()
});

module.exports.User = User;
module.exports.validationSchema = schema;