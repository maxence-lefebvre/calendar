'use strict';

const config = require('./../../config/environment');

const csv     = require('csv-parser');
const outlook = require('node-outlook');

const OutlookService      = require('./../../services/OutlookService');
const CalendarEventParser = require('./../../components/calendarEvent/CalendarEventParser');
const RequestPool         = require('./../../components/requests/RequestPool');

/////   exports    /////

module.exports.renderIndex         = renderIndex;
module.exports.createCalendarEvent = createCalendarEvent;

/////   definitions    /////

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
                    const event = CalendarEventParser.fromCSV(data);
                    event && events.push(event);
                });
        }
    );

    req.busboy.on('finish', () => {
        // set api endpoint
        OutlookService.setApiEndpoint();
        // Use a request pool
        RequestPool.run(
            // items to iterate on
            events,
            // callback to call on each item
            (event, done) => {
                outlook.calendar.createEvent({token: token, event: event},
                    function (error) {
                        if (error) {
                            console.error('createEvent returned an error: ', error);
                        }
                        done();
                    });
            },
            // callback when all requests are completed
            () => {
                // end current request
                res.status(200).json()
            },
            // max number of parallel requests
            config.outlook.api.maxNumberOfParallelRequests
        );
    });

    req.pipe(req.busboy);
}