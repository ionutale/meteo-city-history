<script lang="ts">
	import type { WeatherData, HistoricalData } from '$lib/types';
	import { updateBackgroundTheme } from '$lib/utils';
	import Header from '$lib/components/Header.svelte';
	import SearchBar from '$lib/components/SearchBar.svelte';
	import ErrorBanner from '$lib/components/ErrorBanner.svelte';
	import CurrentWeather from '$lib/components/CurrentWeather.svelte';
	import ConditionsGrid from '$lib/components/ConditionsGrid.svelte';
	import HourlyForecast from '$lib/components/HourlyForecast.svelte';
	import WeeklyForecast from '$lib/components/WeeklyForecast.svelte';
	import HistoricalAnalysis from '$lib/components/HistoricalAnalysis.svelte';

	let {
		weatherData: initialWeather,
		historicalData: initialHistorical,
		cityName: initialCity,
		country: initialCountry,
		latitude: initialLat,
		longitude: initialLon,
		timezone: initialTz
	}: {
		weatherData: WeatherData | null;
		historicalData: HistoricalData | null;
		cityName: string;
		country: string;
		latitude: number;
		longitude: number;
		timezone: string;
	} = $props();

	let weatherData = $state<WeatherData | null>(initialWeather);
	let historicalData = $state<HistoricalData | null>(initialHistorical);
	let cityName = $state(initialCity);
	let country = $state(initialCountry);
	let latitude = $state(initialLat);
	let longitude = $state(initialLon);
	let timezone = $state(initialTz);
	let unit = $state<'C' | 'F'>('C');
	let error = $state('');
	let loading = $state(false);

	let bgGradient = $derived(
		weatherData
			? updateBackgroundTheme(weatherData.current.weather_code, weatherData.current.is_day)
			: 'from-slate-900 via-indigo-950 to-slate-900'
	);

	$effect(() => {
		if (typeof lucide !== 'undefined') {
			lucide.createIcons();
		}
	});

	$effect(() => {
		if (weatherData) {
			const _ = JSON.stringify(weatherData);
			if (typeof lucide !== 'undefined') {
				requestAnimationFrame(() => lucide.createIcons());
			}
		}
	});

	async function searchCity(query: string) {
		if (!query.trim()) return;
		error = '';
		loading = true;

		try {
			const geoRes = await fetch(
				`https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(query)}&count=1&language=it&format=json`
			);
			if (!geoRes.ok) throw new Error('Geocoding failed');
			const geoData = await geoRes.json();
			const result = geoData.results?.[0];
			if (!result) {
				error = "Impossibile trovare la città inserita. Verifica l'ortografia.";
				loading = false;
				return;
			}

			const region = result.admin1 ? `, ${result.admin1}` : '';
			const city = result.name;
			const ctry = result.country ? `${result.country}${region}` : '';
			const tz = result.timezone || 'Europe/Rome';

			await fetchWeatherData(result.latitude, result.longitude, city, ctry, tz);
		} catch {
			error = 'Errore durante la ricerca della città. Controlla la connessione.';
			loading = false;
		}
	}

	async function fetchWeatherData(
		lat: number,
		lon: number,
		city: string,
		ctry: string,
		tz: string
	) {
		loading = true;
		try {
			const res = await fetch(
				`/api/weather?lat=${lat}&lon=${lon}&city=${encodeURIComponent(city)}&country=${encodeURIComponent(ctry)}&timezone=${encodeURIComponent(tz)}`
			);
			if (!res.ok) throw new Error('API error');
			const data = await res.json();

			weatherData = data.weatherData;
			historicalData = data.historicalData;
			cityName = data.cityName;
			country = data.country;
			latitude = data.latitude;
			longitude = data.longitude;
			timezone = data.timezone;
		} catch {
			error = 'Impossibile caricare i dati meteorologici.';
		}
		loading = false;
	}

	function handleGps() {
		if (!navigator.geolocation) {
			error = 'La geolocalizzazione non è supportata dal tuo browser.';
			return;
		}

		loading = true;
		error = '';

		navigator.geolocation.getCurrentPosition(
			async (pos) => {
				const lat = pos.coords.latitude;
				const lon = pos.coords.longitude;
				const tz = Intl.DateTimeFormat().resolvedOptions().timeZone;

				try {
					const geoRes = await fetch(
						`https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=${lat}&longitude=${lon}&localityLanguage=it`
					);
					let detectedCity = 'La tua posizione';
					let detectedCountry = 'Rilevato via GPS';

					if (geoRes.ok) {
						const geoData = await geoRes.json();
						detectedCity = geoData.city || geoData.locality || detectedCity;
						detectedCountry = geoData.countryName || detectedCountry;
					}

					await fetchWeatherData(lat, lon, detectedCity, detectedCountry, tz);
				} catch {
					await fetchWeatherData(lat, lon, 'Posizione Rilevata', 'GPS', tz);
				}
			},
			(err) => {
				loading = false;
				const messages: Record<number, string> = {
					1: 'Accesso alla posizione rifiutato.',
					2: 'Posizione non disponibile.',
					3: 'Richiesta GPS scaduta.'
				};
				error = messages[err.code] || 'Errore GPS.';
			},
			{ timeout: 10000 }
		);
	}
</script>

<div
	class="min-h-screen bg-gradient-to-br p-4 text-white transition-all duration-700 ease-in-out md:p-8 {bgGradient}"
>
	<div class="mx-auto max-w-6xl">
		<Header {unit} onunitchange={(u) => (unit = u)} ongpsclick={handleGps} />

		<ErrorBanner message={error} onclose={() => (error = '')} />

		<SearchBar onsearch={searchCity} />

		{#if loading && !weatherData}
			<div class="flex flex-col items-center justify-center py-20">
				<div class="relative mb-4 h-16 w-16">
					<div class="absolute inset-0 rounded-full border-4 border-indigo-500/20"></div>
					<div
						class="absolute inset-0 animate-spin rounded-full border-4 border-indigo-500 border-t-transparent"
					></div>
				</div>
				<p class="animate-pulse text-sm text-indigo-200/70">
					Sincronizzazione dati atmosferici in corso...
				</p>
			</div>
		{:else if weatherData}
			<main class="grid grid-cols-1 gap-6 transition-opacity duration-500 lg:grid-cols-3">
				<CurrentWeather {weatherData} {unit} {cityName} {country} {timezone} />

				<div class="flex flex-col gap-6 lg:col-span-2">
					<ConditionsGrid {weatherData} {unit} />
					<HourlyForecast {weatherData} {unit} />
				</div>

				<WeeklyForecast {weatherData} {unit} />

				<HistoricalAnalysis {historicalData} {unit} {cityName} />
			</main>
		{/if}

		<footer
			class="mt-12 flex flex-col items-center justify-between gap-4 border-t border-white/5 pt-6 text-center text-xs text-white/30 md:flex-row"
		>
			<p>&copy; 2026 MeteoCast. Creato con API Open-Meteo &amp; Geocoding.</p>
			<div class="flex gap-4">
				<a
					href="https://open-meteo.com"
					target="_blank"
					rel="noopener"
					class="transition-colors hover:text-white/60">Dati Meteorologici Pubblici</a
				>
				<span>&bull;</span>
				<span class="text-emerald-400/80">Stato API: Online</span>
			</div>
		</footer>
	</div>
</div>
