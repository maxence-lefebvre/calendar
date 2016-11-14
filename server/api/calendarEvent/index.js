'use strict';

var express = require('express');

var CalendarEventController = require('./calendarEvent.controller');

var router = express.Router();

router.get('/', CalendarEventController.renderIndex);
router.post('/', CalendarEventController.createCalendarEvent);

module.exports = router;

