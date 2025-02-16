// utils/telegramUtils.js
const axios = require('axios');

const BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN;  // From environment variables
const ADMIN_CHAT_ID = process.env.CHAT_ID;  // Admin's chat ID

// Function to send Telegram notification to the admin
const sendTelegramNotification = (message) => {
  return axios.post(`https://api.telegram.org/bot${BOT_TOKEN}/sendMessage`, {
    chat_id: ADMIN_CHAT_ID,
    text: message,
  })
    .then(response => {
      console.log('Telegram notification sent');
    })
    .catch(error => {
      console.error('Error sending Telegram notification', error);
    });
};

module.exports = { sendTelegramNotification };  // Make sure this is exported
