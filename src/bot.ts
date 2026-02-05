import { sendMessage, sendInteractiveButtons } from './whatsapp';

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
 */
export async function handleIncomingMessage(from: string, message: string, senderName: string): Promise<void> {
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
            await handleGreeting(from, session);
            break;
        case 'selecting_price':
            await handlePriceSelection(from, msg, session);
            break;
        case 'getting_location':
            await handleLocation(from, message, session);
            break;
        case 'confirming':
            await handleConfirmation(from, msg, session);
            break;
        case 'complete':
            // Reset for new order
            session.stage = 'greeting';
            session.price = undefined;
            session.location = undefined;
            await handleGreeting(from, session);
            break;
    }
}

/**
 * Send greeting and menu
 */
async function handleGreeting(from: string, session: CustomerSession): Promise<void> {
    const greeting = `🥣 *Welcome to WasaWasa!*

Hello ${session.name}! 👋

We serve *authentic Wasawasa* - a delicious Northern Ghanaian dish made from millet flour.

*Choose your portion size:*
• 5 GHS - Small
• 10 GHS - Medium  
• 15 GHS - Large
• 20 GHS - Extra Large

📍 We deliver anywhere in Wa!

Reply with the amount you want (5, 10, 15, or 20):`;

    await sendMessage(from, greeting);
    session.stage = 'selecting_price';
}

/**
 * Handle price selection
 */
async function handlePriceSelection(from: string, msg: string, session: CustomerSession): Promise<void> {
    const validPrices = ['5', '10', '15', '20'];

    // Extract number from message
    const priceMatch = msg.match(/\b(5|10|15|20)\b/);

    if (priceMatch) {
        session.price = priceMatch[1];
        session.stage = 'getting_location';

        await sendMessage(from, `✅ Great choice! *${session.price} GHS* portion.

📍 Now, please send your *delivery location* (e.g., "Bamahu, near Total filling station")`);
    } else {
        await sendMessage(from, `❌ Please choose a valid price: *5*, *10*, *15*, or *20* GHS`);
    }
}

/**
 * Handle delivery location
 */
async function handleLocation(from: string, location: string, session: CustomerSession): Promise<void> {
    if (location.length < 5) {
        await sendMessage(from, `📍 Please provide a more detailed location so we can find you!`);
        return;
    }

    session.location = location;
    session.stage = 'confirming';

    const orderSummary = `📋 *ORDER SUMMARY*

🥣 Item: Wasawasa
💰 Price: *${session.price} GHS*
📍 Delivery: *${session.location}*

Is this correct? Reply *YES* to confirm or *NO* to cancel.`;

    await sendMessage(from, orderSummary);
}

/**
 * Handle order confirmation
 */
async function handleConfirmation(from: string, msg: string, session: CustomerSession): Promise<void> {
    if (msg.includes('yes') || msg.includes('confirm') || msg.includes('ok')) {
        // Order confirmed!
        session.stage = 'complete';

        // Send confirmation to customer
        await sendMessage(from, `🎉 *ORDER CONFIRMED!*

Thank you ${session.name}! Your order is being prepared.

📦 *${session.price} GHS Wasawasa*
📍 Delivering to: ${session.location}

Expected delivery: *30-45 minutes*

For any questions, call: 0209856297

Enjoy your meal! 🥣✨`);

        // Notify restaurant owner
        await notifyRestaurant(from, session);

        // Clear session
        sessions.delete(from);

    } else if (msg.includes('no') || msg.includes('cancel')) {
        session.stage = 'greeting';
        session.price = undefined;
        session.location = undefined;

        await sendMessage(from, `❌ Order cancelled. 

Send any message to start a new order! 🥣`);
    } else {
        await sendMessage(from, `Please reply *YES* to confirm or *NO* to cancel your order.`);
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

    await sendMessage(restaurantPhone, notification);
    console.log('📱 Restaurant notified of new order!');
}
