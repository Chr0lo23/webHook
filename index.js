const express = require('express');
const TelegramBot = require('node-telegram-bot-api');
const cors = require('cors');
const axios = require('axios'); // Import axios for HTTP requests

const app = express();
const port = process.env.PORT || 3000;

const TELEGRAM_BOT_TOKEN = '7385965012:AAFYRZfcWxxBD7minivi-XE6_VooJeFUirg'; // Replace with your actual token
const bot = new TelegramBot(TELEGRAM_BOT_TOKEN, { polling: true });

// Middleware for CORS
app.use(cors({
    origin: 'https://beta-tektoniks.vercel.app',
    methods: ['GET', 'POST'],
    allowedHeaders: ['Content-Type', 'Authorization']
}));

// Handler for /start command
bot.onText(/\/start/, (msg) => {
    const chatId = msg.chat.id;
    const userName = msg.from.first_name;

    const text = `Welcome, ${userName}! 

    🎮 *Welcome to the Beta version of Tektoniks!* 🎮
    
    We're excited to have you among the first players testing this limited version. During the beta period, a select group of people, including you, will have exclusive access to the game's features.

    🔄 *What you need to know about the beta:*
    
    - The game is still in development, so some features are currently unavailable. The features will be added gradually to ensure that each one is thoroughly tested and works correctly. This process helps us identify and resolve any issues before introducing the next set of features.
    - We will be adding new features gradually, every 2-3 days. These include the shop, the earn system, and more.
    - We greatly appreciate your feedback! If you encounter any bugs or have suggestions, please don't hesitate to let us know.

    🚀 *What's next:*
    
    Stay tuned for upcoming updates and explore new features as soon as they become available. Thank you for helping us make this game better!`;

    const options = {
        reply_markup: {
            inline_keyboard: [
                [{ text: 'Play Now', url: 't.me/betatekton_bot/betatek' }], // Replace with actual URL
                [{ text: 'Closed Beta Group', url: 'https://t.me/+9fcTpCOrL5AyZDZi' }] // Add second button with the desired URL
            ]
        }
    };

    // Send message to the user
    bot.sendMessage(chatId, text, options);

    // Prepare user data to send to the webhook
    const userData = {
        chatId: chatId,
        userName: userName,
        firstName: msg.from.first_name,
        lastName: msg.from.last_name,
        username: msg.from.username,
        languageCode: msg.from.language_code,
    };

    // Send the user data to the webhook
    axios.post('https://webhook-52qy.onrender.com/', userData)
        .then(response => {
            console.log('User data sent successfully:', response.data);
        })
        .catch(error => {
            console.error('Error sending user data:', error);
        });
});

app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});
