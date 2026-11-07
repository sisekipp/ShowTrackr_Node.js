# ShowTrackr (Next.js)

TV-Serien-Tracker: Serien hinzufügen (Daten kommen von TheTVDB), abonnieren und eine
E-Mail-Benachrichtigung ca. 2 Stunden vor Ausstrahlung einer neuen Folge erhalten.

## Stack

- Next.js 16 (App Router, Server Components + Server Actions)
- MongoDB via Mongoose
- NextAuth v5 (Credentials, JWT-Session)
- Agenda (wiederkehrende E-Mail-Jobs, gestartet über `instrumentation.js`)
- Tailwind CSS 4
- Nodemailer (SMTP)

## Setup

1. MongoDB starten: `docker compose up -d`
2. `.env` anlegen (siehe `.env.example`) und Werte eintragen
3. `npm install`
4. `npm run dev` → http://localhost:3000

Produktion: `npm run build && npm start`

## Umgebungsvariablen

| Variable       | Zweck                                   |
| -------------- | --------------------------------------- |
| `MONGODB_URI`  | MongoDB-Verbindungsstring               |
| `AUTH_SECRET`  | Secret für die Session-Signierung       |
| `TVDB_API_KEY` | API-Key für TheTVDB                     |
| `SMTP_*`       | SMTP-Zugangsdaten für Alert-Mails       |
| `MAIL_FROM`    | Absenderadresse der Alert-Mails         |

## Hinweis

Die verwendete TheTVDB-v1-API (`thetvdb.com/api/...`) ist veraltet. Für den
Produktivbetrieb sollte auf die TVDB API v4 oder TMDB migriert werden
(siehe `lib/tvdb.js`).
