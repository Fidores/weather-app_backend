const router = require('express').Router();
const { City } = require('../models/city');
const { User } = require('../models/user');
const async = require('../middleware/asyncMiddleware');

router.post('/', async(async (req, res) => {

    if(!req.body.id) return res.status(400).send('no id sent');
    
    const user = await User.findById(req.user._id);
    if(user.savedCities.includes(req.body.id)) return res.status(400).send('city already saved');
    if(user.savedCities.length === 20) return res.status(400).send('limit of 20 saved cities is reached');

    const city = await City.findOne({id: req.body.id});
    if(!city) return res.status(400).send('no city with given id');
    
    user.savedCities.push(req.body.id);
    await user.save();
    
    const cities = await City.find().where('id').in(user.savedCities).exec();

    res.send(cities);

}));

router.delete('/:id', async(async (req, res) => {

    const user = await User.findById(req.user._id);
    if(!user.savedCities.includes(req.params.id)) return res.status(400).send('no saved city with given id');
    
    user.savedCities.pull(req.params.id);
    await user.save();
    
    const cities = await City.find().where('id').in(user.savedCities).exec();

    res.send(cities);

}));

router.get('/', async(async (req, res) => {

    const user = await User.findById(req.user._id).select('savedCities');
    if(!user) return res.status(404).send('no user with given id');

    const cities = await City.find().where('id').in(user.savedCities).exec();

    res.send(cities);

}));

module.exports = router;