# MeteoCast — Dashboard Meteo Interattiva

![Dashboard Roma](./screenshots/dashboard-roma.png)

Dashboard meteo interattiva con previsioni in tempo reale, analisi climatica storica (fino a 100 anni) e cache su MongoDB. Costruita con **SvelteKit 5**, **Tailwind CSS v4** e **TypeScript**.

## Screenshots

| Dashboard Roma | Ricerca Milano | Unità Fahrenheit | Tabella Storica |
|:---:|:---:|:---:|:---:|
| ![Roma](./screenshots/dashboard-roma.png) | ![Milano](./screenshots/search-milano.png) | ![°F](./screenshots/unit-fahrenheit.png) | ![Tabella](./screenshots/historical-table.png) |

## Funzionalità

- **Meteo corrente** — temperatura, percepita, vento, umidità, UV, precipitazioni, alba/tramonto
- **Previsioni orarie** — slider interattivo per le prossime 24 ore
- **Previsione settimanale** — 7 giorni con icone e min/max
- **Analisi climatica storica** — heatmap e tabella di temperature massime mensili dal 1906 a oggi (configurabile da 10 a 100 anni)
- **Ricerca città** — autocomplete con geocoding, città rapide, link condivisibili via URL
- **Unit toggle** — °C/°F senza roundtrip server
- **Geolocalizzazione GPS** — rilevamento automatico posizione
- **Cache MongoDB** — persistenza risposte Open-Meteo per ridurre le chiamate API
- **SSR** — server-side rendering per caricamento iniziale immediato
- **Condivisibile** — l'URL si aggiorna con lat/lon/città/periodo storico, incollabile

## Fonti Dati

| Fonte | API | Utilizzo |
|-------|-----|----------|
| [Open-Meteo Forecast API](https://open-meteo.com/) | `api.open-meteo.com/v1/forecast` | Meteo corrente, orario, 7 giorni |
| [Open-Meteo Archive API](https://open-meteo.com/) | `archive-api.open-meteo.com/v1/archive` | Temperature massime storiche |
| [Open-Meteo Geocoding API](https://open-meteo.com/) | `geocoding-api.open-meteo.com/v1/search` | Ricerca città e coordinate |
| [BigDataCloud](https://www.bigdatacloud.com/) | `api.bigdatacloud.net/data/reverse-geocode-client` | Reverse geocoding GPS |

## Requisiti

- **Node.js** 18+ (pnpm 8+)
- **MongoDB** (Atlas o locale) — opzionale ma raccomandato per cache

## Avvio Rapido

```bash
pnpm install
pnpm dev
# Apri http://localhost:5173
```

## Variabili d'Ambiente

| Variabile | Obbligatoria | Default | Descrizione |
|-----------|:---:|:---:|-------------|
| `MONGODB_URL` | Sì | — | URI connessione MongoDB |
| `MONGODB_DB` | No | `meteo_prd` | Nome database |

Crea un file `.env`:

```env
MONGODB_URL=mongodb+srv://user:password@cluster.mongodb.net/
MONGODB_DB=meteo_prd
```

## Docker Compose

```yaml
services:
  meteo:
    build: .
    ports:
      - "3000:3000"
    env_file: .env
    depends_on:
      mongo:
        condition: service_started

  mongo:
    image: mongo:7
    ports:
      - "27017:27017"
    volumes:
      - mongo_data:/data/db

volumes:
  mongo_data:
```

```bash
docker compose up -d
# Apri http://localhost:3000
```

## Script

```bash
pnpm dev          # Sviluppo (hot-reload)
pnpm build        # Build produzione
pnpm preview      # Preview build produzione
pnpm check        # TypeScript type-checking
pnpm format       # Formatta con Prettier
pnpm test:e2e     # Test end-to-end con Playwright
```

## Tecnologie

- [SvelteKit 5](https://svelte.dev/) — framework full-stack con runes
- [Tailwind CSS v4](https://tailwindcss.com/) — utility-first CSS
- [TypeScript](https://www.typescriptlang.org/) — tipi statici
- [MongoDB](https://www.mongodb.com/) — cache persistente
- [Playwright](https://playwright.dev/) — test e2e
- [Lucide Icons](https://lucide.dev/) — icone vettoriali

## Architettura Cache

```
Richiesta → MongoDB cache check
  ├── Cache hit (< 30 min weather, < 24h historical) → risposta diretta
  └── Cache miss → Open-Meteo API → salva in MongoDB → risposta
```

Chiave cache: `{lat}_{lon}_{years}` per supportare diversi periodi storici.
