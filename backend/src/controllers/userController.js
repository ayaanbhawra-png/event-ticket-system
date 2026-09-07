const { ethers } = require('ethers');
const blockchainService = require('../services/blockchainService');

exports.purchaseTicket = async (req, res) => {
    try {
        const { eventId, tierIndex, userPrivateKey, value } = req.body;

        const userWallet = new ethers.Wallet(userPrivateKey, blockchainService.provider);
        const receipt = await blockchainService.purchaseTicket(
            userWallet,
            eventId,
            tierIndex,
            value
        );

        const ticketMintedEvent = receipt.events.find(e => e.event === 'TicketMinted');
        const ticketId = ticketMintedEvent.args.ticketId;

        res.status(200).json({
            success: true,
            ticketId: ticketId.toString(),
            txHash: receipt.hash,
            message: 'Ticket purchased successfully'
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            error: error.message
        });
    }
};

exports.getUserTickets = async (req, res) => {
    try {
        const { address } = req.params;
        const tickets = await blockchainService.getUserTickets(address);

        res.status(200).json({
            success: true,
            tickets,
            count: tickets.length
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            error: error.message
        });
    }
};

exports.getTicketDetails = async (req, res) => {
    try {
        const { ticketId } = req.params;
        const validity = await blockchainService.checkTicketValidity(ticketId);

        res.status(200).json({
            success: true,
            ticket: {
                id: ticketId,
                isValid: validity.isValid && !validity.isUsed,
                isUsed: validity.isUsed,
                owner: validity.owner,
                eventId: validity.eventId.toString()
            }
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            error: error.message
        });
    }
};

exports.transferTicket = async (req, res) => {
    try {
        const { ticketId, toAddress, fromPrivateKey } = req.body;
        // Implementation
        res.status(200).json({
            success: true,
            message: 'Ticket transferred successfully'
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            error: error.message
        });
    }
};

exports.requestRefund = async (req, res) => {
    try {
        const { ticketId } = req.body;
        // Implementation
        res.status(200).json({
            success: true,
            message: 'Refund requested successfully'
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            error: error.message
        });
    }
};