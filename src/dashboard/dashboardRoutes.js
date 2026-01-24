const express = require('express');
const router = express.Router();
const whatsapp = require('../services/whatsapp');
const { getContext, getAllContexts } = require('../services/contextManager');
const { getAllConversations } = require('../services/database');

// Get all conversations
router.get('/conversations', async (req, res) => {
    try {
        // Always try to get from database first for most up-to-date data
        const dbConversations = await getAllConversations();
        
        if (dbConversations && dbConversations.length > 0) {
            // Return conversations from database
            const conversations = dbConversations.map(conv => ({
                phone: conv.phoneNumber,
                name: conv.name || 'Unknown',
                lastMessage: conv.conversationHistory && conv.conversationHistory.length > 0 
                    ? conv.conversationHistory[conv.conversationHistory.length - 1]?.message || ''
                    : 'No messages',
                lastInteraction: conv.lastInteraction,
                unread: conv.unreadCount || 0
            }));
            
            // Sort by last interaction (most recent first)
            conversations.sort((a, b) => new Date(b.lastInteraction) - new Date(a.lastInteraction));
            
            return res.json(conversations);
        }
        
        // Fallback to in-memory contexts
        const contexts = getAllContexts();
        const conversations = [];
        
        for (const [phone, context] of contexts.entries()) {
            if (context.conversationHistory.length > 0) {
                conversations.push({
                    phone: phone,
                    name: context.name || 'Unknown',
                    lastMessage: context.conversationHistory[context.conversationHistory.length - 1]?.message || 'No messages',
                    lastInteraction: context.lastInteraction,
                    unread: context.unreadCount || 0
                });
            }
        }
        
        // Sort by last interaction (most recent first)
        conversations.sort((a, b) => new Date(b.lastInteraction) - new Date(a.lastInteraction));
        
        res.json(conversations);
    } catch (error) {
        console.error('Error loading conversations:', error);
        res.status(500).json({ error: 'Failed to load conversations' });
    }
});

// Get messages for a specific customer
router.get('/messages/:phone', async (req, res) => {
    const phone = req.params.phone;
    
    try {
        // Get context (synchronous)
        const context = getContext(phone);
        
        // Small delay to allow async DB loading to complete
        await new Promise(resolve => setTimeout(resolve, 100));
        
        // If still no messages, try loading from database directly
        if (context.conversationHistory.length === 0) {
            const { loadConversation } = require('../services/database');
            const dbContext = await loadConversation(phone);
            
            if (dbContext && dbContext.conversationHistory) {
                // Update in-memory context
                context.conversationHistory = dbContext.conversationHistory;
                context.name = dbContext.name;
                context.location = dbContext.location;
                context.interests = dbContext.interests || [];
                context.staffNotes = dbContext.staffNotes || '';
                context.unreadCount = dbContext.unreadCount || 0;
            }
        }
        
        const messages = context.conversationHistory.map(msg => ({
            type: msg.type, // 'user' or 'bot'
            text: msg.message,
            timestamp: msg.timestamp
        }));
        
        res.json(messages);
    } catch (error) {
        console.error('Error loading messages:', error);
        res.status(500).json({ error: 'Failed to load messages' });
    }
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

// Get notes for a customer
router.get('/notes/:phone', (req, res) => {
    const phone = req.params.phone;
    const context = getContext(phone);
    res.json({ notes: context.staffNotes || '' });
});

// Save notes for a customer
router.post('/notes', (req, res) => {
    const { phone, notes } = req.body;
    const context = getContext(phone);
    context.updateStaffNotes(notes);
    res.json({ success: true });
});

// Mark conversation as read
router.post('/mark-read', (req, res) => {
    const { phone } = req.body;
    const context = getContext(phone);
    context.markAsRead();
    res.json({ success: true });
});

module.exports = router;
