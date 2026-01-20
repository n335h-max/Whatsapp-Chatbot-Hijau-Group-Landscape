require('dotenv').config();

module.exports = {
  port: process.env.PORT || 3000,
  verifyToken: process.env.VERIFY_TOKEN,
  whatsappToken: process.env.WHATSAPP_TOKEN,
  phoneNumberId: process.env.PHONE_NUMBER_ID,
};
