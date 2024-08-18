const express = require('express');
const bodyParser = require('body-parser');
const TelegramBot = require('node-telegram-bot-api');
const cors = require('cors');

const app = express();
const port = process.env.PORT || 3000;

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

// Variabila pentru stocarea ultimei actualizări relevante
let lastRelevantUpdate = null;

// Endpoint-ul pentru webhook (acesta este acum rădăcina URL-ului)
app.post('/', (req, res) => {
    console.log('Received update:', req.body); // Loghează cererea pentru debugging

    // Verifică dacă update-ul este de tip callback_query
    if (req.body.callback_query) {
        // Salvează ultima actualizare relevantă
        lastRelevantUpdate = req.body;
    }
    
    bot.processUpdate(req.body);
    res.sendStatus(200);
});

// Endpoint-ul pentru a vizualiza ultimele actualizări relevante
app.get('/', (req, res) => {
    if (lastRelevantUpdate) {
        res.json(lastRelevantUpdate);
    } else {
        res.json({ message: 'No relevant updates received yet.' });
    }
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
                [{ text: 'Play', url: 't.me/fragar_bot/tek' }] // Înlocuiește cu linkul tău
            ]
        }
    };

    bot.sendMessage(chatId, text, options);
});

// Pornește serverul pe portul specificat de variabila de mediu PORT
app.listen(port, () => {
    console.log(`Serverul rulează la portul ${port}`);
});
