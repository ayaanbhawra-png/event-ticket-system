const express = require('express');
const router = express.Router();
const adminController = require('../controllers/adminController');

// Auth
router.post('/login', adminController.login);

// Events
router.post('/events', adminController.createEvent);
router.post('/create-event', adminController.createEvent);
router.get('/events', adminController.getAllEvents);
router.post('/cancel-event', adminController.cancelEvent);

// Ticket Tiers
router.post('/tiers', adminController.addTicketTier);
router.post('/add-tier', adminController.addTicketTier);

// Verification
router.post('/verify-ticket', adminController.verifyTicket);

module.exports = router;