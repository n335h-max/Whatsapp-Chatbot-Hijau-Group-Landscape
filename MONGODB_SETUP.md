# MongoDB Atlas Setup Guide (FREE)

## Step 1: Create MongoDB Atlas Account

1. Go to: https://www.mongodb.com/cloud/atlas/register
2. Sign up with Google, GitHub, or Email (FREE)
3. Choose **FREE tier** (M0 Sandbox - 512MB storage)

## Step 2: Create a Cluster

1. After login, click **"Build a Database"**
2. Choose **FREE** tier (M0)
3. Select **Cloud Provider**: AWS
4. Select **Region**: Singapore (ap-southeast-1) - closest to Malaysia
5. Cluster Name: `whatsapp-bot-cluster`
6. Click **"Create"**

## Step 3: Create Database User

1. **Security Quickstart** will appear
2. Under "Create a database user":
   - Username: `whatsapp_bot_user`
   - Password: Click **"Autogenerate Secure Password"** and **COPY IT**
   - Or create your own strong password
3. Click **"Create User"**

## Step 4: Add Your IP Address

1. Under "Where would you like to connect from?":
2. Click **"Add My Current IP Address"**
3. Also add: `0.0.0.0/0` (allows from anywhere - for Render hosting)
   - Description: "Allow from anywhere (Render)"
4. Click **"Finish and Close"**

## Step 5: Get Connection String

1. Click **"Connect"** button on your cluster
2. Choose **"Connect your application"**
3. Driver: **Node.js**
4. Version: **6.0 or later**
5. Copy the connection string:
   ```
   mongodb+srv://whatsapp_bot_user:<password>@whatsapp-bot-cluster.xxxxx.mongodb.net/?retryWrites=true&w=majority
   ```
6. Replace `<password>` with your actual password from Step 3

## Step 6: Add to Render Environment Variables

1. Go to your Render dashboard: https://dashboard.render.com
2. Click on your WhatsApp bot service
3. Go to **"Environment"** tab
4. Click **"Add Environment Variable"**
5. Add:
   - **Key**: `MONGODB_URI`
   - **Value**: `mongodb+srv://whatsapp_bot_user:YOUR_PASSWORD@whatsapp-bot-cluster.xxxxx.mongodb.net/whatsapp_bot?retryWrites=true&w=majority`
   
   (Replace `YOUR_PASSWORD` and the cluster URL with your actual values)

6. Click **"Save Changes"**
7. Render will automatically redeploy with the new env variable

## Step 7: Verify Connection

After deployment, check Render logs:
- Look for: `✅ Connected to MongoDB successfully`
- If you see this, database is working!
- If not found, bot will still work (in-memory only)

## What Gets Stored in Database

✅ **Customer conversations** (messages, history)  
✅ **Customer names** (extracted from WhatsApp)  
✅ **Interests** (topics they asked about)  
✅ **Last interaction time**  
✅ **Location** (if provided)

## Storage Limits (FREE Tier)

- **512 MB** storage
- **100 max connections**
- **Shared RAM** and **Shared vCPUs**
- Perfect for small-medium chatbot usage!

## Data Retention

- Conversations kept for **7 days**
- Auto-cleanup runs daily
- Old conversations deleted automatically

## Benefits

✅ Conversations survive server restarts  
✅ Conversations survive deployments  
✅ Customers can return after days and bot remembers them  
✅ Dashboard shows all historical conversations  
✅ Free forever (up to 512MB)  

## Security Notes

⚠️ Never commit MongoDB URI to GitHub  
⚠️ Only store in Render environment variables  
⚠️ Use strong password for database user  
⚠️ Keep your credentials safe  

---

## Quick Summary

1. Sign up: https://www.mongodb.com/cloud/atlas/register
2. Create FREE cluster (M0)
3. Create database user + password
4. Add IP: 0.0.0.0/0
5. Copy connection string
6. Add to Render env: `MONGODB_URI=mongodb+srv://...`
7. Deploy and verify!

That's it! Your bot now has permanent storage! 🎉
