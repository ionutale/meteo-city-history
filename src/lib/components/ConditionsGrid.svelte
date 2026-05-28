<script lang="ts">
	import type { WeatherData } from '$lib/types';
	import { convertTemp, getWindDirection } from '$lib/utils';

	let {
		weatherData,
		unit
	}: {
		weatherData: WeatherData;
		unit: 'C' | 'F';
	} = $props();

	let d = $derived(weatherData.daily);
	let c = $derived(weatherData.current);

	function formatTime(iso: string) {
		try {
			return new Date(iso).toLocaleTimeString('it-IT', { hour: '2-digit', minute: '2-digit' });
		} catch {
			return '--:--';
		}
	}
</script>

<div class="rounded-3xl border border-white/15 bg-white/10 p-6 shadow-xl backdrop-blur-xl">
	<h3 class="mb-4 flex items-center gap-2 text-lg font-bold">
		<i data-lucide="gauge" class="h-5 w-5 text-indigo-300"></i> Condizioni Attuali
	</h3>
	<div class="grid grid-cols-2 gap-4 md:grid-cols-4">
		<div class="flex items-center gap-3 rounded-2xl border border-white/5 bg-white/5 p-4">
			<div class="rounded-xl bg-orange-500/20 p-2.5 text-orange-400">
				<i data-lucide="thermometer" class="h-5 w-5"></i>
			</div>
			<div>
				<p class="text-xs text-white/40">Percepita</p>
				<p class="text-lg font-bold">{convertTemp(c.apparent_temperature, unit)}°{unit}</p>
			</div>
		</div>

		<div class="flex items-center gap-3 rounded-2xl border border-white/5 bg-white/5 p-4">
			<div class="rounded-xl bg-blue-500/20 p-2.5 text-blue-400">
				<i data-lucide="wind" class="h-5 w-5"></i>
			</div>
			<div>
				<p class="text-xs text-white/40">Vento</p>
				<p class="text-lg font-bold">{c.wind_speed_10m} km/h</p>
			</div>
		</div>

		<div class="flex items-center gap-3 rounded-2xl border border-white/5 bg-white/5 p-4">
			<div class="rounded-xl bg-teal-500/20 p-2.5 text-teal-400">
				<i data-lucide="droplet" class="h-5 w-5"></i>
			</div>
			<div>
				<p class="text-xs text-white/40">Umidità</p>
				<p class="text-lg font-bold">{c.relative_humidity_2m}%</p>
			</div>
		</div>

		<div class="flex items-center gap-3 rounded-2xl border border-white/5 bg-white/5 p-4">
			<div class="rounded-xl bg-amber-500/20 p-2.5 text-amber-400">
				<i data-lucide="sun" class="h-5 w-5"></i>
			</div>
			<div>
				<p class="text-xs text-white/40">Indice UV</p>
				<p class="text-lg font-bold">{Math.round(d.uv_index_max[0])} di 10</p>
			</div>
		</div>

		<div class="flex items-center gap-3 rounded-2xl border border-white/5 bg-white/5 p-4">
			<div class="rounded-xl bg-sky-500/20 p-2.5 text-sky-400">
				<i data-lucide="cloud-rain" class="h-5 w-5"></i>
			</div>
			<div>
				<p class="text-xs text-white/40">Precipitazioni</p>
				<p class="text-lg font-bold">{c.precipitation} mm</p>
			</div>
		</div>

		<div class="flex items-center gap-3 rounded-2xl border border-white/5 bg-white/5 p-4">
			<div class="rounded-xl bg-yellow-500/20 p-2.5 text-yellow-400">
				<i data-lucide="sunrise" class="h-5 w-5"></i>
			</div>
			<div>
				<p class="text-xs text-white/40">Alba</p>
				<p class="text-lg font-bold">{formatTime(d.sunrise[0])}</p>
			</div>
		</div>

		<div class="flex items-center gap-3 rounded-2xl border border-white/5 bg-white/5 p-4">
			<div class="rounded-xl bg-rose-500/20 p-2.5 text-rose-400">
				<i data-lucide="sunset" class="h-5 w-5"></i>
			</div>
			<div>
				<p class="text-xs text-white/40">Tramonto</p>
				<p class="text-lg font-bold">{formatTime(d.sunset[0])}</p>
			</div>
		</div>

		<div class="flex items-center gap-3 rounded-2xl border border-white/5 bg-white/5 p-4">
			<div class="rounded-xl bg-purple-500/20 p-2.5 text-purple-400">
				<i data-lucide="compass" class="h-5 w-5"></i>
			</div>
			<div>
				<p class="text-xs text-white/40">Dir. Vento</p>
				<p class="text-lg font-bold">{getWindDirection(c.wind_direction_10m)}</p>
			</div>
		</div>
	</div>
</div>
