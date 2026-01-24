const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');
const webhookController = require('./controllers/webhook');
const dashboardRoutes = require('./dashboard/dashboardRoutes');
const logger = require('./utils/logger');

const app = express();

// Log all incoming requests
app.use((req, res, next) => {
    logger.info(`${req.method} ${req.path} from ${req.ip}`);
    next();
});

// Middleware
app.use(bodyParser.json());

// Serve static files for dashboard
app.use('/dashboard', express.static(path.join(__dirname, '../public/dashboard')));

// API Routes
app.use('/api/dashboard', dashboardRoutes);

// Routes
app.get('/webhook', webhookController.verifyWebhook);
app.post('/webhook', webhookController.handleWebhook);

app.get('/', (req, res) => {
    res.send('Hijau Group Landscape Bot is running! <br><br><a href="/dashboard">📊 Access Dashboard</a>');
});

module.exports = app;
