'use strict';

var path = require('path');
var _         = require('lodash');

var envConfig = require(`./${process.env.NODE_ENV || 'development'}`);

var all = {
    port : process.env.PORT || 8000,

    views :  {
        baseDirectory : path.join(__dirname, '..', '..', 'views'),
        index : 'index',
        login : 'login'
    },

    outlook: {
        api : {
            endpoint : 'https://outlook.office.com/api/v2.0'
        },
        scopes: [
            'openid',
            'offline_access',
            'https://outlook.office.com/calendars.readwrite'
        ]
    },

    csv: {
        events : {
            config : {
                separator: ';',
                headers : ['Annee', 'Créneau', 'Salle', 'Activité', 'Description', 'Réservations']
            }
        }
    }

};

module.exports = _.merge(all, envConfig);