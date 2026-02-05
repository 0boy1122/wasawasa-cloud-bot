import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { webhookHandler, webhookVerify } from './webhook';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());

// Health check
app.get('/', (req, res) => {
    res.json({
        status: 'ok',
        service: 'WasaWasa WhatsApp Bot',
        version: '1.0.0',
        timestamp: new Date().toISOString()
    });
});

// Meta Webhook Verification (GET)
app.get('/webhook', webhookVerify);

// Meta Webhook Handler (POST)
app.post('/webhook', webhookHandler);

// Start server
app.listen(PORT, () => {
    console.log('🥣 WasaWasa Bot is running!');
    console.log(`📡 Webhook URL: http://localhost:${PORT}/webhook`);
    console.log('☁️  Using Meta WhatsApp Cloud API');
});
