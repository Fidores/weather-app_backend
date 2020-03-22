const router = require('express').Router();
const async = require('../middleware/asyncMiddleware');
const bcrypt = require('bcrypt');
const auth = require('../middleware/auth');
const savedCities = require('../routes/savedCities');
const config = require('config');
const { User, validationSchema } = require('../models/user');

router.get('/me', auth, async(async (req, res) => {

    const user = await User.findById(req.user._id).select('-password');
    if(!user) res.status(400).send('no user with given id');

    res.send({
        _id: user._id,
        name: user.name,
        email: user.email
    });

}));

router.patch('/me', auth, async(async (req, res) => {

    const { error } = validationSchema.validate(req.body);
    if(error) return res.status(400).send(error.message);

    let user = await User.findById(req.user._id);
    if(!user) return res.status(400).send('no user found');

    user.name = req.body.name;
    user.email = req.body.email;

    await user.save();

    const token = user.generateAuthToken();

    res.header(config.get('authorization.header'), token).send({
        _id: user._id,
        name: user.name,
        email: user.email
    });

}));

router.post('/', async(async (req, res) => {

    const { error } = validationSchema.options({presence: 'required'}).validate(req.body);
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

    res.header(config.get('authorization.header'), token).send({
        _id: user._id,
        name: user.name,
        email: user.email
    });

}));



router.use('/me/saved-cities/', auth, savedCities);


module.exports = router;