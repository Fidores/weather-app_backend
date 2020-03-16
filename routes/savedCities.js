const router = require('express').Router();
const { City } = require('../models/city');
const { User } = require('../models/user');
const auth = require('../middleware/auth');
const async = require('../middleware/asyncMiddleware');

router.post('/', auth, async(async (req, res) => {
    if(!req.body.cityId) return res.status(400).send('no id sent');
    
    const user = await User.findById(req.user._id);
    if(user.savedCities.includes(req.body.cityId)) return res.status(400).send('city already saved');
    if(user.savedCities.length === 20) return res.status(400).send('limit of 20 saved cities is reached');

    const city = await City.findOne({id: req.body.cityId});
    if(!city) return res.status(400).send('no city with given id');

    user.savedCities.push(req.body.cityId);
    await user.save();
    res.send(user.savedCities);

}));

router.delete('/:id', auth, async(async (req, res) => {
    const user = await User.findById(req.user._id);
    if(!user.savedCities.includes(req.params.id)) return res.status(400).send('no saved city with given id');

    user.savedCities.pull(req.params.id);
    await user.save();

    res.send(user.savedCities);
}));

module.exports = router;