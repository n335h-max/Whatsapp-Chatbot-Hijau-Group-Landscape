const whatsapp = require('./whatsapp');
const faqs = require('./faqs');
const logger = require('../utils/logger');
const { findBestMatch } = require('./keywordMatcher');
const { getContext } = require('./contextManager');
const { getCatalog, hasCatalog } = require('./catalogs');

const pausedUsers = new Set();
const staffNumbers = ['60111062999', '601234567890']; // Add your staff WhatsApp numbers here

// Helper to check if sender is staff
function isStaff(from) {
    return staffNumbers.includes(from);
}

const GREETING_MESSAGE_BILINGUAL = `Selamat datang ke Hijau Group Landscape! 🌿

Kami pakar dalam perkhidmatan landskap premium:
✅ Konsultasi Landskap
✅ Lukisan 3D & CAD
✅ Hardscape & Softscape
✅ Renovasi Rumah
✅ Rumput Tiruan & Asli
✅ Water Feature & Kolam
✅ Tiny House
✅ Pemotongan Pokok & Rumput
✅ Exterior Design
✅ Awning (Rumah & Premis)

━━━━━━━━━━━━━━━━━━━━━━━

Welcome to Hijau Group Landscape! 🌿

We specialize in premium landscape services:
✅ Landscape Consultation
✅ 3D & CAD Drawings
✅ Hardscape & Softscape
✅ House Renovation
✅ Artificial & Natural Grass
✅ Water Features & Ponds
✅ Tiny House Construction
✅ Tree & Grass Cutting
✅ Exterior Design
✅ Awning (Residential & Commercial)

Sila pilih topik di bawah atau tanya soalan anda:
Please select a topic below or ask your question:`;

const EXIT_MESSAGE_BILINGUAL = `Terima kasih kerana menghubungi Hijau Group Landscape! 🌿

Kami menghargai masa anda dan berharap dapat membantu merealisasikan projek landskap impian anda. 

Untuk sebarang pertanyaan lanjut atau konsultasi percuma, sila hubungi Team Sales kami di WhatsApp: 011-1062 9990

Kami sedia membantu anda! 💚

━━━━━━━━━━━━━━━━━━━━━━━

Thank you for contacting Hijau Group Landscape! 🌿

We appreciate your time and look forward to helping bring your dream landscape project to life.

For any further questions or free consultation, please contact our Sales Team on WhatsApp: 011-1062 9990

We're here to help! 💚`;

