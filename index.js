const express = require('express');
const bodyParser = require('body-parser');
const TelegramBot = require('node-telegram-bot-api');
const cors = require('cors');
const axios = require('axios');

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

// Endpoint-ul pentru webhook
app.post('/', (req, res) => {
    console.log('Received update:', req.body); // Loghează cererea pentru debugging

    // Procesați update-ul în mod obișnuit
    bot.processUpdate(req.body);

    // Verifică dacă update-ul este de tip callback_query
    if (req.body.callback_query) {
        // Trimite datele către același URL
        axios.post(TELEGRAM_WEBHOOK_URL, {
            userId: req.body.callback_query.from.id,
            userName: req.body.callback_query.from.first_name,
            action: 'play_button_pressed'
        })
        .then(response => {
            console.log('Data sent to webhook:', response.data);
        })
        .catch(error => {
            console.error('Error sending data to webhook:', error);
        });
    }

    res.sendStatus(200);
});

// Endpoint-ul pentru a vizualiza ultimele actualizări relevante
app.get('/', (req, res) => {
    res.json({ message: 'Webhook is working. Use /external to view data sent to the external webhook.' });
});

// Handler pentru comanda /start
bot.onText(/\/start/, (msg) => {
    const chatId = msg.chat.id;
    const userName = msg.from.first_name; // Numele utilizatorului

    // Textul mesajului și butonul "Play" care deschide direct un link
    const text = `Bun venit, ${userName}! Apasă pe butonul de mai jos pentru a începe:`;
    const options = {
        reply_markup: {
            inline_keyboard: [
                [{ text: 'Play', callback_data: 'play_button_pressed' }] // Folosește callback_data pentru a identifica butonul
            ]
        }
    };

    bot.sendMessage(chatId, text, options);
});

// Handler pentru butonul "Play"
bot.on('callback_query', (callbackQuery) => {
    const chatId = callbackQuery.message.chat.id;
    const userName = callbackQuery.from.first_name;
    const userId = callbackQuery.from.id;

    if (callbackQuery.data === 'play_button_pressed') {
        // Trimite datele la același URL
        axios.post(TELEGRAM_WEBHOOK_URL, {
            userId: userId,
            userName: userName,
            action: 'play_button_pressed'
        })
        .then(response => {
            console.log('Data sent to webhook:', response.data);
        })
        .catch(error => {
            console.error('Error sending data to webhook:', error);
        });

        // Răspunde la callback și deschide un link
        bot.answerCallbackQuery(callbackQuery.id, {
            url: 't.me/fragar_bot/tek'
        });
    }
});

// Pornește serverul pe portul specificat de variabila de mediu PORT
app.listen(port, () => {
    console.log(`Serverul rulează la portul ${port}`);
});
