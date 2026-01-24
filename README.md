# Whatsapp Chatbot Integration

WhatsApp chatbot for Hijau Group Landscape using WhatsApp Cloud API.

## Local Development

1. Install dependencies:
```bash
npm install
```

2. Create `.env` file with your credentials (already created)

3. Run the bot:
```bash
npm start
```

## Deployment to Vercel

1. Install Vercel CLI:
```bash
npm install -g vercel
```

2. Login to Vercel:
```bash
vercel login
```

3. Deploy:
```bash
vercel
```

4. Set environment variables in Vercel dashboard:
   - Go to your project settings
   - Add these environment variables:
     - `PHONE_NUMBER_ID`
     - `VERIFY_TOKEN`
     - `WHATSAPP_TOKEN`

5. After deployment, you'll get a URL like: `https://your-project.vercel.app`

6. Configure webhook in Meta Business Suite:
   - Webhook URL: `https://your-project.vercel.app/webhook`
   - Verify Token: `hijaugrouplandscape@9990`

## Environment Variables

- `PHONE_NUMBER_ID` - WhatsApp Business phone number ID
- `VERIFY_TOKEN` - Token for webhook verification
- `WHATSAPP_TOKEN` - WhatsApp API access token
- `PORT` - Server port (default: 3000)
