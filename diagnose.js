const axios = require('axios');

// Check Meta webhook configuration
async function checkWebhookConfig() {
    const PHONE_NUMBER_ID = '920832971115648';
    const WHATSAPP_TOKEN = 'EAAV87DRmrOsBQr2QZBhIFxfBn2a2N1G5IZAZC42L3bKihTzDHcYp3I27ZCs5bZCxB4R5snR9ycxYJC0GZBk4DE5fk0nNHxWhhTIhQlcYL9m1gqJVAz4s729Sh6kupEGKkvEQx09wK1KbyC8aC16wwEp6slXJvth6nV5KuCPsAwrkEsifKZAHRxk637qxvbEMQZDZD';

    console.log('Checking WhatsApp Business Account Configuration...\n');

    try {
        const response = await axios.get(
            `https://graph.facebook.com/v21.0/${PHONE_NUMBER_ID}`,
            {
                headers: {
                    'Authorization': `Bearer ${WHATSAPP_TOKEN}`
                },
                params: {
                    fields: 'id,verified_name,code_verification_status,display_phone_number,quality_rating,messaging_limit_tier,webhook_configuration'
                }
            }
        );

        console.log('📱 Phone Number Info:');
        console.log('  ID:', response.data.id);
        console.log('  Name:', response.data.verified_name);
        console.log('  Display Number:', response.data.display_phone_number);
        console.log('  Verification:', response.data.code_verification_status);
        console.log('  Quality Rating:', response.data.quality_rating);
        console.log('  Messaging Limit:', response.data.messaging_limit_tier);
        console.log('\n🔗 Webhook Configuration:');
        console.log('  Current URL:', response.data.webhook_configuration?.application || 'Not configured');
        
        // Expected URL
        const expectedUrl = 'https://whatsapp-chatbot-hijau-group-landscape.onrender.com/webhook';
        const currentUrl = response.data.webhook_configuration?.application;
        
        if (currentUrl === expectedUrl) {
            console.log('  ✅ Webhook URL is correct!');
        } else {
            console.log('  ❌ Webhook URL mismatch!');
            console.log('  Expected:', expectedUrl);
            console.log('  Current:', currentUrl);
        }

    } catch (error) {
        console.error('❌ Error checking configuration:');
        if (error.response) {
            console.error('Status:', error.response.status);
            console.error('Error:', error.response.data);
        } else {
            console.error(error.message);
        }
    }
}

// Check webhook subscriptions
async function checkWebhookSubscriptions() {
    const WHATSAPP_TOKEN = 'EAAV87DRmrOsBQr2QZBhIFxfBn2a2N1G5IZAZC42L3bKihTzDHcYp3I27ZCs5bZCxB4R5snR9ycxYJC0GZBk4DE5fk0nNHxWhhTIhQlcYL9m1gqJVAz4s729Sh6kupEGKkvEQx09wK1KbyC8aC16wwEp6slXJvth6nV5KuCPsAwrkEsifKZAHRxk637qxvbEMQZDZD';
    
    console.log('\n\n📋 Checking Webhook Subscriptions...\n');

    try {
        // Get the app ID from the token or use your app ID
        // You'll need to find your app ID from Meta Developer Console
        console.log('⚠️  To check webhook subscriptions, you need to:');
        console.log('1. Go to https://developers.facebook.com/apps');
        console.log('2. Select your WhatsApp app');
        console.log('3. Go to WhatsApp > Configuration');
        console.log('4. Under "Webhook" section, verify:');
        console.log('   - Callback URL: https://whatsapp-chatbot-hijau-group-landscape.onrender.com/webhook');
        console.log('   - Verify Token: hijaugrouplandscape@9990');
        console.log('   - Subscribed fields: ✅ messages (must be checked!)');

    } catch (error) {
        console.error('Error:', error.message);
    }
}

// Test sending a message
async function testSendMessage() {
    const PHONE_NUMBER_ID = '920832971115648';
    const WHATSAPP_TOKEN = 'EAAV87DRmrOsBQr2QZBhIFxfBn2a2N1G5IZAZC42L3bKihTzDHcYp3I27ZCs5bZCxB4R5snR9ycxYJC0GZBk4DE5fk0nNHxWhhTIhQlcYL9m1gqJVAz4s729Sh6kupEGKkvEQx09wK1KbyC8aC16wwEp6slXJvth6nV5KuCPsAwrkEsifKZAHRxk637qxvbEMQZDZD';

    console.log('\n\n🧪 Testing Send Message (to verify bot can send)...\n');

    const testRecipient = '601110629990'; // Use your own number for testing

    try {
        const response = await axios.post(
            `https://graph.facebook.com/v21.0/${PHONE_NUMBER_ID}/messages`,
            {
                messaging_product: 'whatsapp',
                to: testRecipient,
                type: 'text',
                text: {
                    body: '🤖 Test message from bot - If you receive this, the bot CAN send messages!'
                }
            },
            {
                headers: {
                    'Authorization': `Bearer ${WHATSAPP_TOKEN}`,
                    'Content-Type': 'application/json'
                }
            }
        );

        console.log('✅ Message sent successfully!');
        console.log('Message ID:', response.data.messages[0].id);
        console.log('\n👉 Check your WhatsApp (+60 11-1062 9990) for the test message!');

    } catch (error) {
        console.error('❌ Failed to send message:');
        if (error.response) {
            console.error('Status:', error.response.status);
            console.error('Error:', JSON.stringify(error.response.data, null, 2));
        } else {
            console.error(error.message);
        }
    }
}

(async () => {
    await checkWebhookConfig();
    await checkWebhookSubscriptions();
    await testSendMessage();
})();