async function sendWelcomeMenu(to, userContext) {
    const greeting = userContext.getGreeting() || GREETING_MESSAGE_BILINGUAL;
    
    // Send interactive list with common topics (max 10 rows total)
    await whatsapp.sendInteractiveList(
        to,
        greeting,
        '📋 Pilih Topik',
        [
            {
                title: 'Maklumat',
                rows: [
                    { id: 'location', title: '📍 Lokasi', description: 'Office location & address' },
                    { id: 'services', title: '⚒️ Perkhidmatan', description: 'All services we offer' },
                    { id: 'pricing', title: '💰 Harga & Pakej', description: 'Pricing & packages' }
                ]
            },
            {
                title: 'Katalog',
                rows: [
                    { id: 'grass', title: '🌱 Rumput', description: 'Artificial & natural grass' },
                    { id: 'water_feature', title: '🌊 Water Feature', description: 'Ponds & fountains' },
                    { id: 'planter_box', title: '🪴 Planter Box', description: 'Boxes & benches' },
                    { id: 'stepping', title: '🪨 Stepping Slabs', description: 'Garden stepping stones' }
                ]
            },
            {
                title: 'Lain-lain',
                rows: [
                    { id: 'process', title: '📝 Proses', description: 'How we work & payment' },
                    { id: 'portfolio', title: '📸 Portfolio', description: 'Past projects & gallery' },
                    { id: 'contact', title: '📞 Hubungi', description: 'Contact sales team' }
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
    
    // Staff commands (only staff can use these)
    if (isStaff(from)) {
        // Staff can pause bot for any customer by messaging: "pause 60123456789"
        if (lowerCaseMessage.startsWith('pause ')) {
            const customerNumber = lowerCaseMessage.split(' ')[1];
            pausedUsers.add(customerNumber);
            await whatsapp.sendText(from, `✅ Bot paused for ${customerNumber}\n\nThe bot will not reply to this customer until you type: resume ${customerNumber}`);
            return;
        }
        
        // Staff can resume bot: "resume 60123456789"
        if (lowerCaseMessage.startsWith('resume ')) {
            const customerNumber = lowerCaseMessage.split(' ')[1];
            pausedUsers.delete(customerNumber);
            await whatsapp.sendText(from, `✅ Bot resumed for ${customerNumber}\n\nAutomatic replies are now active again.`);
            return;
        }
        
        // Check all paused users
        if (lowerCaseMessage === 'paused list' || lowerCaseMessage === 'pausedlist') {
            const paused = Array.from(pausedUsers);
            if (paused.length === 0) {
                await whatsapp.sendText(from, '✅ No customers are currently paused.');
            } else {
                await whatsapp.sendText(from, `⏸️ Paused customers (${paused.length}):\n\n${paused.join('\n')}\n\nType "resume [number]" to enable bot.`);
            }
            return;
        }
    }

    // Handle interactive button/list responses
    if (messageBody.type === 'interactive') {
        const buttonResponse = messageBody.interactive.button_reply || messageBody.interactive.list_reply;
        if (buttonResponse && buttonResponse.id) {
            // Handle contact option
            if (buttonResponse.id === 'contact') {
                const contactMsg = `📞 Hubungi Team Sales Kami / Contact Our Sales Team

Sila hubungi Team Sales kami untuk:
✅ Konsultasi PERCUMA
✅ Quotation & Harga
✅ Lawatan Tapak (Site Visit)
✅ Design & Pelan 3D

WhatsApp: 011-1062 9990

━━━━━━━━━━━━━━━━━━━━━━━

Please contact our Sales Team for:
✅ FREE Consultation
✅ Quotation & Pricing
✅ Site Visit
✅ 3D Design & Plans

WhatsApp: 011-1062 9990

Waktu Operasi / Operating Hours:
📅 Isnin - Sabtu / Mon - Sat
🕐 9:00 AM - 6:00 PM

━━━━━━━━━━━━━━━━━━━━━━━

📅 TEMPAH KONSULTASI / BOOK CONSULTATION:
Isi borang online di / Fill online form at:
🔗 https://www.hijaugrouplandscape.com.my/contact

Kami tunggu berita dari anda! 💚
We look forward to hearing from you! 💚`;
                
                await whatsapp.sendText(from, contactMsg);
                return;
            }
            
            // Map button IDs to catalog names
            const catalogMap = {
                'stepping': 'stepping_slabs'
            };
            
            // Treat button ID as a keyword
            const faqAnswer = faqs.findFaqByTopic(buttonResponse.id);
            if (faqAnswer) {
                userContext.addInterest(buttonResponse.id);
                await whatsapp.sendText(from, faqAnswer);
                userContext.addMessage(faqAnswer, 'bot');
                
                // Send catalog if available (check mapped name)
                const catalogId = catalogMap[buttonResponse.id] || buttonResponse.id;
                if (hasCatalog(catalogId)) {
                    const catalog = getCatalog(catalogId);
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
        const handoverMsg = `🙋‍♂️ Untuk bercakap dengan Team Sales kami secara langsung:

📞 WhatsApp: 011-1062 9990

Sila hubungi nombor di atas dan team kami akan membantu anda dengan segera! 💚

━━━━━━━━━━━━━━━━━━━━━━━

🙋‍♂️ To speak with our Sales Team directly:

📞 WhatsApp: 011-1062 9990

Please contact the number above and our team will assist you immediately! 💚

Waktu Operasi / Operating Hours:
📅 Isnin - Sabtu / Mon - Sat  
🕐 9:00 AM - 6:00 PM`;
        
        await whatsapp.sendText(from, handoverMsg);
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
            
            // Map topic names to catalog names
            const catalogMap = {
                'stepping': 'stepping_slabs'
            };
            
            // Send catalog if available (check mapped name)
            const catalogId = catalogMap[bestTopic] || bestTopic;
            if (hasCatalog(catalogId)) {
                const catalog = getCatalog(catalogId);
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
