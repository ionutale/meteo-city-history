import { getOrFetchWeather } from '$lib/server/weather-api';
import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';

export const GET: RequestHandler = async ({ url }) => {
	const lat = parseFloat(url.searchParams.get('lat') ?? '');
	const lon = parseFloat(url.searchParams.get('lon') ?? '');
	const city = url.searchParams.get('city') ?? 'Sconosciuta';
	const country = url.searchParams.get('country') ?? '';
	const tz = url.searchParams.get('timezone') ?? 'Europe/Rome';

	if (isNaN(lat) || isNaN(lon)) {
		return json({ error: 'lat and lon query params are required' }, { status: 400 });
	}

	try {
		const data = await getOrFetchWeather(lat, lon, city, country, tz);
		return json(data);
	} catch (e) {
		console.error('API route error', e);
		return json({ error: 'Failed to fetch weather data' }, { status: 500 });
	}
};
