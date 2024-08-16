const express = require('express');
const bodyParser = require('body-parser');
const TelegramBot = require('node-telegram-bot-api');
const cors = require('cors'); // Importă pachetul cors

const app = express();
const port = 3000;

const TELEGRAM_BOT_TOKEN = 'TOKENUL_TĂU_TELEGRAM';
const bot = new TelegramBot(TELEGRAM_BOT_TOKEN);

// Variabilă pentru stocarea ultimului mesaj
let lastMessage = null;

// Configurăm CORS pentru a permite cererile de pe originile dorite
app.use(cors({
    origin: 'https://tekrepos.vercel.app/', // Permite cererile doar de pe acest domeniu
    methods: ['GET', 'POST'], // Permite doar metodele GET și POST
    allowedHeaders: ['Content-Type', 'Authorization'] // Permite aceste anteturi
}));

// Configurăm body-parser pentru a analiza cererile POST
app.use(bodyParser.json());

// Ruta pentru a primi cereri POST la rădăcină
app.post('/', (req, res) => {
    const message = req.body.message;

    console.log('Request body:', req.body); // Log pentru debugging

    lastMessage = message; // Salvăm mesajul primit în variabilă

    if (message) {
        const chatId = message.chat.id;
        const text = message.text;

        // Răspundem utilizatorului prin bot
        bot.sendMessage(chatId, `Mesajul tău "${text}" a fost primit și procesat.`);
    }

    res.status(200).send('OK');
});

// Ruta GET pentru a returna ultimul mesaj
app.get('/', (req, res) => {
    res.json(lastMessage); // Returnează mesajul stocat
});

// Pornim serverul local
app.listen(port, () => {
    console.log(`Serverul local rulează la http://localhost:${port}`);
});