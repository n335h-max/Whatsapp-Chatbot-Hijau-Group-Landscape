// In-memory context storage (for production, use Redis or database)
const userContexts = new Map();
const { saveConversation, loadConversation } = require('./database');

class UserContext {
    constructor(phoneNumber) {
        this.phoneNumber = phoneNumber;
        this.name = null;
        this.location = null;
        this.interests = []; // Topics they've asked about
        this.lastInteraction = new Date();
        this.conversationHistory = [];
    }

    updateName(name) {
        this.name = name;
        this.saveToDB();
    }

    updateLocation(location) {
        this.location = location;
        this.saveToDB();
    }

    addInterest(topic) {
        if (!this.interests.includes(topic)) {
            this.interests.push(topic);
        }
        this.saveToDB();
    }

    addMessage(message, type = 'user') {
        this.conversationHistory.push({
            message,
            type, // 'user' or 'bot'
            timestamp: new Date()
        });
        
        // Keep only last 50 messages
        if (this.conversationHistory.length > 50) {
            this.conversationHistory.shift();
        }
        
        this.saveToDB();
    }

    getInterests() {
        return this.interests;
    }

    isReturningUser() {
        return this.conversationHistory.length > 3;
    }

    getGreeting() {
        if (this.name) {
            return `Hai ${this.name}! 👋\nHi ${this.name}! 👋`;
        }
        return null;
    }
    
    // Save to database
    async saveToDB() {
        try {
            await saveConversation(this.phoneNumber, this);
        } catch (error) {
            // Silently fail if DB not available
        }
    }
}

function getContext(phoneNumber) {
    if (!userContexts.has(phoneNumber)) {
        // Create new context and try to load from database asynchronously
        const context = new UserContext(phoneNumber);
        userContexts.set(phoneNumber, context);
        
        // Load from database in background (don't block)
        loadConversation(phoneNumber).then(savedContext => {
            if (savedContext) {
                context.name = savedContext.name;
                context.location = savedContext.location;
                context.interests = savedContext.interests || [];
                context.conversationHistory = savedContext.conversationHistory || [];
                context.lastInteraction = new Date(savedContext.lastInteraction);
            }
        }).catch(() => {
            // Silently fail if DB load fails
        });
    }
    
    const context = userContexts.get(phoneNumber);
    context.lastInteraction = new Date();
    return context;
}

function clearOldContexts() {
    const now = new Date();
    const sevenDays = 7 * 24 * 60 * 60 * 1000; // 7 days in milliseconds
    
    for (const [phoneNumber, context] of userContexts.entries()) {
        if (now - context.lastInteraction > sevenDays) {
            userContexts.delete(phoneNumber);
        }
    }
}

// Clean up old contexts every 24 hours
setInterval(clearOldContexts, 24 * 60 * 60 * 1000);

function getAllContexts() {
    return userContexts;
}

// Initialize contexts from database on startup
async function initializeFromDatabase() {
    const { getAllConversations } = require('./database');
    try {
        const conversations = await getAllConversations();
        if (conversations && conversations.length > 0) {
            for (const conv of conversations) {
                const context = new UserContext(conv.phoneNumber);
                context.name = conv.name;
                context.location = conv.location;
                context.interests = conv.interests || [];
                context.conversationHistory = conv.conversationHistory || [];
                context.lastInteraction = new Date(conv.lastInteraction);
                userContexts.set(conv.phoneNumber, context);
            }
            console.log(`✅ Loaded ${conversations.length} conversations from database into memory`);
        }
    } catch (error) {
        console.log('ℹ️ Running without database preload');
    }
}

// Auto-initialize on module load
initializeFromDatabase();

module.exports = {
    getContext,
    getAllContexts,
    UserContext,
    initializeFromDatabase
};
