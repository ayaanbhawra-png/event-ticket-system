const express = require('express');
const router = express.Router();
const publicController = require('../controllers/publicController');

router.get('/events', publicController.getEvents);
router.get('/events/:eventId', publicController.getEventDetails);
router.post('/verify', publicController.verifyQR);

module.exports = router;