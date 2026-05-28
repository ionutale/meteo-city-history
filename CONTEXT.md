# MeteoCast — Glossario di Dominio

## Termini

### WeatherData

Dati meteorologici correnti e previsioni a breve termine (orarie + 7 giorni) ottenuti da Open-Meteo Forecast API. Includono temperatura percepita, vento, umidità, UV, precipitazioni, alba/tramonto.

### HistoricalData

Temperature massime mensili aggregate negli ultimi 20 anni, ottenute da Open-Meteo Archive API. Strutturato come `Record<anno, Record<mese, temp_max>>` per la visualizzazione a heatmap.

### Città (City)

Entità geografica con nome, paese/regione, coordinate (lat/lon) e fuso orario. Risolta tramite Open-Meteo Geocoding API.

### Cache (MongoDB)

Persistenza su MongoDB Atlas delle risposte Open-Meteo. TTL: 30 minuti per WeatherData, 24 ore per HistoricalData. La chiave è `{lat}_{lon}`.

### Unità

Toggle °C/°F gestito interamente lato client. Nessun roundtrip server per il cambio unità.

### GPS

Geolocalizzazione browser W3C + reverse geocoding tramite BigDataCloud API per rilevare la posizione corrente.

## Flussi

- **SSR**: Load function server chiama `getOrFetchWeather()` con default Roma → passato come props al client
- **Ricerca**: Client → `GET /api/weather?lat=&lon=...` → server controlla cache MongoDB → eventuale fetch Open-Meteo → risposta JSON
- **Cache miss**: Server fetcha da Open-Meteo, salva in MongoDB, risponde
- **Cache hit**: Server risponde direttamente dal DB
