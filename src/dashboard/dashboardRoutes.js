const express = require('express');
const router = express.Router();
const whatsapp = require('../services/whatsapp');
const { getContext, getAllContexts } = require('../services/contextManager');
const { getAllConversations } = require('../services/database');
const { pausedUsers } = require('../services/messageHandler');

// Get all conversations
router.get('/conversations', async (req, res) => {
    const conversations = [];
    
    // Try to load from database first
    try {
        const dbConversations = await getAllConversations();
        if (dbConversations && dbConversations.length > 0) {
            dbConversations.forEach(conv => {
                const lastMessage = conv.conversationHistory && conv.conversationHistory.length > 0 
                    ? conv.conversationHistory[conv.conversationHistory.length - 1]
                    : null;
                
                conversations.push({
                    phone: conv.phoneNumber,
                    name: conv.name || conv.phoneNumber,
                    profilePicture: null,
                    lastMessage: lastMessage ? lastMessage.message : 'No messages yet',
                    lastMessageTime: lastMessage ? lastMessage.timestamp : conv.lastInteraction,
                    isPaused: pausedUsers.has(conv.phoneNumber),
                    unreadCount: 0
                });
            });
        }
    } catch (error) {
        // Fallback to in-memory if DB fails
    }
    
    // Also include in-memory contexts (in case DB is not available)
    const userContexts = getAllContexts();
    for (const [phone, context] of userContexts.entries()) {
        // Skip if already in DB results
        if (conversations.find(c => c.phone === phone)) continue;
        
        const lastMessage = context.conversationHistory.length > 0 
            ? context.conversationHistory[context.conversationHistory.length - 1]
            : null;
        
        conversations.push({
            phone: phone,
            name: context.name || phone,
            profilePicture: null,
            lastMessage: lastMessage ? lastMessage.message : 'No messages yet',
            lastMessageTime: lastMessage ? lastMessage.timestamp : context.lastInteraction,
            isPaused: pausedUsers.has(phone),
            unreadCount: 0
        });
    }
    
    // Sort by most recent activity
    conversations.sort((a, b) => new Date(b.lastMessageTime) - new Date(a.lastMessageTime));
    
    res.json(conversations);
});

// Get messages for a specific customer
router.get('/messages/:phone', (req, res) => {
    const phone = req.params.phone;
    const context = getContext(phone);
    
    const messages = context.conversationHistory.map(msg => ({
        type: msg.type, // 'user' or 'bot'
        text: msg.message,
        timestamp: msg.timestamp
    }));
    
    res.json(messages);
});

// Send message to customer
router.post('/send', async (req, res) => {
    const { to, message } = req.body;
    
    try {
        await whatsapp.sendText(to, message);
        
        // Log in context
        const context = getContext(to);
        context.addMessage(message, 'staff');
        
        res.json({ success: true });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Pause bot for customer
router.post('/pause', (req, res) => {
    const { phone } = req.body;
    const { pausedUsers } = require('../services/messageHandler');
    pausedUsers.add(phone);
    res.json({ success: true });
});

// Resume bot for customer
router.post('/resume', (req, res) => {
    const { phone } = req.body;
    const { pausedUsers } = require('../services/messageHandler');
    pausedUsers.delete(phone);
    res.json({ success: true });
});

module.exports = router;
