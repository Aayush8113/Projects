const express = require('express');
const router = express.Router();
const ticketController = require('../controllers/ticket.controller');
const { verifyToken } = require('../utils/verifyToken');
const { ticketLimiter } = require('../middleware/rateLimiter');

router.post('/', verifyToken, ticketLimiter, ticketController.createTicket);
router.get('/my-tickets', verifyToken, ticketController.getUserTickets);

module.exports = router;
