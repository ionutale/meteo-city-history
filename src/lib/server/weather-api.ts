import type { WeatherData, HistoricalData, WeatherCache, WeatherResponse } from '$lib/types';
import { getDb } from './mongodb';

const WEATHER_TTL = 30 * 60 * 1000;
const HISTORICAL_TTL = 24 * 60 * 60 * 1000;

function withRetry<T>(fn: () => Promise<T>, retries = 3, delay = 1000): Promise<T> {
	return fn().catch((err) => {
		if (retries <= 0) throw err;
		return new Promise<T>((resolve) =>
			setTimeout(() => resolve(withRetry(fn, retries - 1, delay * 2)), delay)
		);
	});
}

async function fetchWeather(lat: number, lon: number, tz: string): Promise<WeatherData> {
	const url =
		`https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}` +
		`&current=temperature_2m,relative_humidity_2m,apparent_temperature,is_day,precipitation,weather_code,wind_speed_10m,wind_direction_10m` +
		`&hourly=temperature_2m,weather_code` +
		`&daily=weather_code,temperature_2m_max,temperature_2m_min,sunrise,sunset,uv_index_max` +
		`&timezone=${encodeURIComponent(tz)}`;

	return withRetry(async () => {
		const res = await fetch(url);
		if (!res.ok) throw new Error(`Open-Meteo forecast: ${res.status}`);
		const raw = await res.json();
		return { current: raw.current, daily: raw.daily, hourly: raw.hourly };
	});
}

async function fetchHistorical(
	lat: number,
	lon: number,
	tz: string,
	years: number
): Promise<HistoricalData> {
	const today = new Date();
	const startYear = today.getFullYear() - years;
	const startDate = `${startYear}-01-01`;

	const end = new Date(today);
	end.setDate(today.getDate() - 5);
	const endDate = end.toISOString().split('T')[0];

	const url =
		`https://archive-api.open-meteo.com/v1/archive?latitude=${lat}&longitude=${lon}` +
		`&start_date=${startDate}&end_date=${endDate}&daily=temperature_2m_max` +
		`&timezone=${encodeURIComponent(tz)}`;

	return withRetry(async () => {
		const res = await fetch(url);
		if (!res.ok) throw new Error(`Open-Meteo archive: ${res.status}`);
		const raw = await res.json();

		const dates: string[] = raw.daily.time;
		const temps: number[] = raw.daily.temperature_2m_max;
		const structured: HistoricalData = {};

		for (let i = 0; i < dates.length; i++) {
			const t = temps[i];
			if (t == null) continue;
			const [y, m] = dates[i].split('-').map(Number);
			const month = m - 1;
			if (!structured[y]) structured[y] = {};
			if (structured[y][month] === undefined || t > structured[y][month]) {
				structured[y][month] = t;
			}
		}
		return structured;
	});
}

export async function getOrFetchWeather(
	lat: number,
	lon: number,
	cityName: string,
	country: string,
	timezone: string,
	historicalYears = 20
): Promise<WeatherResponse> {
	const cacheId = `${lat}_${lon}_${historicalYears}`;
	let cached: WeatherCache | null = null;

	try {
		const db = await getDb();
		cached = await db.collection<WeatherCache>('weather_cache').findOne({ _id: cacheId });
	} catch {
		console.warn('MongoDB cache unavailable');
	}

	const now = Date.now();
	const weatherOk =
		cached?.weatherData != null && now - (cached.cachedAt?.getTime() ?? 0) < WEATHER_TTL;
	const histOk =
		cached?.historicalData != null &&
		cached.historicalYears === historicalYears &&
		now - (cached.cachedAt?.getTime() ?? 0) < HISTORICAL_TTL;

	let wData = cached?.weatherData ?? null;
	let hData = cached?.historicalData ?? null;
	let didFetch = false;

	if (!weatherOk) {
		try {
			wData = await fetchWeather(lat, lon, timezone);
			didFetch = true;
		} catch (e) {
			console.error('Weather fetch failed', e);
		}
	}

	if (!histOk) {
		try {
			hData = await fetchHistorical(lat, lon, timezone, historicalYears);
			didFetch = true;
		} catch (e) {
			console.error('Historical fetch failed', e);
		}
	}

	const result: WeatherResponse = {
		weatherData: wData,
		historicalData: hData,
		cityName,
		country,
		latitude: lat,
		longitude: lon,
		timezone,
		historicalYears
	};

	if (didFetch && wData) {
		try {
			const db = await getDb();
			await db.collection<WeatherCache>('weather_cache').updateOne(
				{ _id: cacheId },
				{
					$set: {
						cityName,
						country,
						latitude: lat,
						longitude: lon,
						timezone,
						weatherData: wData,
						historicalData: hData,
						historicalYears,
						cachedAt: new Date()
					}
				},
				{ upsert: true }
			);
		} catch (e) {
			console.warn('MongoDB cache write failed', e);
		}
	}

	return result;
}
