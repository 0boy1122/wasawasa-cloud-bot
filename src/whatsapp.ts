import axios from 'axios';

const WHATSAPP_API_URL = 'https://graph.facebook.com/v18.0';

/**
 * Send a text message via WhatsApp Cloud API
 */
export async function sendMessage(to: string, message: string): Promise<boolean> {
    const phoneNumberId = process.env.WHATSAPP_PHONE_NUMBER_ID;
    const accessToken = process.env.WHATSAPP_ACCESS_TOKEN;

    if (!phoneNumberId || !accessToken) {
        console.error('❌ Missing WhatsApp API credentials!');
        return false;
    }

    try {
        const response = await axios.post(
            `${WHATSAPP_API_URL}/${phoneNumberId}/messages`,
            {
                messaging_product: 'whatsapp',
                recipient_type: 'individual',
                to: to,
                type: 'text',
                text: {
                    preview_url: false,
                    body: message
                }
            },
            {
                headers: {
                    'Authorization': `Bearer ${accessToken}`,
                    'Content-Type': 'application/json'
                }
            }
        );

        console.log(`📤 Message sent to ${to}`);
        return true;
    } catch (error: any) {
        console.error('❌ Failed to send message:', error.response?.data || error.message);
        return false;
    }
}

/**
 * Send interactive buttons (for future enhancement)
 */
export async function sendInteractiveButtons(
    to: string,
    bodyText: string,
    buttons: Array<{ id: string; title: string }>
): Promise<boolean> {
    const phoneNumberId = process.env.WHATSAPP_PHONE_NUMBER_ID;
    const accessToken = process.env.WHATSAPP_ACCESS_TOKEN;

    if (!phoneNumberId || !accessToken) {
        console.error('❌ Missing WhatsApp API credentials!');
        return false;
    }

    try {
        const response = await axios.post(
            `${WHATSAPP_API_URL}/${phoneNumberId}/messages`,
            {
                messaging_product: 'whatsapp',
                recipient_type: 'individual',
                to: to,
                type: 'interactive',
                interactive: {
                    type: 'button',
                    body: {
                        text: bodyText
                    },
                    action: {
                        buttons: buttons.map(btn => ({
                            type: 'reply',
                            reply: {
                                id: btn.id,
                                title: btn.title
                            }
                        }))
                    }
                }
            },
            {
                headers: {
                    'Authorization': `Bearer ${accessToken}`,
                    'Content-Type': 'application/json'
                }
            }
        );

        console.log(`📤 Interactive message sent to ${to}`);
        return true;
    } catch (error: any) {
        console.error('❌ Failed to send interactive message:', error.response?.data || error.message);
        return false;
    }
}
