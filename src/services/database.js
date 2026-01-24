const { MongoClient } = require('mongodb');
const logger = require('../utils/logger');

let client = null;
let db = null;
let conversationsCollection = null;

// MongoDB connection
async function connectDB() {
    try {
        const mongoUri = process.env.MONGODB_URI;
        
        if (!mongoUri) {
            logger.warn('MONGODB_URI not found. Running without database (in-memory only).');
            return false;
        }

        client = new MongoClient(mongoUri, {
            serverSelectionTimeoutMS: 5000,
        });

        await client.connect();
        db = client.db('whatsapp_bot');
        conversationsCollection = db.collection('conversations');

        // Create indexes
        await conversationsCollection.createIndex({ phoneNumber: 1 });
        await conversationsCollection.createIndex({ lastInteraction: -1 });

        logger.info('✅ Connected to MongoDB successfully');
        return true;
    } catch (error) {
        logger.error('MongoDB connection error:', error.message);
        logger.warn('Continuing without database (in-memory only)');
        return false;
    }
}

// Save conversation to database
async function saveConversation(phoneNumber, context) {
    if (!conversationsCollection) return;

    try {
        await conversationsCollection.updateOne(
            { phoneNumber },
            {
                $set: {
                    phoneNumber,
                    name: context.name,
                    location: context.location,
                    interests: context.interests,
                    conversationHistory: context.conversationHistory,
                    lastInteraction: context.lastInteraction,
                    updatedAt: new Date()
                }
            },
            { upsert: true }
        );
    } catch (error) {
        logger.error('Error saving conversation to DB:', error.message);
    }
}

// Load conversation from database
async function loadConversation(phoneNumber) {
    if (!conversationsCollection) return null;

    try {
        const conversation = await conversationsCollection.findOne({ phoneNumber });
        return conversation;
    } catch (error) {
        logger.error('Error loading conversation from DB:', error.message);
        return null;
    }
}

// Get all conversations from database
async function getAllConversations() {
    if (!conversationsCollection) return [];

    try {
        const conversations = await conversationsCollection
            .find({})
            .sort({ lastInteraction: -1 })
            .toArray();
        return conversations;
    } catch (error) {
        logger.error('Error loading all conversations from DB:', error.message);
        return [];
    }
}

// Delete old conversations (older than 7 days)
async function cleanupOldConversations() {
    if (!conversationsCollection) return;

    try {
        const sevenDaysAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);
        const result = await conversationsCollection.deleteMany({
            lastInteraction: { $lt: sevenDaysAgo }
        });
        
        if (result.deletedCount > 0) {
            logger.info(`🗑️ Cleaned up ${result.deletedCount} old conversations from DB`);
        }
    } catch (error) {
        logger.error('Error cleaning up old conversations:', error.message);
    }
}

// Run cleanup daily
setInterval(cleanupOldConversations, 24 * 60 * 60 * 1000);

// Graceful shutdown
process.on('SIGINT', async () => {
    if (client) {
        await client.close();
        logger.info('MongoDB connection closed');
    }
    process.exit(0);
});

module.exports = {
    connectDB,
    saveConversation,
    loadConversation,
    getAllConversations,
    cleanupOldConversations
};
