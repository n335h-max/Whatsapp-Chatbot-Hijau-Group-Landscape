const axios = require('axios');
const config = require('../config');
const logger = require('../utils/logger');

const whatsappApi = axios.create({
    baseURL: 'https://graph.facebook.com/v21.0',
    headers: {
        'Authorization': `Bearer ${config.whatsappToken}`,
        'Content-Type': 'application/json',
    },
});

const sendMessage = async (to, data) => {
    try {
        const response = await whatsappApi.post(`/${config.phoneNumberId}/messages`, {
            messaging_product: 'whatsapp',
            to: to,
            ...data,
        });
        return response.data;
    } catch (error) {
        logger.error('Error sending message:', error.response ? error.response.data : error.message);
        throw error;
    }
};

const sendText = (to, text) => {
    return sendMessage(to, {
        type: 'text',
        text: { body: text },
    });
};

module.exports = {
    sendMessage,
    sendText,
};
