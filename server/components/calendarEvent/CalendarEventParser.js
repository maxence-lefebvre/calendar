'use strict';

const moment = require('moment');

/////   exports    /////

module.exports.fromCSV = fromCSV;

/////   definitions    /////

function fromCSV(data) {
    if (data.Annee !== 'Date') {
        const date = data.Créneau.split(" - ");
        return {
            'Subject': data.Activité,
            'Body': {
                'ContentType': 'HTML',
                'Content': `<p>${data.Description}</p><br/><br/><p>${data.salle}</p><br/><br/>${data.Réservations}`,
            },
            'Start': {
                'DateTime': moment(data.Annee + " " + date[0]).format(),
                'TimeZone': 'Central European Standard Time'
            },
            'End': {
                'DateTime': moment(data.Annee + " " + date[1]).format(),
                'TimeZone': 'Central European Standard Time'
            },
        };
    }
}