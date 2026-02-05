import { Request, Response } from 'express';
import { handleIncomingMessage } from './bot';

/**
 * Twilio Webhook Handler
 * Receives WhatsApp messages from Twilio
 */
export const twilioWebhook = async (req: Request, res: Response) => {
    try {
        // Twilio sends data as URL-encoded form
        const from = req.body.From; // Format: whatsapp:+233XXXXXXXXX
        const body = req.body.Body || '';
        const profileName = req.body.ProfileName || 'Customer';

        if (from && body) {
            // Extract phone number from "whatsapp:+233XXXXXXXXX" format
            const phoneNumber = from.replace('whatsapp:', '');

            console.log(`📩 Message from ${profileName} (${phoneNumber}): ${body}`);

            // Process the message and get response
            const response = await handleIncomingMessage(phoneNumber, body, profileName);

            // Send TwiML response (Twilio's XML format)
            res.set('Content-Type', 'text/xml');
            res.send(`<?xml version="1.0" encoding="UTF-8"?>
<Response>
    <Message>${escapeXml(response)}</Message>
</Response>`);
        } else {
            res.status(200).send('OK');
        }
    } catch (error) {
        console.error('Webhook error:', error);
        res.status(500).send('Error');
    }
};

// Escape special XML characters
function escapeXml(text: string): string {
    return text
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&apos;');
}
