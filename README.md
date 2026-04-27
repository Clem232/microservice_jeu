# Micro-service – Mailer

Service REST minimal pour l'envoi d'e-mails via SMTP (Nodemailer).

## Prérequis

- Node.js 18+

## Installation

```bash
npm install
cp .env.example .env   # Configure ton SMTP
```

## Lancer en développement

```bash
npm run dev
# → http://localhost:3001
```

## Lancer en production

```bash
npm start
```

## Routes

| Méthode | Route       | Description              |
|---------|-------------|--------------------------|
| GET     | /health     | Vérifie que le service est up |
| POST    | /send-mail  | Envoie un e-mail         |

### Corps POST /send-mail

```json
{
  "to": "destinataire@example.com",
  "subject": "Sujet du mail",
  "text": "Contenu texte",
  "html": "<p>Contenu HTML</p>"
}
```
