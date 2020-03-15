const router = require('express').Router();
const async = require('../middleware/asyncMiddleware');
const bcrypt = require('bcrypt');
const auth = require('../middleware/auth');
const { User, validationSchema } = require('../models/user');
const { City } = require('../models/city');

router.get('/me', auth, async(async (req, res) => {

    const user = await User.findById(req.user._id).select('-password');
    if(!user) res.status(400).send('no user with given id'); 

    res.send({
        _id: user._id,
        name: user.name,
        email: user.email
    });

}));

router.post('/', async(async (req, res) => {

    const { error } = validationSchema.validate(req.body);
    if(error) return res.status(400).send(error.message);

    let user = await User.findOne({email: req.body.email});
    if(user) return res.status(400).send('user already exists');

    user = new User({
        name: req.body.name,
        password: await bcrypt.hash(req.body.password, 10),
        email: req.body.email
    });

    await user.save();

    const token = user.generateAuthToken();

    res.header('X-AUTH-TOKEN', token).send({
        _id: user._id,
        name: user.name,
        email: user.email
    });

}));

router.post('/cities', auth, async(async (req, res) => {
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

router.delete('/cities/:id', auth, async(async (req, res) => {
    const user = await User.findById(req.user._id);
    if(!user.savedCities.includes(req.params.id)) return res.status(400).send('no saved city with given id');

    user.savedCities.pull(req.params.id);
    await user.save();

    res.send(user.savedCities);
}));

module.exports = router;