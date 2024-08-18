const express = require('express');
const bodyParser = require('body-parser');
const TelegramBot = require('node-telegram-bot-api');
const cors = require('cors');
const axios = require('axios'); // Axios pentru a trimite date către webhook

const app = express();
const port = 3000;

const TELEGRAM_BOT_TOKEN = '7426569023:AAF0pBokAs9DDHyURknqJUlfTe1JNUo-mEs';
const bot = new TelegramBot(TELEGRAM_BOT_TOKEN, { polling: true }); // Asigură-te că botul este configurat pentru polling

// Variabila pentru a stoca datele utilizatorului
let userData = {};

// Configurează CORS
app.use(cors({
    origin: 'https://phenomenal-malabi-ae373d.netlify.app',
    methods: ['GET', 'POST'],
    allowedHeaders: ['Content-Type', 'Authorization']
}));

app.use(bodyParser.json());

// Endpoint pentru a primi datele de la botul Telegram
app.post('/', (req, res) => {
    const message = req.body.message;

    console.log('Request body:', req.body);

    if (message) {
        const chatId = message.chat.id;
        const text = message.text;

        // Stochează datele utilizatorului dacă nu sunt deja stocate
        if (!userData[chatId]) {
            userData[chatId] = {
                id: chatId,
                username: message.from.username,
                firstName: message.from.first_name,
                lastName: message.from.last_name
            };
        }

        bot.sendMessage(chatId, `Mesajul tău "${text}" a fost primit și procesat.`);
    }

    res.status(200).send('OK');
});

app.get('/', (req, res) => {
    res.json(userData);
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

    // Stochează datele utilizatorului la început
    userData[chatId] = {
        id: chatId,
        username: msg.from.username,
        firstName: msg.from.first_name,
        lastName: msg.from.last_name
    };

    bot.sendMessage(chatId, text, options);
});

// Handler pentru butonul "Play"
bot.on('callback_query', async (callbackQuery) => {
    const chatId = callbackQuery.message.chat.id;
    const callbackData = callbackQuery.data;

    if (callbackData === 'play') {
        // Trimite datele utilizatorului către webhook-ul tău
        if (userData[chatId]) {
            try {
                await axios.post('https://webhook-52qy.onrender.com', userData[chatId]);
                bot.sendMessage(chatId, 'Datele tale au fost trimise către server!');
            } catch (error) {
                console.error('Eroare la trimiterea datelor:', error);
                bot.sendMessage(chatId, 'A apărut o eroare la trimiterea datelor.');
            }
        } else {
            bot.sendMessage(chatId, 'Datele tale nu sunt disponibile.');
        }
    }
});

app.listen(port, () => {
    console.log(`Serverul local rulează la http://localhost:${port}`);
});
