'use strict';

process.env.NODE_ENV = process.env.NODE_ENV || 'development';

// node modules
const express = require('express');
const config  = require('./config/environment');

const app = express();

require('./config/express')(app);
require('./config/routes')(app);

app.listen(config.port, function () {
    console.log(`Server started on port ${config.port}`);
});

/////   exports    /////

exports = app;