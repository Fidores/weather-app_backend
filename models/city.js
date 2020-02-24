const mongoose = require('mongoose');

const citySchema = new mongoose.Schema({
    name: String,
    country: String,
    id: Number
});

const City = mongoose.model('City', citySchema);

module.exports.City = City;