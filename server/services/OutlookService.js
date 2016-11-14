'use strict';

const outlook = require('node-outlook');

const config        = require('./../config/environment');
const outlookConfig = config.outlook;
const oauth2        = require('simple-oauth2')(outlookConfig.credentials);

/////   exports    /////

exports.getAuthUrl         = getAuthUrl;
exports.getTokenFromCode   = getTokenFromCode;
exports.refreshAccessToken = refreshAccessToken;
exports.getUserEmail       = getUserEmail;
exports.setApiEndpoint     = setApiEndpoint;

////////////////////////////////

function setApiEndpoint() {
    outlook.base.setApiEndpoint(config.outlook.api.endpoint);
}

function getUserEmail(token, callback) {
    setApiEndpoint();

    var queryParams = {
        '$select': 'DisplayName, EmailAddress',
    };

    outlook.base.getUser({token: token, odataParams: queryParams}, function (error, user) {
        if (error) {
            callback(error, null);
        } else {
            callback(null, user.EmailAddress);
        }
    });
}

/**
 *
 * @returns {*}
 */
function getAuthUrl() {
    return oauth2.authCode.authorizeURL(
        {
            redirect_uri: outlookConfig.redirectUri,
            scope: outlookConfig.scopes.join(' ')
        }
    );
}

/**
 *
 * @param authCode
 * @param callback
 */
function getTokenFromCode(authCode, callback) {
    oauth2.authCode.getToken(
        {
            code: authCode,
            redirect_uri: outlookConfig.redirectUri,
            scope: outlookConfig.scopes.join(' ')
        },
        (error, result) => {
            if (error) {
                console.error('Access token error: ', error.message);
                return callback(error, null);
            }
            const token = oauth2.accessToken.create(result);
            callback(null, token);
        }
    );
}

/**
 *
 * @param refreshToken
 * @param callback
 */
function refreshAccessToken(refreshToken, callback) {
    const oToken = oauth2.accessToken.create({refresh_token: refreshToken});
    oToken.refresh(callback);
}
