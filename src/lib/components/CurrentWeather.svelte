<script lang="ts">
	import type { WeatherData } from '$lib/types';
	import { getWeatherDetails, convertTemp } from '$lib/utils';

	let {
		weatherData,
		unit,
		cityName,
		country,
		timezone
	}: {
		weatherData: WeatherData;
		unit: 'C' | 'F';
		cityName: string;
		country: string;
		timezone: string;
	} = $props();

	let localTime = $derived(() => {
		try {
			const now = new Date();
			return new Intl.DateTimeFormat('it-IT', {
				timeZone: timezone,
				hour: '2-digit',
				minute: '2-digit',
				hour12: false
			}).format(now);
		} catch {
			return '--:--';
		}
	});

	let details = $derived(
		getWeatherDetails(weatherData.current.weather_code, weatherData.current.is_day)
	);
	let maxToday = $derived(convertTemp(weatherData.daily.temperature_2m_max[0], unit));
	let minToday = $derived(convertTemp(weatherData.daily.temperature_2m_min[0], unit));
	let feelsLike = $derived(convertTemp(weatherData.current.apparent_temperature, unit));
</script>

<div
	class="relative flex flex-col justify-between overflow-hidden rounded-3xl border border-white/15 bg-white/10 p-6 shadow-xl backdrop-blur-xl lg:col-span-1"
>
	<div
		class="pointer-events-none absolute -top-10 -right-10 h-40 w-40 rounded-full bg-indigo-500/20 blur-3xl"
	></div>

	<div>
		<div class="flex items-start justify-between">
			<div>
				<h2 class="text-3xl font-extrabold tracking-tight">{cityName}</h2>
				<p class="text-sm font-medium text-white/60">{country}</p>
			</div>
			<span class="rounded-full border border-white/10 bg-white/10 px-3 py-1 text-xs font-semibold"
				>Ora locale: {localTime()}</span
			>
		</div>

		<div class="my-8 flex items-center justify-between">
			<div>
				<div class="flex items-start">
					<span class="text-7xl font-black tracking-tighter"
						>{convertTemp(weatherData.current.temperature_2m, unit)}</span
					>
					<span class="mt-1 text-3xl font-bold text-indigo-300">°{unit}</span>
				</div>
				<div class="mt-2 flex items-center gap-1.5">
					<span class="text-sm font-medium text-white/80"
						>Max: {maxToday}°{unit} &bull; Min: {minToday}°{unit}</span
					>
				</div>
			</div>
			<div class="flex flex-col items-center">
				<div
					class="flex h-24 w-24 items-center justify-center drop-shadow-[0_8px_16px_rgba(255,255,255,0.2)] filter"
				>
					<i data-lucide={details.icon} class="{details.color} h-20 w-20"></i>
				</div>
				<span class="mt-1 text-center text-sm font-semibold tracking-wide text-indigo-200 uppercase"
					>{details.desc}</span
				>
			</div>
		</div>
	</div>

	<div class="mt-4 border-t border-white/10 pt-4">
		<p class="mb-2 text-xs font-semibold tracking-wider text-white/40 uppercase">
			Previsione odierna
		</p>
		<p class="text-sm text-indigo-100">
			Oggi a {cityName} si prevede una condizione di {details.desc.toLowerCase()}. La temperatura
			massima raggiungerà i {maxToday}°{unit} con un'umidità del {weatherData.current
				.relative_humidity_2m}%.
		</p>
	</div>
</div>
