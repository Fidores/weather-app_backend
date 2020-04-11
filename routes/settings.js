const router = require('express').Router();
const async = require('../middleware/asyncMiddleware');
const { User } = require('../models/user');
const { validationSchema } = require('../models/settings');

router.get('/', async(async (req, res) => {

    const user = await User.findById(req.user._id);

    res.send(user.settings);

}));

router.patch('/', async (req, res) => {

    const user = await User.findById(req.user._id);

    const { error } = validationSchema.validate(req.body);
    if(error) return res.status(400).send(error.message);

    for (const setting in req.body) {
        if (req.body.hasOwnProperty(setting)) {
            const element = req.body[setting];
            user.settings[setting] = element;
        }
    }

    await user.save();

    res.send(user.settings);

});

module.exports = router;