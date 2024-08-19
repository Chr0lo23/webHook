const express = require('express');
const bodyParser = require('body-parser');
const TelegramBot = require('node-telegram-bot-api');
const cors = require('cors');

const app = express();
const port = process.env.PORT || 3000;

const TELEGRAM_BOT_TOKEN = '7385965012:AAFYRZfcWxxBD7minivi-XE6_VooJeFUirg';
const bot = new TelegramBot(TELEGRAM_BOT_TOKEN);

// URL-ul webhook-ului tău (fără path)
const TELEGRAM_WEBHOOK_URL = 'https://webhook-52qy.onrender.com';

// Setează webhook-ul
bot.setWebHook(TELEGRAM_WEBHOOK_URL);

// Middleware pentru CORS
app.use(cors({
    origin: 'https://phenomenal-malabi-ae373d.netlify.app',
    methods: ['GET', 'POST'],
    allowedHeaders: ['Content-Type', 'Authorization']
}));

// Middleware pentru parserul JSON
app.use(bodyParser.json());

// Variabila pentru stocarea ultimei actualizări
let lastUpdate = null;

// Endpoint-ul pentru webhook (acesta este acum rădăcina URL-ului)
app.post('/', (req, res) => {
    console.log('Received update:', req.body); // Loghează cererea pentru debugging
    lastUpdate = req.body; // Salvează ultima actualizare primită
    bot.processUpdate(req.body);
    res.sendStatus(200);
});

// Endpoint-ul pentru a vizualiza ultimele actualizări
app.get('/', (req, res) => {
    if (lastUpdate) {
        res.json(lastUpdate);
    } else {
        res.json({ message: 'No updates received yet.' });
    }
});

// Handler pentru comanda /start
bot.onText(/\/start/, (msg) => {
    const chatId = msg.chat.id;
    const userName = msg.from.first_name; // Numele utilizatorului

    // Textul mesajului și butonul "Play"
    const text = `Welcome, ${userName}! 🎮 *Welcome to the Beta version of Tektoniks!* 🎮

We're excited to have you among the first players testing this limited version. 
During the beta period, a select group of people, including you, will have exclusive access to the game's features.

🔄 *What you need to know about the beta:*

- The game is still in development, so some features are currently unavailable.
*The features will be added gradually to ensure that each one is thoroughly tested and works correctly. This process 
helps us identify and resolve any issues before introducing the next set of features.
- We will be adding new features gradually, every 2-3 days. These include the shop, the earn system, and more.
- We greatly appreciate your feedback! If you encounter any bugs or have suggestions, please don't hesitate to let us know.

🚀 *What's next:*

Stay tuned for upcoming updates and explore new features as soon as they become available. Thank you for helping us make this game better!`;
    const options = {
        reply_markup: {
            inline_keyboard: [
                [{ text: 'Play', url: 't.me/fragar_bot/tek' }] // Înlocuiește cu URL-ul real
            ]
        }
    };

    bot.sendMessage(chatId, text, options);
});

// Pornește serverul pe portul specificat de variabila de mediu PORT
app.listen(port, () => {
    console.log(`Serverul rulează la portul ${port}`);
});
