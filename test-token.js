const axios = require('axios');

// Test WhatsApp API connection
const testToken = async () => {
    const PHONE_NUMBER_ID = '920832971115648';
    const WHATSAPP_TOKEN = 'EAAV87DRmrOsBQr2QZBhIFxfBn2a2N1G5IZAZC42L3bKihTzDHcYp3I27ZCs5bZCxB4R5snR9ycxYJC0GZBk4DE5fk0nNHxWhhTIhQlcYL9m1gqJVAz4s729Sh6kupEGKkvEQx09wK1KbyC8aC16wwEp6slXJvth6nV5KuCPsAwrkEsifKZAHRxk637qxvbEMQZDZD';

    try {
        const response = await axios.get(
            `https://graph.facebook.com/v21.0/${PHONE_NUMBER_ID}`,
            {
                headers: {
                    'Authorization': `Bearer ${WHATSAPP_TOKEN}`
                }
            }
        );
        console.log('✅ Token is valid!');
        console.log('Phone Number Info:', response.data);
    } catch (error) {
        console.error('❌ Token test failed:');
        if (error.response) {
            console.error('Status:', error.response.status);
            console.error('Error:', error.response.data);
        } else {
            console.error(error.message);
        }
    }
};

testToken();
