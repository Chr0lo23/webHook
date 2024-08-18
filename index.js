const express = require('express');
const bodyParser = require('body-parser');
const TelegramBot = require('node-telegram-bot-api');
const cors = require('cors');
const axios = require('axios'); // Importă axios pentru cereri HTTP

const app = express();
const port = 3000;

const TELEGRAM_BOT_TOKEN = '7304509532:AAFy0f-lQR2f33gnt1fcDkuAoqwMb_-XXsg';
const bot = new TelegramBot(TELEGRAM_BOT_TOKEN, { polling: true });

// URL-ul webhook-ului unde vei trimite datele
const WEBHOOK_URL = 'https://webhook-52qy.onrender.com';

app.use(cors({
    origin: 'https://phenomenal-malabi-ae373d.netlify.app',
    methods: ['GET', 'POST'],
    allowedHeaders: ['Content-Type', 'Authorization']
}));

app.use(bodyParser.json());

// Handler pentru comanda /start
bot.onText(/\/start/, (msg) => {
    const chatId = msg.chat.id;

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
bot.on('callback_query', async (callbackQuery) => {
    const chatId = callbackQuery.message.chat.id;
    const callbackData = callbackQuery.data;
    const user = callbackQuery.from; // Obține informațiile despre utilizator

    if (callbackData === 'play') {
        // Trimite un mesaj pentru a confirma apăsarea butonului
        bot.sendMessage(chatId, 'Butonul "Play" a fost apăsat!');

        // Datele pe care dorești să le trimiți către webhook
        const data = {
            userId: user.id, // ID-ul utilizatorului
            userName: user.first_name, // Numele utilizatorului
            userLastName: user.last_name || 'N/A', // Prenumele utilizatorului, dacă este disponibil
            action: 'play',
            timestamp: new Date().toISOString()
        };

        try {
            // Trimite datele către webhook
            await axios.post(WEBHOOK_URL, data);
            console.log('Datele au fost trimise către webhook.');
        } catch (error) {
            console.error('Eroare la trimiterea datelor către webhook:', error);
        }
    }
});

app.listen(port, () => {
    console.log(`Serverul local rulează la http://localhost:${port}`);
});
