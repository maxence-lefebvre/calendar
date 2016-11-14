'use strict';

const config = require('./../../config/environment');

const csv     = require('csv-parser');
const moment  = require('moment');
const outlook = require('node-outlook');

var OutlookService = require('./../../services/OutlookService');

module.exports.renderIndex         = renderIndex;
module.exports.createCalendarEvent = createCalendarEvent;

function renderIndex(req, res) {
    res.render(config.views.index);
}

function createCalendarEvent(req, res) {
    const token = req.cookies['node-tutorial-token'];
    const email = req.cookies['node-tutorial-email'];

    const events = [];

    if (!token) {
        return res.status(401).json('<p> No token found in cookie!</p>');
    }

    // accumulate all events
    req.busboy.on(
        'file',
        (fieldname, file) => {
            file.pipe(csv(config.csv.events.config))
                .on('data', function (data) {
                    if (data.Annee !== 'Date') {
                        const date   = data.Créneau.split(" - ");
                        var newEvent = {
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
                        console.log(newEvent);
                        events.push(newEvent);
                    }
                });
        }
    );

    req.busboy.on('finish', () => {
        let pendingRequests = events.length + 1;
        const done          = function () {
            return --pendingRequests === 0 && res.status(200).json();
        };
        done();
        OutlookService.setApiEndpoint();
        events.forEach((event) => {
            outlook.calendar.createEvent({token: token, event: event},
                function (error) {
                    if (error) {
                        console.log('createEvent returned an error: ' + error);
                    }
                    done();
                }
            );
        });
    });

    req.pipe(req.busboy);
}