import { sendWhatsAppMessage } from './whatsapp';

// Customer session storage
interface CustomerSession {
    stage: 'greeting' | 'selecting_price' | 'getting_location' | 'confirming' | 'complete';
    price?: string;
    location?: string;
    name: string;
}

const sessions = new Map<string, CustomerSession>();

/**
 * Handle incoming WhatsApp messages
 * Returns the response message to send back
 */
export async function handleIncomingMessage(from: string, message: string, senderName: string): Promise<string> {
    const msg = message.toLowerCase().trim();

    // Get or create session
    let session = sessions.get(from);

    if (!session) {
        // New customer - start fresh
        session = { stage: 'greeting', name: senderName };
        sessions.set(from, session);
    }

    // Handle based on current stage
    switch (session.stage) {
        case 'greeting':
            return handleGreeting(from, session);
        case 'selecting_price':
            return handlePriceSelection(from, msg, session);
        case 'getting_location':
            return handleLocation(from, message, session);
        case 'confirming':
            return handleConfirmation(from, msg, session);
        case 'complete':
            // Reset for new order
            session.stage = 'greeting';
            session.price = undefined;
            session.location = undefined;
            return handleGreeting(from, session);
        default:
            return handleGreeting(from, session);
    }
}

/**
 * Send greeting and menu
 */
function handleGreeting(from: string, session: CustomerSession): string {
    session.stage = 'selecting_price';

    return `🥣 *Welcome to WasaWasa!*

Hello ${session.name}! 👋

We serve *authentic Wasawasa* - a delicious Northern Ghanaian dish made from millet flour.

*Choose your portion size:*
• 5 GHS - Small
• 10 GHS - Medium  
• 15 GHS - Large
• 20 GHS - Extra Large

📍 We deliver anywhere in Wa!

Reply with the amount you want (5, 10, 15, or 20):`;
}

/**
 * Handle price selection
 */
function handlePriceSelection(from: string, msg: string, session: CustomerSession): string {
    // Extract number from message
    const priceMatch = msg.match(/\b(5|10|15|20)\b/);

    if (priceMatch) {
        session.price = priceMatch[1];
        session.stage = 'getting_location';

        return `✅ Great choice! *${session.price} GHS* portion.

📍 Now, please send your *delivery location* (e.g., "Bamahu, near Total filling station")`;
    } else {
        return `❌ Please choose a valid price: *5*, *10*, *15*, or *20* GHS`;
    }
}

/**
 * Handle delivery location
 */
function handleLocation(from: string, location: string, session: CustomerSession): string {
    if (location.length < 5) {
        return `📍 Please provide a more detailed location so we can find you!`;
    }

    session.location = location;
    session.stage = 'confirming';

    return `📋 *ORDER SUMMARY*

🥣 Item: Wasawasa
💰 Price: *${session.price} GHS*
📍 Delivery: *${session.location}*

Is this correct? Reply *YES* to confirm or *NO* to cancel.`;
}

/**
 * Handle order confirmation
 */
async function handleConfirmation(from: string, msg: string, session: CustomerSession): Promise<string> {
    if (msg.includes('yes') || msg.includes('confirm') || msg.includes('ok')) {
        // Order confirmed!
        session.stage = 'complete';

        // Notify restaurant owner (async, don't wait)
        notifyRestaurant(from, session);

        // Clear session
        const response = `🎉 *ORDER CONFIRMED!*

Thank you ${session.name}! Your order is being prepared.

📦 *${session.price} GHS Wasawasa*
📍 Delivering to: ${session.location}

Expected delivery: *30-45 minutes*

For any questions, call: 0209856297

Enjoy your meal! 🥣✨`;

        sessions.delete(from);
        return response;

    } else if (msg.includes('no') || msg.includes('cancel')) {
        session.stage = 'greeting';
        session.price = undefined;
        session.location = undefined;

        return `❌ Order cancelled. 

Send any message to start a new order! 🥣`;
    } else {
        return `Please reply *YES* to confirm or *NO* to cancel your order.`;
    }
}

/**
 * Notify restaurant owner about new order
 */
async function notifyRestaurant(customerPhone: string, session: CustomerSession): Promise<void> {
    const restaurantPhone = process.env.RESTAURANT_PHONE;

    if (!restaurantPhone) {
        console.log('⚠️ RESTAURANT_PHONE not set in environment');
        return;
    }

    const notification = `🔔 *NEW ORDER!*

👤 Customer: ${session.name}
📞 Phone: ${customerPhone}
🥣 Order: Wasawasa
💰 Price: ${session.price} GHS
📍 Location: ${session.location}

Time: ${new Date().toLocaleString('en-GB', { timeZone: 'Africa/Accra' })}`;

    try {
        await sendWhatsAppMessage(restaurantPhone, notification);
        console.log('📱 Restaurant notified of new order!');
    } catch (error) {
        console.error('Failed to notify restaurant:', error);
    }
}
