const express = require('express');
const TelegramBot = require('node-telegram-bot-api');
const cors = require('cors');

const app = express();
const port = process.env.PORT || 3000;

const TELEGRAM_BOT_TOKEN = '7385965012:AAFYRZfcWxxBD7minivi-XE6_VooJeFUirg'; // Înlocuiește cu tokenul tău real
const bot = new TelegramBot(TELEGRAM_BOT_TOKEN, { polling: true });

// Middleware pentru CORS
app.use(cors({
    origin: 'https://beta-tektoniks.vercel.app',
    methods: ['GET', 'POST'],
    allowedHeaders: ['Content-Type', 'Authorization']
}));

// Middleware pentru parse JSON
app.use(express.json());

// Handler pentru comanda /start
bot.onText(/\/start/, (msg) => {
    const chatId = msg.chat.id;
    const userName = msg.from.first_name;

    const text = `Welcome, ${userName}! 

    🎮 Welcome to the Beta version of Tektoniks! 🎮

    We're excited to have you among the first players testing this limited version. During the beta period, a select group of people, including you, will have exclusive access to the game's features.

    🔄 What you need to know about the beta:

    - The game is still in development, so some features are currently unavailable. The features will be added gradually to ensure that each one is thoroughly tested and works correctly. This process helps us identify and resolve any issues before introducing the next set of features.
    - We will be adding new features gradually, every 2-3 days. These include the shop, the earn system, and more.
    - We greatly appreciate your feedback! If you encounter any bugs or have suggestions, please don't hesitate to let us know.

    🚀 What's next:

    Stay tuned for upcoming updates and explore new features as soon as they become available. Thank you for helping us make this game better!`;

    const options = {
        reply_markup: {
            inline_keyboard: [
                [{ text: 'Play Now', url: 'https://t.me/betatekton_bot/TekBeta' }], // Înlocuiește cu URL-ul real
                [{ text: 'Closed Beta Group', url: 'https://t.me/+9fcTpCOrL5AyZDZi' }] // Adaugă al doilea buton cu URL-ul dorit
            ]
        }
    };

    // Trimite mesajul utilizatorului
    bot.sendMessage(chatId, text, options);
});

app.listen(port, () => {
    console.log(`Serverul rulează pe portul ${port}`);
});
