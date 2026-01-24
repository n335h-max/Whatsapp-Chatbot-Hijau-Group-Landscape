# 📊 Custom Dashboard Guide

## 🎯 Access Your Dashboard

Once deployed, access your custom dashboard at:

```
https://whatsapp-chatbot-hijau-group-landscape.onrender.com/dashboard
```

---

## ✨ Features

### 1. **View All Conversations**
- See all customers who messaged your bot
- Real-time updates every 5 seconds
- Latest message preview

### 2. **Chat Interface**
- Click any conversation to view full chat history
- See all messages (customer, bot, and your manual replies)
- Beautiful WhatsApp-like interface

### 3. **Reply Manually**
- Type and send messages directly to customers
- Bot automatically pauses when you reply
- Resume bot when done

### 4. **Bot Control**
- **Pause Bot** button - Stop bot from replying to specific customer
- **Resume Bot** button - Reactivate bot responses
- Control per customer (not global)

### 5. **Auto-Refresh**
- Dashboard updates automatically
- No need to reload page
- See new messages in real-time

---

## 🚀 How to Use

### **Step 1: Deploy**
Push to GitHub and redeploy on Render (as usual)

### **Step 2: Access Dashboard**
Go to: `https://your-render-url.onrender.com/dashboard`

### **Step 3: View Conversations**
- Left panel shows all recent chats
- Click on any customer to view messages

### **Step 4: Reply to Customer**
1. Select conversation
2. Type message in bottom text box
3. Click "Send"
4. Customer receives your message!

### **Step 5: Control Bot**
- Click "⏸️ Pause Bot" when you want to take over
- Chat manually as long as you want
- Click "▶️ Resume Bot" when done

---

## 📱 Screenshots

### Dashboard View:
```
┌─────────────────────────────────────────────┐
│ 🌿 Hijau Group Landscape - Bot Dashboard   │
│                              ● Bot Active   │
├──────────────┬──────────────────────────────┤
│              │                              │
│ Conversations│      Chat Panel              │
│              │                              │
│ 📱 Customer 1│  Customer Name: 60135591865 │
│ 📱 Customer 2│  ⏸️ Pause  ▶️ Resume        │
│ 📱 Customer 3│  ┌──────────────────────┐  │
│              │  │ Customer: Hi!        │  │
│              │  │ Bot: Welcome!        │  │
│              │  │ You: How can I help? │  │
│              │  └──────────────────────┘  │
│              │  [Type message...] [Send]  │
└──────────────┴──────────────────────────────┘
```

---

## 🔐 Security (Optional)

### Add Password Protection:

Edit `src/dashboard/dashboardRoutes.js`:

```javascript
// Add at the top
const DASHBOARD_PASSWORD = 'your-secure-password';

// Add middleware
router.use((req, res, next) => {
    const auth = req.headers.authorization;
    if (auth === `Bearer ${DASHBOARD_PASSWORD}`) {
        next();
    } else {
        res.status(401).send('Unauthorized');
    }
});
```

---

## 🎨 Customization

### Change Colors:

Edit `public/dashboard/index.html`, find the `<style>` section:

```css
/* Main gradient background */
background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);

/* Change to green theme: */
background: linear-gradient(135deg, #48bb78 0%, #38a169 100%);
```

### Change Auto-Refresh Interval:

Find this line in `index.html`:

```javascript
setInterval(loadConversations, 5000); // 5 seconds

// Change to 10 seconds:
setInterval(loadConversations, 10000);
```

---

## ⚡ Performance

- **Lightweight**: Loads instantly
- **No database required**: Uses in-memory context
- **Auto-refresh**: Updates without reload
- **Mobile friendly**: Responsive design

---

## 🆚 Dashboard vs Meta Business Suite

| Feature | Custom Dashboard | Meta Business Suite |
|---------|-----------------|---------------------|
| Access | ✅ Easy (just a URL) | ❌ Complex login |
| Customization | ✅ Full control | ❌ Fixed design |
| Bot Control | ✅ Built-in | ⚠️ Manual commands |
| Speed | ✅ Fast | ⚠️ Slow loading |
| Mobile | ✅ Works great | ⚠️ Requires app |
| Cost | ✅ FREE | ✅ FREE |

---

## 🔧 Troubleshooting

**Q: Dashboard shows "No conversations"**
- Wait for customers to message the bot first
- Conversations appear after first message

**Q: Can't send messages**
- Check Render logs for errors
- Make sure bot is deployed and running

**Q: Messages not updating**
- Check internet connection
- Try manually refreshing page

**Q: Dashboard won't load**
- Make sure you deployed latest code
- Check URL is correct: `/dashboard` at the end

---

## 🚀 Next Steps

### Future Enhancements (Optional):
1. Add database for persistent message history
2. Add analytics (message count, response time)
3. Add customer tags and notes
4. Export conversations to CSV
5. Multiple staff accounts with login

---

**Your custom dashboard is ready! 🎉**

Access it at: `https://your-render-url.onrender.com/dashboard`
