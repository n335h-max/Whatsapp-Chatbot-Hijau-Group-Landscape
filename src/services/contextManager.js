// In-memory context storage (for production, use Redis or database)
const userContexts = new Map();

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
    }

    updateLocation(location) {
        this.location = location;
    }

    addInterest(topic) {
        if (!this.interests.includes(topic)) {
            this.interests.push(topic);
        }
    }

    addMessage(message, type = 'user') {
        this.conversationHistory.push({
            message,
            type, // 'user' or 'bot'
            timestamp: new Date()
        });
        
        // Keep only last 20 messages
        if (this.conversationHistory.length > 20) {
            this.conversationHistory.shift();
        }
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
}

function getContext(phoneNumber) {
    if (!userContexts.has(phoneNumber)) {
        userContexts.set(phoneNumber, new UserContext(phoneNumber));
    }
    
    const context = userContexts.get(phoneNumber);
    context.lastInteraction = new Date();
    return context;
}

function clearOldContexts() {
    const now = new Date();
    const oneHour = 60 * 60 * 1000;
    
    for (const [phoneNumber, context] of userContexts.entries()) {
        if (now - context.lastInteraction > oneHour) {
            userContexts.delete(phoneNumber);
        }
    }
}

// Clean up old contexts every 30 minutes
setInterval(clearOldContexts, 30 * 60 * 1000);

function getAllContexts() {
    return userContexts;
}

module.exports = {
    getContext,
    getAllContexts,
    UserContext
};
