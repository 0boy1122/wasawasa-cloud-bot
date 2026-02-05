import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { twilioWebhook } from './webhook';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.urlencoded({ extended: false })); // Twilio sends URL-encoded data
app.use(express.json());

// Health check
app.get('/', (req, res) => {
    res.json({
        status: 'ok',
        service: 'WasaWasa WhatsApp Bot (Twilio)',
        version: '2.0.0',
        timestamp: new Date().toISOString()
    });
});

// Twilio Webhook (POST) - receives WhatsApp messages
app.post('/webhook', twilioWebhook);

// Start server
app.listen(PORT, () => {
    console.log('🥣 WasaWasa Bot is running!');
    console.log(`📡 Webhook URL: http://localhost:${PORT}/webhook`);
    console.log('📱 Using Twilio WhatsApp Sandbox');
    console.log('');
    console.log('To join the sandbox, send this to +1 415 523 8886:');
    console.log('   join foot-kept');
});
