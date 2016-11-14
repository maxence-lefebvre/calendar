'use strict';

const express = require('express');

const AuthController = require('./auth.controller');
const AuthMiddleware = require('./auth.middleware');

const router = express.Router();

router.get('/', AuthMiddleware.isAuthenticated, AuthController.handleReceiveToken);

/////   exports    /////

module.exports = router;
