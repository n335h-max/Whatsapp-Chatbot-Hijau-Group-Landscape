const config = require('../config');
const logger = require('../utils/logger');

// Verify webhook
const verifyWebhook = (req, res) => {
    const mode = req.query['hub.mode'];
    const token = req.query['hub.verify_token'];
    const challenge = req.query['hub.challenge'];

    if (mode && token) {
        if (mode === 'subscribe' && token === config.verifyToken) {
            logger.info('Webhook verified');
            res.status(200).send(challenge);
        } else {
            res.sendStatus(403);
        }
    } else {
        res.sendStatus(400); // Bad Request if parameters are missing
    }
};

// Handle incoming messages
const handleWebhook = async (req, res) => {
    const body = req.body;

    // Log the incoming webhook payload
    logger.info(`Incoming webhook payload: ${JSON.stringify(body, null, 2)}`);

    // Check if this is an event from a WhatsApp API subscription
    if (body.object) {
        if (
            body.entry &&
            body.entry[0].changes &&
            body.entry[0].changes[0].value.messages &&
            body.entry[0].changes[0].value.messages[0]
        ) {
            const entry = body.entry[0];
            const change = entry.changes[0].value;
            const message = change.messages[0];

            // Normalize sender ID: ensure it looks like 601110629990
            let from = message.from;
            if (from) {
                // Remove + if present
                if (from.startsWith('+')) {
                    from = from.substring(1);
                }
                // If it starts with 011..., change to 6011...
                if (from.startsWith('0')) {
                    from = '60' + from.substring(1);
                }
            }

            logger.info(`Received message from ${from}: ${JSON.stringify(message)}`);

            if (message.type === 'text') {
                const messageHandler = require('../services/messageHandler');
                await messageHandler.handleMessage(from, message);
            } else {
                logger.info(`Received non-text message type: ${message.type}`);
            }
        }

        // Always return 200 OK to WhatsApp
        res.sendStatus(200);
    } else {
        res.sendStatus(404);
    }
};

module.exports = {
    verifyWebhook,
    handleWebhook,
};
