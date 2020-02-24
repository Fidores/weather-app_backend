const cities = require('../routes/cities');
const express = require('express');
const forecast = require('../routes/forecast');
const cors = require('cors');

module.exports = app => {
    app.use(cors());
    app.use(express.json());
    app.use('/cities/', cities);
    app.use('/forecast/', forecast)
}
