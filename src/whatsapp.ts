import Twilio from 'twilio';

const accountSid = process.env.TWILIO_ACCOUNT_SID;
const authToken = process.env.TWILIO_AUTH_TOKEN;
const twilioNumber = process.env.TWILIO_WHATSAPP_NUMBER || '+14155238886';

let client: Twilio.Twilio | null = null;

function getClient(): Twilio.Twilio {
    if (!client) {
        if (!accountSid || !authToken) {
            throw new Error('Twilio credentials not configured');
        }
        client = Twilio(accountSid, authToken);
    }
    return client;
}

/**
 * Send a WhatsApp message via Twilio
 */
export async function sendWhatsAppMessage(to: string, message: string): Promise<boolean> {
    try {
        const twilioClient = getClient();

        // Format numbers for Twilio WhatsApp
        const fromNumber = `whatsapp:${twilioNumber}`;
        const toNumber = to.startsWith('whatsapp:') ? to : `whatsapp:${to}`;

        const result = await twilioClient.messages.create({
            body: message,
            from: fromNumber,
            to: toNumber
        });

        console.log(`📤 Message sent to ${to}, SID: ${result.sid}`);
        return true;
    } catch (error: any) {
        console.error('❌ Failed to send message:', error.message);
        return false;
    }
}
