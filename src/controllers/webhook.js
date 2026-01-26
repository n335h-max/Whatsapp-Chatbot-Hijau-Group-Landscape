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
    if (body.object === 'whatsapp_business_account') {
        if (
            body.entry &&
            body.entry[0] &&
            body.entry[0].changes &&
            body.entry[0].changes[0] &&
            body.entry[0].changes[0].value
        ) {
            const change = body.entry[0].changes[0].value;

            // Check if there are messages
            if (change.messages && change.messages[0]) {
                const message = change.messages[0];

                logger.info(`Processing message - Type: ${message.type}, From: ${message.from}`);

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

                logger.info(`Normalized sender: ${from}`);

                // Extract customer name from contacts field if available
                let customerName = null;
                if (change.contacts && change.contacts[0]) {
                    customerName = change.contacts[0].profile?.name || null;
                    logger.info(`Customer name from webhook: ${customerName}`);
                }

                // Handle call events (missed calls)
                if (message.type === 'call_log') {
                    logger.info(`📞 Call detected from ${from} - Sending auto-reply`);
                    const whatsapp = require('../services/whatsapp');
                    const autoReplyMessage = `Terima kasih kerana menghubungi Hijau Group Landscape 🌿

Untuk pertanyaan, sila WhatsApp mesej sahaja.
Panggilan tidak dipantau. Terima kasih 🙏

────────────────

Thank you for contacting Hijau Group Landscape 🌿

For inquiries, please WhatsApp message only.
Calls are not monitored. Thank you 🙏`;
                    
                    await whatsapp.sendText(from, autoReplyMessage);
                    logger.info(`✅ Auto-reply sent to ${from} for call`);
                } else if (message.type === 'text' || message.type === 'interactive') {
                    const messageHandler = require('../services/messageHandler');
                    await messageHandler.handleMessage(from, message, customerName);
                    logger.info(`Message handled successfully for ${from}`);
                } else {
                    logger.info(`Received non-text message type: ${message.type}`);
                }
            } else if (change.statuses) {
                // This is a status update (delivered, read, sent, etc.) - ignore it
                logger.info('Received status update (delivered/read/sent) - ignoring');
            } else {
                logger.warn('Webhook received but no message or status found in payload');
                logger.warn(`Change value keys: ${JSON.stringify(Object.keys(change))}`);
            }
        } else {
            logger.warn('Webhook received with incomplete entry structure');
        }

        // Always return 200 OK to WhatsApp
        res.sendStatus(200);
    } else {
        logger.warn(`Received webhook with unexpected object type: ${body.object}`);
        res.sendStatus(404);
    }
};

module.exports = {
    verifyWebhook,
    handleWebhook,
};
