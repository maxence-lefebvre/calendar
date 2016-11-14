'use strict';

var express = require('express');

var AuthController = require('./auth.controller');
var AuthMiddleware = require('./auth.middleware');

var router = express.Router();

router.get('/', AuthMiddleware.isAuthenticated, AuthController.handleReceiveToken);

module.exports = router;

