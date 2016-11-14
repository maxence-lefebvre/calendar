'use strict';

module.exports = {
    outlook: {
        credentials: {
            clientID: "5559d5d8-8ebf-404b-8fdb-355b0c57d980",
            clientSecret: "",
            site: 'https://login.microsoftonline.com/common',
            authorizationPath: '/oauth2/v2.0/authorize',
            tokenPath: '/oauth2/v2.0/token'
        },
        redirectUri: 'http://localhost:8000/authorize'
    }
};