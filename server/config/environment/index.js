'use strict';

const path = require('path');
const _    = require('lodash');

const envConfig = require(`./${process.env.NODE_ENV || 'development'}`);

const all = {
    port: process.env.PORT || 8000,

    views: {
        baseDirectory: path.join(__dirname, '..', '..', 'views'),
        index: 'index',
        login: 'login'
    },

    outlook: {
        api: {
            endpoint: 'https://outlook.office.com/api/v2.0'
        },
        credentials: {
            site: 'https://login.microsoftonline.com/common',
            authorizationPath: '/oauth2/v2.0/authorize',
            tokenPath: '/oauth2/v2.0/token'
        },
        scopes: [
            'openid',
            'offline_access',
            'https://outlook.office.com/calendars.readwrite'
        ]
    },

    csv: {
        events: {
            config: {
                separator: ';',
                headers: ['Annee', 'Créneau', 'Salle', 'Activité', 'Description', 'Réservations']
            }
        }
    }

};

module.exports = _.merge(all, envConfig);