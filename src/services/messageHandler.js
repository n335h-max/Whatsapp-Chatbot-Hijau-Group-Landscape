const whatsapp = require('./whatsapp');
const faqs = require('./faqs');
const logger = require('../utils/logger');
const { findBestMatch } = require('./keywordMatcher');
const { getContext } = require('./contextManager');
const { getCatalog, hasCatalog } = require('./catalogs');

const pausedUsers = new Set();

const GREETING_MESSAGE_BILINGUAL = `Terima kasih kerana menghubungi Hijau Group Landscape 🌿
Kami menyediakan perkhidmatan landskap (Hardscape & Softscape), pemasangan rumput tiruan dan asli, ubah suai rumah serta kerja berkaitan.

Thank you for contacting Hijau Group Landscape 🌿
We provide landscape services (Hardscape & Softscape), artificial and natural grass installation, home renovations, and related works.

Sila pilih topik di bawah atau tanya soalan anda:
Please select a topic below or ask your question:`;

const EXIT_MESSAGE_BILINGUAL = `Untuk bantuan lanjut, sila hubungi Team Sales di WhatsApp: 011-1062 9990.
For further assistance, please contact Team Sales on WhatsApp: 011-1062 9990.`;

async function sendWelcomeMenu(to, userContext) {
    const greeting = userContext.getGreeting() || GREETING_MESSAGE_BILINGUAL;
    
    // Send interactive list with common topics
    await whatsapp.sendInteractiveList(
        to,
        greeting,
        '📋 Pilih Topik / Topics',
        [
            {
                title: 'Maklumat Asas / Basic Info',
                rows: [
                    { id: 'location', title: '📍 Lokasi / Location', description: 'Our office location' },
                    { id: 'coverage', title: '🗺️ Kawasan / Coverage', description: 'Service areas' },
                    { id: 'services', title: '⚒️ Servis / Services', description: 'What we offer' }
                ]
            },
            {
                title: 'Perkhidmatan / Services',
                rows: [
                    { id: 'grass', title: '🌱 Rumput / Grass', description: 'Artificial & natural' },
                    { id: 'water_feature', title: '🌊 Water Feature', description: 'Ponds & fountains' },
                    { id: 'wood', title: '🪵 Kerja Kayu / Wood', description: 'Decking, fencing' }
                ]
            },
            {
                title: 'Harga & Proses / Pricing',
                rows: [
                    { id: 'pricing', title: '💰 Harga / Pricing', description: 'Cost & packages' },
                    { id: 'process', title: '📝 Proses / Process', description: 'How we work' },
                    { id: 'portfolio', title: '📸 Portfolio', description: 'Our past projects' }
                ]
            }
        ]
    );
}

const handleMessage = async (from, messageBody) => {
    const userContext = getContext(from);
    const messageText = messageBody.text ? messageBody.text.body : '';
    const lowerCaseMessage = messageText.toLowerCase().trim();
    
    // Log user message
    userContext.addMessage(messageText, 'user');

    // Handle interactive button/list responses
    if (messageBody.type === 'interactive') {
        const buttonResponse = messageBody.interactive.button_reply || messageBody.interactive.list_reply;
        if (buttonResponse && buttonResponse.id) {
            // Treat button ID as a keyword
            const faqAnswer = faqs.findFaqByTopic(buttonResponse.id);
            if (faqAnswer) {
                userContext.addInterest(buttonResponse.id);
                await whatsapp.sendText(from, faqAnswer);
                userContext.addMessage(faqAnswer, 'bot');
                
                // Send catalog if available
                if (hasCatalog(buttonResponse.id)) {
                    const catalog = getCatalog(buttonResponse.id);
                    const caption = `${catalog.caption_ms}\n\n${catalog.caption_en}`;
                    await whatsapp.sendDocument(from, catalog.url, catalog.filename, caption);
                }
                return;
            }
        }
    }

    // Check if user is paused (Human Handover active)
    if (pausedUsers.has(from)) {
        if (lowerCaseMessage === 'bot' || lowerCaseMessage === 'restart') {
            pausedUsers.delete(from);
            await whatsapp.sendText(from, "Bot diaktifkan semula ✅\nBot activated again ✅\n\n" + GREETING_MESSAGE_BILINGUAL);
            return;
        }
        logger.info(`User ${from} is in handover mode. Message ignored by bot.`);
        return;
    }

    // 1. Human Handover Trigger
    if (lowerCaseMessage.includes('agent') || lowerCaseMessage.includes('staff') || lowerCaseMessage.includes('staf') || lowerCaseMessage.includes('manusia')) {
        pausedUsers.add(from);
        await whatsapp.sendText(from, "Baik, saya akan sambungkan anda kepada staf kami. Sila tunggu sebentar... ⏳\n\nOkay, I will connect you to our staff. Please wait a moment... ⏳");
        return;
    }

    // 2. Greeting - send interactive menu
    const greetings = ['hi', 'hai', 'hello', 'helo', 'salam', 'hey', 'start', 'menu', 'mulakan'];
    if (greetings.some(g => lowerCaseMessage.startsWith(g)) || lowerCaseMessage.length < 2) {
        await sendWelcomeMenu(from, userContext);
        return;
    }

    // 3. Exit / Thank You Logic
    const exitKeywords = ['bye', 'thanks', 'tq', 'terima kasih', 'thank you', 'selesai', 'done'];
    if (exitKeywords.some(w => lowerCaseMessage.includes(w))) {
        await whatsapp.sendText(from, EXIT_MESSAGE_BILINGUAL);
        return;
    }

    // 4. Enhanced FAQ Matching with fuzzy search
    const bestTopic = findBestMatch(lowerCaseMessage);
    if (bestTopic) {
        const faqAnswer = faqs.findFaqByTopic(bestTopic);
        if (faqAnswer) {
            userContext.addInterest(bestTopic);
            await whatsapp.sendText(from, faqAnswer);
            userContext.addMessage(faqAnswer, 'bot');
            
            // Send catalog if available
            if (hasCatalog(bestTopic)) {
                const catalog = getCatalog(bestTopic);
                const caption = `${catalog.caption_ms}\n\n${catalog.caption_en}`;
                await whatsapp.sendDocument(from, catalog.url, catalog.filename, caption);
            }
            return;
        }
    }

    // 5. Smart fallback with suggestions
    const interests = userContext.getInterests();
    let fallbackMsg = "Maaf, saya tidak pasti mengenai soalan itu. 🤔\nSorry, I am not sure about that question. 🤔\n\n";
    
    if (interests.length > 0) {
        fallbackMsg += "Sebelum ini anda bertanya tentang:\nYou previously asked about:\n";
        fallbackMsg += interests.slice(-3).map(t => `• ${t}`).join('\n');
        fallbackMsg += "\n\n";
    }
    
    fallbackMsg += "Sila pilih 'menu' untuk lihat topik tersedia.\nPlease type 'menu' to see available topics.\n\n";
    fallbackMsg += "Atau taip 'agent' untuk bercakap dengan staf.\nOr type 'agent' to speak with staff.";
    
    await whatsapp.sendText(from, fallbackMsg);
};

module.exports = {
    handleMessage,
};
