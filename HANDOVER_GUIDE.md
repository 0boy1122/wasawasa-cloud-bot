# WasaWasa Bot - Client Handover Guide

## 🎉 Congratulations! Your WhatsApp Bot is Ready!

This guide will help you set up and maintain your WasaWasa ordering bot.

---

## Part 1: Meta Developer Setup (ONE TIME)

### Step 1: Create Meta Developer Account
1. Go to https://developers.facebook.com
2. Click "Get Started" and log in with your Facebook account
3. Verify your account with phone number

### Step 2: Create an App
1. Click "Create App"
2. Select "Other" → "Business"
3. App name: "WasaWasa Bot"
4. Click "Create App"

### Step 3: Add WhatsApp to Your App
1. On your app dashboard, click "Add Product"
2. Find "WhatsApp" and click "Set Up"
3. Click "Start using the API"

### Step 4: Add Your Phone Number
1. Go to WhatsApp → API Setup
2. Click "Add phone number"
3. Enter your business phone: 0209856297
4. Verify with SMS code
5. Note down the **Phone Number ID** (you'll need this!)

### Step 5: Get Permanent Access Token
1. Go to Business Settings → System Users
2. Create a new System User
3. Assign WhatsApp permission
4. Generate a token (this is your **Access Token**)

---

## Part 2: Deploy the Bot

### Option A: Deploy to Render (Recommended)
1. Go to https://render.com
2. Sign up with GitHub
3. Create "New Web Service"
4. Connect the wasawasa-cloud-bot repository
5. Set these environment variables:
   - `WHATSAPP_PHONE_NUMBER_ID` = (from Step 4)
   - `WHATSAPP_ACCESS_TOKEN` = (from Step 5)
   - `WEBHOOK_VERIFY_TOKEN` = wasawasa_verify_token_2024
   - `RESTAURANT_PHONE` = 233209856297
   - `PORT` = 3000
6. Click Deploy!

### Option B: Deploy to Railway
Same steps, just use https://railway.app instead.

---

## Part 3: Connect Webhook

After deploying, you'll get a URL like:
`https://wasawasa-bot.onrender.com`

### Configure in Meta Console:
1. Go to WhatsApp → Configuration
2. Edit Webhook settings:
   - Callback URL: `https://wasawasa-bot.onrender.com/webhook`
   - Verify Token: `wasawasa_verify_token_2024`
3. Click "Verify and Save"
4. Subscribe to: **messages**

---

## Part 4: Test Your Bot

1. Send a WhatsApp message to your business number
2. The bot should reply with the menu!
3. Complete a test order

---

## Troubleshooting

### Bot not responding?
- Check if the webhook is verified in Meta Console
- Check Render/Railway logs for errors
- Make sure environment variables are set correctly

### "Message failed to send"?
- Check your Access Token hasn't expired
- Verify Phone Number ID is correct

---

## Daily Operations

The bot runs 24/7 automatically. When a customer orders:
1. They message your WhatsApp number
2. Bot guides them through ordering
3. You receive a notification on your phone
4. Prepare and deliver the order!

---

## Costs

- Meta WhatsApp Cloud API: First 1,000 conversations/month FREE
- Render hosting: FREE tier available
- Total monthly cost: $0 (for small volume)

---

## Support

For technical issues, contact your developer.

---

© WasaWasa 2024
