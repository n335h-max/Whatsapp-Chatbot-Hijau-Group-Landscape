const app = require('./app');
const config = require('./config');
const logger = require('./utils/logger');
const { connectDB } = require('./services/database');

// Connect to database and start server
async function startServer() {
    // Try to connect to MongoDB (optional - will work without it)
    await connectDB();
    
    app.listen(config.port, () => {
        logger.info(`Server is running on port ${config.port}`);
    });
}

startServer();
