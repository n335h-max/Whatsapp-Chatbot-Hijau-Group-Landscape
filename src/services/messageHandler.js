const whatsapp = require('./whatsapp');
const faqs = require('./faqs');
const logger = require('../utils/logger');

const pausedUsers = new Set();

const GREETING_MESSAGE_BILINGUAL = `Terima kasih kerana menghubungi Hijau Group Landscape 🌿
Kami menyediakan perkhidmatan landskap (Hardscape & Softscape), pemasangan rumput tiruan dan asli, ubah suai rumah serta kerja berkaitan.
Sila tinggalkan pertanyaan atau maklumat ringkas anda, dan pasukan kami akan hubungi anda secepat mungkin.

Thank you for contacting Hijau Group Landscape 🌿
We provide landscape services (Hardscape & Softscape), artificial and natural grass installation, home renovations, and related works.
Please leave your inquiry or brief information, and our team will contact you as soon as possible.`;

const EXIT_MESSAGE_BILINGUAL = `Untuk bantuan lanjut, sila hubungi Team Sales di WhatsApp: 011-1062 9990.
For further assistance, please contact Team Sales on WhatsApp: 011-1062 9990.`;

const handleMessage = async (from, messageBody) => {
    const lowerCaseMessage = messageBody.text ? messageBody.text.body.toLowerCase() : '';

    // Check if user is paused (Human Handover active)
    if (pausedUsers.has(from)) {
        if (lowerCaseMessage === 'bot' || lowerCaseMessage === 'restart') {
            pausedUsers.delete(from);
            await whatsapp.sendText(from, "Bot activated again. / Bot diaktifkan semula.\n\n" + GREETING_MESSAGE_BILINGUAL);
            return;
        }
        logger.info(`User ${from} is in handover mode. Message ignored by bot.`);
        return;
    }

    // 1. Human Handover Trigger
    if (lowerCaseMessage.includes('agent') || lowerCaseMessage.includes('staff') || lowerCaseMessage.includes('staf')) {
        pausedUsers.add(from);
        await whatsapp.sendText(from, "Baik, saya akan sambungkan anda kepada staf kami. Sila tunggu sebentar...\n\nOkay, I will connect you to our staff. Please wait a moment...");
        return;
    }

    // 2. Greeting
    const greetings = ['hi', 'hello', 'salam', 'hey', 'start'];
    if (greetings.some(g => lowerCaseMessage.startsWith(g)) || lowerCaseMessage.length < 2) {
        await whatsapp.sendText(from, GREETING_MESSAGE_BILINGUAL);
        return;
    }

    // 3. Exit / Thank You Logic
    const exitKeywords = ['bye', 'thanks', 'tq', 'terima kasih', 'thank you'];
    if (exitKeywords.some(w => lowerCaseMessage.includes(w))) {
        await whatsapp.sendText(from, EXIT_MESSAGE_BILINGUAL);
        return;
    }

    // 4. FAQ Matching
    const faqAnswer = faqs.findFaq(lowerCaseMessage);
    if (faqAnswer) {
        await whatsapp.sendText(from, faqAnswer);
        return;
    }

    // 5. Default Fallback
    await whatsapp.sendText(from, "Maaf, saya tidak pasti mengenai soalan itu.\nSorry, I am not sure about that question.\n\n" + GREETING_MESSAGE_BILINGUAL + "\n\nAtau taip 'agent' untuk bercakap dengan staf.\nOr type 'agent' to speak with staff.");
};

module.exports = {
    handleMessage,
};
