const express = require('express');
const bodyParser = require('body-parser');
const TelegramBot = require('node-telegram-bot-api');
const cors = require('cors');

const app = express();
const port = process.env.PORT || 3000; // Use PORT environment variable or default to 3000

const TELEGRAM_BOT_TOKEN = '7426569023:AAF0pBokAs9DDHyURknqJUlfTe1JNUo-mEs';
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

// Endpoint-ul pentru webhook (acesta este acum rădăcina URL-ului)
app.post('/', (req, res) => {
    bot.processUpdate(req.body); // Procesăm actualizările primite de la Telegram
    res.sendStatus(200); // Trimite un status OK pentru a confirma că cererea a fost primită
});

// Endpoint-ul pentru a vizualiza ultimul mesaj
app.get('/', (req, res) => {
    res.json(lastMessage);
});

let lastMessage = null;

// Handler pentru comanda /start
bot.onText(/\/start/, (msg) => {
    const chatId = msg.chat.id;

    // Textul mesajului și butonul "Play"
    const text = 'Bun venit! Apasă pe butonul de mai jos pentru a începe:';
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

    if (callbackData === 'play') {
        bot.sendMessage(chatId, 'Butonul "Play" a fost apăsat!');
    }
});

// Pornește serverul pe portul specificat de variabila de mediu PORT
app.listen(port, () => {
    console.log(`Serverul rulează la portul ${port}`);
});
