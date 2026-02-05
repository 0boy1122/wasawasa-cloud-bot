import { Request, Response } from 'express';
import { handleIncomingMessage } from './bot';

/**
 * Webhook Verification Handler
 * Meta sends a GET request to verify your webhook URL
 */
export const webhookVerify = (req: Request, res: Response) => {
    const mode = req.query['hub.mode'];
    const token = req.query['hub.verify_token'];
    const challenge = req.query['hub.challenge'];

    const VERIFY_TOKEN = process.env.WEBHOOK_VERIFY_TOKEN;

    if (mode === 'subscribe' && token === VERIFY_TOKEN) {
        console.log('✅ Webhook verified successfully!');
        res.status(200).send(challenge);
    } else {
        console.log('❌ Webhook verification failed');
        res.sendStatus(403);
    }
};

/**
 * Webhook Message Handler
 * Meta sends POST requests when messages arrive
 */
export const webhookHandler = async (req: Request, res: Response) => {
    try {
        const body = req.body;

        // Check if this is a WhatsApp message
        if (body.object === 'whatsapp_business_account') {
            const entry = body.entry?.[0];
            const changes = entry?.changes?.[0];
            const value = changes?.value;

            // Handle incoming messages
            if (value?.messages) {
                const message = value.messages[0];
                const from = message.from; // Sender's phone number
                const messageBody = message.text?.body || '';
                const senderName = value.contacts?.[0]?.profile?.name || 'Customer';

                console.log(`📩 Message from ${senderName} (${from}): ${messageBody}`);

                // Process the message
                await handleIncomingMessage(from, messageBody, senderName);
            }

            // Always return 200 to acknowledge receipt
            res.sendStatus(200);
        } else {
            res.sendStatus(404);
        }
    } catch (error) {
        console.error('Webhook error:', error);
        res.sendStatus(500);
    }
};
