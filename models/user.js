const mongooose = require('mongoose');
const jwt = require('jsonwebtoken');
const config = require('config');
const Joi = require('@hapi/joi');

const UserSchema = new mongooose.Schema({
    name: String,
    password: String,
    email: {
        type: String,
        unique: true
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
    name: Joi.string().min(3).max(128).required(),
    password: Joi.string().required().min(5).max(255),
    email: Joi.string().email({tlds: false}).required().max(255),
    isAdmin: Joi.forbidden(),
    savedCities: Joi.forbidden()
});

module.exports.User = User;
module.exports.validationSchema = schema;