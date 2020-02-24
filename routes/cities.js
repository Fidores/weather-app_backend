const router = require('express').Router();
const { City } = require('../models/city');
const async = require('../middleware/asyncMiddleware');


router.get('/', async(async (req, res) => {

    const cities = await City.find({ 'name': { $regex: req.query.cityName, $options: 'i' } }).limit(20);

    res.send(cities);

}));

module.exports = router;