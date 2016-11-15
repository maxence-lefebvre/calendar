'use strict';

module.exports = {
    outlook: {
        credentials: {
            clientID: "5559d5d8-8ebf-404b-8fdb-355b0c57d980",
            clientSecret: process.env.OUTLOOK_SECRET,
        },
        redirectUri: 'https://ancient-escarpment-14569.herokuapp.com/authorize'
    }
};