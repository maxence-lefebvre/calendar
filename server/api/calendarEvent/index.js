'use strict';

const express = require('express');
const CalendarEventController = require('./calendarEvent.controller');
const router = express.Router();

router.get('/', CalendarEventController.renderIndex);
router.post('/', CalendarEventController.createCalendarEvent);

/////   exports    /////

module.exports = router;

