const cities = require('../routes/cities');
const express = require('express');
const forecast = require('../routes/forecast');
const users = require('../routes/users');
const auth = require('../routes/auth')
const cors = require('cors');
const corsOptions = require('../routes/cors');

module.exports = app => {
    app.use(cors(corsOptions));
    app.use(express.json());
    app.use('/cities/', cities);
    app.use('/forecast/', forecast);
    app.use('/users/', users);
    app.use('/auth/', auth);
}
