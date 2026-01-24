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

const sendInteractiveButtons = (to, bodyText, buttons) => {
    return sendMessage(to, {
        type: 'interactive',
        interactive: {
            type: 'button',
            body: { text: bodyText },
            action: {
                buttons: buttons.map((btn, idx) => ({
                    type: 'reply',
                    reply: {
                        id: btn.id || `btn_${idx}`,
                        title: btn.title.substring(0, 20) // WhatsApp limit: 20 chars
                    }
                }))
            }
        }
    });
};

const sendInteractiveList = (to, bodyText, buttonText, sections) => {
    return sendMessage(to, {
        type: 'interactive',
        interactive: {
            type: 'list',
            body: { text: bodyText },
            action: {
                button: buttonText,
                sections: sections
            }
        }
    });
};

const sendImage = (to, imageUrl, caption = '') => {
    return sendMessage(to, {
        type: 'image',
        image: {
            link: imageUrl,
            caption: caption
        }
    });
};

const sendDocument = (to, documentUrl, filename, caption = '') => {
    return sendMessage(to, {
        type: 'document',
        document: {
            link: documentUrl,
            filename: filename,
            caption: caption
        }
    });
};

module.exports = {
    sendMessage,
    sendText,
    sendInteractiveButtons,
    sendInteractiveList,
    sendImage,
    sendDocument,
};
