const Ticket = require('../models/Ticket');
const ErrorHandler = require('../utils/ErrorHandler');
const { validateFields, validateEmail } = require('../utils/validator');

exports.createTicket = async (req, res, next) => {
    try {
        const { name, email, issueType, referenceId, message } = req.body;

        if (!validateFields({ name, email, issueType, message }, next)) return;
        if (!validateEmail(email, next)) return;

        const newTicket = new Ticket({
            userId: req.user.id,
            name,
            email,
            issueType,
            referenceId,
            message
        });

        await newTicket.save();

        res.status(201).json({
            success: true,
            message: "Ticket submitted successfully!",
            ticket: newTicket
        });
    } catch (error) {
        next(error);
    }
};

exports.getUserTickets = async (req, res, next) => {
    try {
        const tickets = await Ticket.find({ userId: req.user.id }).sort({ createdAt: -1 });
        res.status(200).json({ success: true, tickets });
    } catch (error) {
        next(error);
    }
};
