const blockchainService = require('../services/blockchainService');

exports.getEvents = async (req, res) => {
    try {
        const events = await blockchainService.getAllEvents();
        res.status(200).json({
            success: true,
            events
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            error: error.message
        });
    }
};

exports.getEventDetails = async (req, res) => {
    try {
        const { eventId } = req.params;
        const event = await blockchainService.getEventDetails(eventId);

        res.status(200).json({
            success: true,
            event
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            error: error.message
        });
    }
};

exports.verifyQR = async (req, res) => {
    try {
        const { qrData } = req.body;

        // Decode QR data
        const decoded = JSON.parse(Buffer.from(qrData, 'base64').toString());
        const { ticketId } = decoded;

        const validity = await blockchainService.checkTicketValidity(ticketId);

        res.status(200).json({
            success: true,
            isValid: validity.isValid && !validity.isUsed,
            isUsed: validity.isUsed,
            owner: validity.owner,
            eventId: validity.eventId.toString()
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            error: error.message
        });
    }
};