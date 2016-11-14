'use strict';

//const config = require('./../config/environment');
var OutlookService = require('./../services/OutlookService');

module.exports.handleReceiveToken = handleReceiveToken;

function handleReceiveToken(req, res) {
    const token = req.token.token;

    OutlookService.getUserEmail(
        token.access_token,
        (error, email) => {
            if (error) {
                console.error('getUserEmail returned an error: ', error);
                return res.status(500).json(`<p>ERROR: ${error}</p>`);
            }
            if (!email) {
                return res.status(404).json(`email not found`);
            }
            res.cookie('node-tutorial-token', token.access_token, {maxAge: 4000, httpOnly: true});
            res.cookie('node-tutorial-refresh-token', token.refresh_token, {maxAge: 4000, httpOnly: true});
            res.cookie('node-tutorial-token-expires', token.expires_at.getTime(), {maxAge: 4000, httpOnly: true});
            res.cookie('node-tutorial-email', email, {maxAge: 4000, httpOnly: true});
            return res.redirect('/calendarEvent');
        }
    );
}