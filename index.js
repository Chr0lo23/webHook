const express = require('express');
const bodyParser = require('body-parser');
const TelegramBot = require('node-telegram-bot-api');
const cors = require('cors');

const app = express();

// Folosește variabila de mediu PORT sau 3000 ca valoare implicită
const port = process.env.PORT || 3000;

const TELEGRAM_BOT_TOKEN = '7426569023:AAF0pBokAs9DDHyURknqJUlfTe1JNUo-mEs';
const bot = new TelegramBot(TELEGRAM_BOT_TOKEN, { polling: true }); // Asigură-te că botul este configurat pentru polling

let lastMessage = null;

app.use(cors({
    origin: 'https://phenomenal-malabi-ae373d.netlify.app',
    methods: ['GET', 'POST'],
    allowedHeaders: ['Content-Type', 'Authorization']
}));

app.use(bodyParser.json());

app.post('/', (req, res) => {
    const message = req.body.message;

    console.log('Request body:', req.body);

    lastMessage = message;

    if (message) {
        const chatId = message.chat.id;
        const text = message.text;

        bot.sendMessage(chatId, `Mesajul tău "${text}" a fost primit și procesat.`);
    }

    res.status(200).send('OK');
});

app.get('/', (req, res) => {
    res.json(lastMessage);
});

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

// Ascultă pe portul specificat de variabila de mediu PORT
app.listen(port, () => {
    console.log(`Serverul rulează la portul ${port}`);
});
