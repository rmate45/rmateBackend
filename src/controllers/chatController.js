const chatService = require('../services/chatService');
const { validationResult } = require('express-validator');

exports.sendMessage = async (req, res) => {
    try {
        // Validate request
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }

        const { userId, message } = req.body;

        if (!userId || !message) {
            return res.status(400).json({
                error: 'userId and message are required'
            });
        }

        // Set headers for streaming
        res.setHeader('Content-Type', 'text/event-stream');
        res.setHeader('Cache-Control', 'no-cache');
        res.setHeader('Connection', 'keep-alive');
        res.setHeader('Transfer-Encoding', 'chunked');

        // Send the message and handle streaming response
        await chatService.sendMessage(userId, message, res);
    } catch (error) {
        console.error('Error in chat controller:', error);
        res.write(JSON.stringify({
            error: 'Internal server error',
            message: error.message
        }));
        res.end();
    }
}; 