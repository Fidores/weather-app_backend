const config = require('config');
const jwt = require('jsonwebtoken');

module.exports = (req, res, next) => {
    const token = req.header(config.get('authorization.header'));
    if(!token) return res.status(401).send('no token provided');

    const decoded = jwt.verify(token, config.get('authorization.key'));
    req.user = decoded;

    next();
}