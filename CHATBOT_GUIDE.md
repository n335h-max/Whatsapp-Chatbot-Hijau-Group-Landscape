# 🤖 Hijau Group Landscape WhatsApp Chatbot

## ✨ Features

### 📋 Interactive Menu
- Beautiful clickable buttons and lists
- Organized by categories (Basic Info, Services, Pricing)
- Easy navigation for customers

### 🧠 Smart Understanding
- 100+ keyword variations recognized
- Fuzzy matching (handles typos)
- Bilingual support (Malay + English)

### 📄 Automatic Catalog Sending
When customers ask about:
- **Water Features** → Sends PDF catalog automatically
- **Planter Box & Bench** → Sends PDF catalog automatically
- **Stepping Slabs** → Sends PDF catalog automatically

### 💬 Context Memory
- Remembers conversation history
- Tracks customer interests
- Personalized suggestions

### 🔄 Human Handover
Type: `agent`, `staff`, or `staf` → Routes to human agent  
Type: `bot` or `restart` → Returns to bot mode

---

## 🎯 How Customers Use It

### Getting Started
- **"hi"**, **"hello"**, **"menu"** → Shows interactive menu
- Select topic from menu → Get instant answer + catalog (if applicable)

### Ask Questions Directly
Customers can type naturally:
- "di mana lokasi?" → Location info
- "berapa harga?" → Pricing info  
- "nak tengok rumput" → Grass info
- "show me water feature" → Water feature info + PDF catalog
- "stepping slabs ada?" → Stepping slabs info + PDF catalog

### Get Help
- **"menu"** → Show all topics again
- **"agent"** → Talk to human staff
- **"thanks"** / **"bye"** → End conversation

---

## 🛠️ Technical Details

### Stack
- **Platform**: WhatsApp Cloud API (Meta)
- **Backend**: Node.js + Express
- **Hosting**: Render (free tier)
- **Repository**: GitHub
- **Catalogs**: GitHub CDN (free hosting)

### Phone Number
- **Display**: +60 11-1999 0971
- **Name**: hijaugroup_landscape
- **Status**: LIVE ✅
- **Quality**: GREEN 🟢
- **Tier**: TIER_250

### Environment Variables (Render)
```
PHONE_NUMBER_ID=920832971115648
VERIFY_TOKEN=hijaugrouplandscape@9990
WHATSAPP_TOKEN=[Your permanent token]
PORT=3000
```

---

## 📊 Files Structure

```
src/
├── controllers/
│   └── webhook.js          # Handle incoming WhatsApp messages
├── services/
│   ├── messageHandler.js   # Main bot logic
│   ├── faqs.js            # FAQ database (16 topics)
│   ├── whatsapp.js        # WhatsApp API wrapper
│   ├── keywordMatcher.js  # Fuzzy matching algorithm
│   ├── contextManager.js  # User memory & context
│   └── catalogs.js        # PDF catalog management
public/
└── catalogs/
    ├── water-feature.pdf
    ├── planter-box-bench.pdf
    └── stepping-slabs.pdf
```

---

## 🚀 Deployment

### Deploy to Render
1. Go to: https://dashboard.render.com
2. Find: `whatsapp-chatbot-hijau-group-landscape`
3. Click: **"Manual Deploy"** → **"Deploy latest commit"**
4. Wait ~2 minutes for deployment

### Check Logs
- Render Dashboard → Your Service → **Logs**
- Monitor incoming messages in real-time

---

## 🧪 Testing

### Test Interactive Menu
Send: **"menu"**  
Expected: Clickable list with categorized topics

### Test Smart Matching
- "di mana" → Should understand "location"
- "hrag" (typo) → Should understand "pricing"  
- "nak tengok water feature" → Should send PDF catalog

### Test Catalog Sending
- Ask about "water feature" → PDF sent ✅
- Ask about "planter box" → PDF sent ✅
- Ask about "stepping slabs" → PDF sent ✅

---

## 📝 FAQs

### Q: How to update catalogs?
A: Replace PDFs in `public/catalogs/` folder, commit, and redeploy

### Q: How to add new FAQ topics?
A: Edit `src/services/faqs.js` and add new entry

### Q: How to add new keywords?
A: Edit `src/services/keywordMatcher.js` → `faqKeywordVariations`

### Q: How to monitor bot performance?
A: Check Render logs for incoming messages and errors

### Q: Token expired?
A: Generate new permanent token from Meta Business Settings

---

## 🎊 Status: FULLY OPERATIONAL

✅ Receiving messages  
✅ Sending replies  
✅ Interactive menus working  
✅ PDF catalogs sending  
✅ Context memory active  
✅ Fuzzy matching enabled  

**Your bot is SMART and ready for customers!** 🌿💚
