const express = require('express');
const bodyParser = require('body-parser');
const webhookController = require('./controllers/webhook');
const logger = require('./utils/logger');

const app = express();

// Log all incoming requests
app.use((req, res, next) => {
    logger.info(`${req.method} ${req.path} from ${req.ip}`);
    next();
});

// Middleware
app.use(bodyParser.json());

// Routes
app.get('/webhook', webhookController.verifyWebhook);
app.post('/webhook', webhookController.handleWebhook);

app.get('/', (req, res) => {
    res.send('Hijau Group Landscape Bot is running!');
});

module.exports = app;
