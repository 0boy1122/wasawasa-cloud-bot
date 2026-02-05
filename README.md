# WasaWasa WhatsApp Bot - Meta Cloud API

A production-ready WhatsApp ordering bot using the official Meta WhatsApp Cloud API.

## Features 🥣
- No QR codes or session management needed
- Official Meta API - 100% reliable
- Webhook-based (instant message delivery)
- Simple conversation flow for ordering
- Automatic restaurant notifications
- Ready for client handover

## Folder Structure
```
wasawasa-cloud-bot/
├── src/
│   ├── index.ts      # Server entry point
│   ├── webhook.ts    # Webhook handlers (GET + POST)
│   ├── bot.ts        # Conversation logic
│   └── whatsapp.ts   # WhatsApp API functions
├── .env.example      # Environment template
├── package.json
├── tsconfig.json
└── README.md
```

## Prerequisites
1. Meta Developer Account
2. WhatsApp Business Account
3. Phone number verified on WhatsApp Business

## Setup for Client (Restaurant Owner)

### Step 1: Create Meta Developer Account
1. Go to https://developers.facebook.com
2. Create an account or log in
3. Create a new app → Select "Business" type
4. Add WhatsApp product to your app

### Step 2: Get WhatsApp Credentials
1. In Meta Developer Console, go to WhatsApp → API Setup
2. Copy the **Phone Number ID**
3. Generate a **Permanent Access Token** (System User token, not the temporary one!)

### Step 3: Configure Webhook
1. Deploy this bot to Render/Railway first
2. Get your public URL (e.g., https://wasawasa-bot.onrender.com)
3. In Meta Console → WhatsApp → Configuration:
   - Webhook URL: `https://your-url.com/webhook`
   - Verify Token: `wasawasa_verify_token_2024`
   - Subscribe to: `messages`

### Step 4: Environment Variables
Set these in your hosting platform:
```
WHATSAPP_PHONE_NUMBER_ID=your_phone_number_id
WHATSAPP_ACCESS_TOKEN=your_access_token
WEBHOOK_VERIFY_TOKEN=wasawasa_verify_token_2024
RESTAURANT_PHONE=233209856297
PORT=3000
```

## Local Development
```bash
# Install dependencies
npm install

# Create .env file
cp .env.example .env
# Edit .env with your credentials

# Run in development
npm run dev

# Build for production
npm run build
npm start
```

## Deploy to Render
1. Push to GitHub
2. Create new Web Service on Render
3. Connect your repo
4. Set environment variables
5. Deploy!

## Order Flow
1. Customer sends any message
2. Bot greets and shows menu
3. Customer selects price (5, 10, 15, or 20 GHS)
4. Customer provides delivery location
5. Bot confirms order summary
6. Customer confirms with "YES"
7. Bot sends confirmation + notifies restaurant owner

## Support
For technical support, contact the developer.

---
© WasaWasa 2024 - Built with ❤️
