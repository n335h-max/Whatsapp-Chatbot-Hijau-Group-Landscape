const messageHandler = require('../src/services/messageHandler');
const whatsapp = require('../src/services/whatsapp');
const logger = require('../src/utils/logger');

// Mock WhatsApp API
whatsapp.sendText = async (to, text) => {
    console.log(`\n\x1b[36m[BOT REPLY to ${to}]\x1b[0m: ${text}\n`);
};

const runTests = async () => {
    console.log("=== STARTING NEW MESSAGE LOGIC TESTS ===\n");

    const user = "60123456789";

    const testCases = [
        "Hi", // New Greeting
        "Terima kasih", // Exit (Malay)
        "Thanks", // Exit (English)
        "Lokasi", // FAQ Check
        "agent", // Handover
    ];

    for (const msg of testCases) {
        console.log(`\x1b[33m[USER SAYS]\x1b[0m: ${msg}`);
        await messageHandler.handleMessage(user, {
            type: 'text',
            text: { body: msg }
        });
        // Add small delay
        await new Promise(r => setTimeout(r, 100));
    }
};

runTests().catch(console.error);
