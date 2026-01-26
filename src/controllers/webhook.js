const config = require('../config');
const logger = require('../utils/logger');

// Track recent call auto-replies to prevent spam (1-time reply guard)
const callReplyCache = new Map(); // phoneNumber -> timestamp
const CALL_REPLY_COOLDOWN = 3600000; // 1 hour in milliseconds

// Clean up old cache entries every hour
setInterval(() => {
    const now = Date.now();
    for (const [phone, timestamp] of callReplyCache.entries()) {
        if (now - timestamp > CALL_REPLY_COOLDOWN) {
            callReplyCache.delete(phone);
        }
    }
}, CALL_REPLY_COOLDOWN);

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

                if (message.type === 'text' || message.type === 'interactive') {
                    const messageHandler = require('../services/messageHandler');
                    await messageHandler.handleMessage(from, message, customerName);
                    logger.info(`Message handled successfully for ${from}`);
                } else {
                    logger.info(`Received non-text message type: ${message.type}`);
                }
            } else if (change.statuses && change.statuses[0]) {
                // Check for call attempts (status = failed, error code = 470)
                const status = change.statuses[0];
                
                if (
                    status.status === 'failed' &&
                    status.errors &&
                    status.errors[0] &&
                    status.errors[0].code === 470
                ) {
                    const phoneNumber = status.recipient_id;
                    
                    // Normalize phone number
                    let normalizedPhone = phoneNumber;
                    if (normalizedPhone.startsWith('+')) {
                        normalizedPhone = normalizedPhone.substring(1);
                    }
                    if (normalizedPhone.startsWith('0')) {
                        normalizedPhone = '60' + normalizedPhone.substring(1);
                    }
                    
                    logger.info(`📞 Call attempt detected from ${normalizedPhone}`);
                    
                    // Check if we've already sent reply recently (anti-spam guard)
                    const now = Date.now();
                    const lastReply = callReplyCache.get(normalizedPhone);
                    
                    if (!lastReply || (now - lastReply) > CALL_REPLY_COOLDOWN) {
                        const whatsapp = require('../services/whatsapp');
                        const autoReplyMessage = `Terima kasih kerana menghubungi Hijau Group Landscape 🌿

Untuk respon lebih pantas, sila WhatsApp mesej sahaja.
Panggilan tidak dipantau 🙏

📞 Untuk panggilan, hubungi team sales: 011-1062 9990

────────────────

Thank you for contacting Hijau Group Landscape 🌿

For faster response, please WhatsApp message only.
Calls are not monitored 🙏

📞 For calls, contact sales team: 011-1062 9990`;
                        
                        await whatsapp.sendText(normalizedPhone, autoReplyMessage);
                        callReplyCache.set(normalizedPhone, now);
                        logger.info(`✅ Call auto-reply sent to ${normalizedPhone}`);
                    } else {
                        logger.info(`⏭️ Skipped call auto-reply for ${normalizedPhone} (cooldown active)`);
                    }
                } else {
                    // Other status updates (delivered, read, sent, etc.)
                    logger.info(`Received status update: ${status.status}`);
                }
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
