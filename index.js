require('dotenv').config();
const express = require('express');
const nodemailer = require('nodemailer');

const app = express();
app.use(express.json());

// --- Middleware API Key ---
const requireApiKey = (req, res, next) => {
    const apiKey = req.headers['x-api-key'];
    if (!process.env.API_KEY) {
        return res.status(500).json({ error: 'API_KEY non configurée côté serveur.' });
    }
    if (!apiKey || apiKey !== process.env.API_KEY) {
        return res.status(401).json({ error: 'Clé API invalide ou manquante.' });
    }
    next();
};

// --- Transporter Nodemailer ---
const transporter = nodemailer.createTransport({
    host: process.env.MAIL_HOST,
    port: parseInt(process.env.MAIL_PORT, 10),
    secure: process.env.MAIL_SECURE === 'true',
    auth: {
        user: process.env.MAIL_USER,
        pass: process.env.MAIL_PASS,
    },
});

// --- Route POST /send-mail ---
app.post('/send-mail', requireApiKey, async (req, res) => {
    const { to, subject, text, html } = req.body;

    if (!to || !subject || (!text && !html)) {
        return res.status(400).json({ error: 'Champs manquants : to, subject, text/html requis.' });
    }

    try {
        const info = await transporter.sendMail({
            from: `"${process.env.MAIL_FROM_NAME}" <${process.env.MAIL_FROM_ADDRESS}>`,
            to,
            subject,
            text,
            html,
        });

        return res.status(200).json({ message: 'Mail envoyé.', messageId: info.messageId });
    } catch (err) {
        console.error(err);
        return res.status(500).json({ error: 'Erreur lors de l\'envoi du mail.' });
    }
});

// --- Sanity check ---
app.get('/health', (_req, res) => res.json({ status: 'ok' }));

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => console.log(`Micro-service mailer running on port ${PORT}`));
