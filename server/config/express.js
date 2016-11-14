'use strict';

const path         = require('path');
const busboy       = require('connect-busboy');
const bodyParser   = require('body-parser');
const cookieParser = require('cookie-parser');

const config = require('./environment');

module.exports = function (app) {
    // for files
    app.use(busboy());
    // for json bodies
    app.use(bodyParser.json({extended: true}));
    // for cookies
    app.use(cookieParser());


    app.set('views', config.views.baseDirectory);
    app.set('view engine', 'ejs');
};