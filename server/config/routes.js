'use strict';

const path    = require('path');
const express = require('express');

const config         = require('./environment');
const OutlookService = require('./../services/OutlookService');

/////   exports    /////

module.exports = function (app) {

    app.use('/authorize', require('./../auth/index'));

    app.use('/calendarEvent', require('./../api/calendarEvent'));

    app.use('/assets', express.static(path.join(__dirname, '..', '..', 'public', 'assets')));

    app.get('/', (req, res) => {
        const authUrl = OutlookService.getAuthUrl();
        res.render(config.views.login, {authUrl: authUrl});
    });
};