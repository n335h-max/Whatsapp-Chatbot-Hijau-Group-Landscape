# 📱 Meta Business Suite Inbox Guide

## 🎯 How to Reply to Customers Manually

### **Access the Inbox**

1. **Go to:** https://business.facebook.com/latest/inbox/all

2. **Login** with your Facebook account

3. **Select:** Your WhatsApp number from the dropdown
   - Look for: +60 11-1999 0971 or "hijaugroup_landscape"

4. **You'll see all customer conversations!**

---

## 💬 **How It Works with the Bot**

### **Normal Flow (Bot Active):**
```
Customer: "hi"
🤖 Bot: [Sends menu automatically] ✅

Customer: "what is your location?"
🤖 Bot: [Sends location info automatically] ✅
```

### **When You Want to Reply Manually:**

**Step 1: Pause the Bot for That Customer**

In Meta Business Suite, **send to the bot number** (+60 11-1999 0971):

```
pause 60135591865
```
(Replace with the actual customer's number)

**You'll get confirmation:**
```
✅ Bot paused for 60135591865

The bot will not reply to this customer until 
you type: resume 60135591865
```

**Step 2: Chat with Customer**

Now you can reply manually! The bot won't interfere.

```
👤 You: "Hi! I'm Sarah from Hijau Group. I can help you 
        with a custom landscape design. Can you share 
        some photos of your garden?"

Customer: "Sure! [sends photos]"

👤 You: "Beautiful space! I'll prepare a quotation and 
        3D design for you. What's your budget range?"
```

**Step 3: Resume Bot When Done**

When conversation ends, reactivate the bot:

```
resume 60135591865
```

**Confirmation:**
```
✅ Bot resumed for 60135591865

Automatic replies are now active again.
```

---

## 🛠️ **Staff Commands**

### **Pause Bot for Customer:**
```
pause [customer_number]

Example:
pause 60135591865
```

### **Resume Bot:**
```
resume [customer_number]

Example:
resume 60135591865
```

### **Check Who is Paused:**
```
paused list
```

**Response:**
```
⏸️ Paused customers (2):

60135591865
60123456789

Type "resume [number]" to enable bot.
```

---

## 👥 **Add Your Staff Numbers**

To use staff commands, add your WhatsApp numbers in the code:

**File:** `src/services/messageHandler.js`

```javascript
const staffNumbers = [
    '60111062999',    // Replace with your staff number
    '601234567890'    // Add more staff numbers here
];
```

**Format:** Remove all spaces, dashes, and + sign. Just numbers!

**Examples:**
- ❌ `+60 11-1062 9990`
- ❌ `011-1062 9990`
- ✅ `60111062999`

---

## 📊 **Typical Workflow**

### **Scenario 1: Simple Question**
```
Customer: "What are your operating hours?"
🤖 Bot: [Answers automatically] ✅
```
**No manual intervention needed!**

### **Scenario 2: Complex Request**
```
Customer: "I need landscape for 5000 sqft, pool + gazebo"
🤖 Bot: [Might give generic answer]

👤 Staff sees this in inbox...
👤 Staff: pause 60135591865
👤 Staff: "Hi! This is a beautiful project. Let me connect 
          you with our senior designer. Can you share 
          your site photos and preferred style?"
```

### **Scenario 3: After Manual Chat**
```
👤 Staff: "Thank you! We'll send the quotation by tomorrow."
Customer: "Thanks!"
👤 Staff: resume 60135591865

[Later...]
Customer: "What is your location?"
🤖 Bot: [Answers automatically again] ✅
```

---

## ⚠️ **Important Notes**

1. **Bot number (+60 11-1999 0971):**
   - Cannot use on regular WhatsApp app
   - Can only reply via Meta Business Suite or API
   - Bot continues working automatically

2. **Sales number (011-1062 9990):**
   - Regular WhatsApp on phone
   - For when customers type "agent"
   - Completely separate from bot

3. **Multiple team members can access Meta Business Suite inbox**
   - Share login credentials
   - Or add them as users in Meta Business Settings

---

## 🎯 **Best Practices**

✅ **Let bot handle:**
- FAQs (location, services, pricing)
- Catalog requests
- Operating hours
- Portfolio links

👤 **Human replies for:**
- Custom quotations
- Complex projects
- Complaints or issues
- Design consultations
- Negotiation

---

## 🔗 **Quick Links**

- **Meta Business Suite Inbox:** https://business.facebook.com/latest/inbox/all
- **Meta Business Settings:** https://business.facebook.com/settings
- **WhatsApp Manager:** https://business.facebook.com/wa/manage/home/

---

## ❓ **Troubleshooting**

**Q: I can't see the inbox**
- Make sure you're logged in with the correct Facebook account
- Check you have admin access to the WhatsApp Business Account

**Q: Staff commands not working**
- Make sure your number is added to `staffNumbers` array
- Use correct format: `60111062999` (no spaces/dashes)
- Message the bot number, not customer number

**Q: Bot still replying after pause**
- Wait a few seconds for Render to process
- Make sure you typed the customer number correctly
- Check with `paused list` command

**Q: How to add more staff?**
- Edit `src/services/messageHandler.js`
- Add numbers to `staffNumbers` array
- Commit, push, redeploy on Render

---

**✨ Best of both worlds: Automation + Human Touch!** 🤖💚👤
