const TelegramBot = require('node-telegram-bot-api');
const express = require('express');
const path = require('path');
const cors = require('cors');
const ngrok = require('ngrok');

// Token-ul botului tău Telegram
const token = '7012860316:AAGIZrpqPLJ4j66bPUJGoXksHcEclGxMo-g';

// Creează o instanță a botului
const bot = new TelegramBot(token, { polling: true });

// URL-ul jocului tău
const gameUrl = 'https://t.me/letsDanceTek_bot/letsDance'; // URL-ul aplicației tale WebGL

// Configurarea serverului Express
const app = express();
const port = process.env.PORT || 3000;

// Middleware pentru CORSnon
app.use(cors());

// Endpoint pentru webhook (dacă folosești webhook-uri)
app.use(express.json());
app.post('/webhook', (req, res) => {
    bot.processUpdate(req.body);
    res.sendStatus(200);
});

// Handler pentru comenzile botului
bot.onText(/\/start|\/play/, (msg) => {
    const userId = msg.from.id;
    const userName = msg.from.username || msg.from.first_name;
    const encodedName = encodeURIComponent(userName);
    const urlWithParams = `${gameUrl}?id=${userId}&name=${encodedName}`;

    bot.sendMessage(msg.chat.id, 'Click the button to play the game:', {
        reply_markup: {
            inline_keyboard: [
                [{ text: 'Play Game', url: urlWithParams }],
            ],
        },
    });
});

// Pornirea serverului local
app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});

// Configurarea tunelului ngrok pentru expunerea serverului
(async function() {
    const url = await ngrok.connect(port);
    console.log(`ngrok tunnel established at ${url}`);
})();
