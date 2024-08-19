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
    const userId = msg.from.id; // ID-ul utilizatorului

    // Textul mesajului și butonul "Play"
    const text = `Bun venit, ${userName}! Apasă pe butonul de mai jos pentru a începe:`;
    const options = {
        reply_markup: {
            inline_keyboard: [
                [{ text: 'Play', callback_data: 'play' }]
            ]
        }
    };

    bot.sendMessage(chatId, text, options);
});

// Handler pentru butonul "Play"
bot.on('callback_query', (callbackQuery) => {
    const chatId = callbackQuery.message.chat.id;
    const callbackData = callbackQuery.data;
    const userName = callbackQuery.from.first_name; // Numele utilizatorului
    const userId = callbackQuery.from.id; // ID-ul utilizatorului

    if (callbackData === 'play') {
        bot.sendMessage(chatId, ``);
    }
});

// Pornește serverul pe portul specificat de variabila de mediu PORT
app.listen(port, () => {
    console.log(`Serverul rulează la portul ${port}`);
});
