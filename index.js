const express = require('express');
const app = express();

require('./startup/database')();
require('./startup/routes')(app);

const port = process.env.PORT || 3000;
const server = app.listen(port, () => console.log(`Listening on port ${ port }`));