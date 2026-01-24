const axios = require('axios');

console.log('Testing webhook endpoints...\n');

// Test 1: Root endpoint
async function testRoot() {
    try {
        const response = await axios.get('https://whatsapp-chatbot-hijau-group-landscape.onrender.com/');
        console.log('✅ Root endpoint working:', response.data);
    } catch (error) {
        console.error('❌ Root endpoint failed:', error.message);
    }
}

// Test 2: Webhook GET (verification)
async function testWebhookVerification() {
    try {
        const response = await axios.get('https://whatsapp-chatbot-hijau-group-landscape.onrender.com/webhook', {
            params: {
                'hub.mode': 'subscribe',
                'hub.verify_token': 'hijaugrouplandscape@9990',
                'hub.challenge': 'TEST_CHALLENGE_123'
            }
        });
        console.log('✅ Webhook verification working! Response:', response.data);
    } catch (error) {
        console.error('❌ Webhook verification failed:', error.response?.status, error.response?.data);
    }
}

// Test 3: Webhook GET without params (should return 400 Bad Request)
async function testWebhookNoParams() {
    try {
        const response = await axios.get('https://whatsapp-chatbot-hijau-group-landscape.onrender.com/webhook');
        console.log('Response:', response.data);
    } catch (error) {
        if (error.response?.status === 400) {
            console.log('✅ Webhook correctly returns 400 Bad Request when accessed without params (this is normal!)');
        } else {
            console.error('❌ Unexpected error:', error.response?.status);
        }
    }
}

// Test 4: Simulate WhatsApp message
async function testWebhookMessage() {
    try {
        const testPayload = {
            object: 'whatsapp_business_account',
            entry: [{
                changes: [{
                    value: {
                        messages: [{
                            from: '601110629990',
                            id: 'test_message_id',
                            timestamp: Date.now(),
                            type: 'text',
                            text: {
                                body: 'hello'
                            }
                        }]
                    }
                }]
            }]
        };

        const response = await axios.post(
            'https://whatsapp-chatbot-hijau-group-landscape.onrender.com/webhook',
            testPayload
        );
        console.log('✅ Webhook POST working! Status:', response.status);
    } catch (error) {
        console.error('❌ Webhook POST failed:', error.response?.status, error.response?.data);
    }
}

(async () => {
    await testRoot();
    console.log('');
    await testWebhookNoParams();
    console.log('');
    await testWebhookVerification();
    console.log('');
    await testWebhookMessage();
})();
