'use strict';

const OutlookService = require('./../services/OutlookService');

/////   exports    /////

module.exports.isAuthenticated = isAuthenticated;

/////   definitions    /////

function isAuthenticated (req, res, next) {
    var code = req.query.code;
    OutlookService.getTokenFromCode(
        code,
        (error, token) => {
            if (error) {
                console.error(`Access token error: ${error.message}`);
                return res.status(500).json(`<p>ERROR: ${error}</p>`);
            }
            if (!token) {
                return res.status(404).json(`token not found`);
            }
            req.token = token;
            return next && next();
        }
    );
}