const mongooose = require('mongoose');
const joi = require('@hapi/joi')

const SettingsSchema = new mongooose.Schema({
    _id: false,
    units: {
        type: String,
        default: '',
        enum: [ 'metric', 'imperal', '' ]
    },
    lang: {
        type: String,
        default: 'pl',
        enum: [ 'pl', 'eng' ]
    }
});

const validationSchema = joi.object({
    units: joi.string().valid('metric', 'imperal').allow(''),
    lang: joi.string().valid('pl', 'eng')
});

const defaults = {
    units: '',
    lang: 'pl'
}

module.exports.SettingsSchema = SettingsSchema;
module.exports.validationSchema = validationSchema;
module.exports.defaults = defaults;