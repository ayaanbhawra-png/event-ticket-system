const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');

router.post('/purchase', userController.purchaseTicket);
router.get('/tickets/:address', userController.getUserTickets);
router.get('/ticket/:ticketId', userController.getTicketDetails);
router.post('/transfer', userController.transferTicket);
router.post('/refund', userController.requestRefund);

module.exports = router;