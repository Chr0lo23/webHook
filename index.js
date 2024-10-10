const TelegramBot = require('node-telegram-bot-api');
const express = require('express');
const path = require('path');
const cors = require('cors');
const ngrok = require('ngrok');

// Token-ul botului tău Telegram
const token = '7092300063:AAGAIjY2vU1AxotoBGGZpk7ihMVWIFNWtfA';

// Creează o instanță a botului
const bot = new TelegramBot(token, { polling: true });

// URL-ul jocului tău
const gameUrl = 'https://t.me/TektoniksS1_bot'; // URL-ul aplicației tale WebGL

// Configurarea serverului Express
const app = express();
const port = process.env.PORT || 3000;

// Middleware pentru CORS
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

    const gameDescription = `
**Tektoniks - Blockchain Dance Game**

Step into the world of *Tektoniks*, a revolutionary blockchain-based game where you dance to earn! Perform *Swipe-to-Earn* dance moves, upgrade your studio, and use 3D Playable Character NFTs to boost your earnings per hour. Complete one-time quests for *Rave Shards* rewards and unlock new songs and dance moves to increase your max energy. 

Recover energy and boost your swipe points with drinks, while mastering *Dance Combos* to gain points faster.

**Extra Gameplay Features:**
- 10 Ranks with Upgradable Swipe Points (dance moves per swipe)
- Epic Combo System with daily rewards
- Code-based Referral System with *Rave Shards* bonuses
- Leaderboard based on dance moves and ranks
- Fun minigames to test your skills
`;

    bot.sendMessage(msg.chat.id, gameDescription, {
        parse_mode: 'Markdown',
        reply_markup: {
            inline_keyboard: [
                [{ text: 'Play Now', url: urlWithParams }],
                [{ text: 'Join Official Telegram', url: 'https://t.me/tektoniks_official' }],
                [{ text: 'Visit Twitter', url: 'https://x.com/home?lang=ro' }],
                [{ text: 'Tektoniks Website', url: 'https://www.tekton.fun' }]
            ],
        },
    });
});

// Pornirea serverului local
app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});
