const mongoose = require('mongoose');

const TicketSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true
    },
    issueType: {
        type: String,
        required: true
    },
    referenceId: {
        type: String
    },
    message: {
        type: String,
        required: true
    },
    status: {
        type: String,
        enum: ['Open', 'In Progress', 'Resolved'],
        default: 'Open'
    }
}, { timestamps: true });

module.exports = mongoose.model('Ticket', TicketSchema);
