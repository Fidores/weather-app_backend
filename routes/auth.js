const router = require('express').Router();
const async = require('../middleware/asyncMiddleware');
const bcrypt = require('bcrypt');
const config = require('config');
const { User, validationSchema } = require('../models/user');

router.post('/', async(async (req, res) => {

    const { error } = validationSchema
        .with('password', 'email')
        .with('email', 'password')
        .validate(req.body);
    if(error) return res.status(400).send(error.message);

    const user = await User.findOne({ email: req.body.email });
    if(!user) return res.status(400).send('invalid email or password');

    const validPassword = await bcrypt.compare(req.body.password, user.password);
    if(!validPassword) return res.status(400).send('invalid email or password');

    const token = user.generateAuthToken();

    res
        .header(config.get('authorization.header'), token)
        .send({
            name: user.name,
            email: user.email,
            _id: user._id,
        });

}));

module.exports = router;