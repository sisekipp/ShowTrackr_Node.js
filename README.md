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
| `TVDB_API_KEY` | TheTVDB-v4-API-Key (Dashboard → API Keys) |
| `TVDB_PIN`     | optional, nur bei Subscriber-Key        |
| `SMTP_*`       | SMTP-Zugangsdaten für Alert-Mails       |
| `MAIL_FROM`    | Absenderadresse der Alert-Mails         |

## Hinweis

Serien-Daten kommen von der TheTVDB **API v4** (`api4.thetvdb.com/v4`, siehe
`lib/tvdb.js`): Login per API-Key, Suche per `/search?type=series`, Details +
Episoden per `/series/{id}/extended?meta=episodes`.
