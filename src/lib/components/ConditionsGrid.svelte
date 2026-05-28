<script lang="ts">
  import type { WeatherData } from '$lib/types';
  import { convertTemp, getWindDirection } from '$lib/utils';

  let { weatherData, unit }: {
    weatherData: WeatherData;
    unit: 'C' | 'F';
  } = $props();

  let d = $derived(weatherData.daily);
  let c = $derived(weatherData.current);

  function formatTime(iso: string) {
    try {
      return new Date(iso).toLocaleTimeString('it-IT', { hour: '2-digit', minute: '2-digit' });
    } catch { return '--:--'; }
  }
</script>

<div class="bg-white/10 border border-white/15 rounded-3xl p-6 backdrop-blur-xl shadow-xl">
  <h3 class="text-lg font-bold mb-4 flex items-center gap-2">
    <i data-lucide="gauge" class="w-5 h-5 text-indigo-300"></i> Condizioni Attuali
  </h3>
  <div class="grid grid-cols-2 md:grid-cols-4 gap-4">
    <div class="bg-white/5 border border-white/5 p-4 rounded-2xl flex items-center gap-3">
      <div class="p-2.5 bg-orange-500/20 text-orange-400 rounded-xl"><i data-lucide="thermometer" class="w-5 h-5"></i></div>
      <div>
        <p class="text-white/40 text-xs">Percepita</p>
        <p class="text-lg font-bold">{convertTemp(c.apparent_temperature, unit)}°{unit}</p>
      </div>
    </div>

    <div class="bg-white/5 border border-white/5 p-4 rounded-2xl flex items-center gap-3">
      <div class="p-2.5 bg-blue-500/20 text-blue-400 rounded-xl"><i data-lucide="wind" class="w-5 h-5"></i></div>
      <div>
        <p class="text-white/40 text-xs">Vento</p>
        <p class="text-lg font-bold">{c.wind_speed_10m} km/h</p>
      </div>
    </div>

    <div class="bg-white/5 border border-white/5 p-4 rounded-2xl flex items-center gap-3">
      <div class="p-2.5 bg-teal-500/20 text-teal-400 rounded-xl"><i data-lucide="droplet" class="w-5 h-5"></i></div>
      <div>
        <p class="text-white/40 text-xs">Umidità</p>
        <p class="text-lg font-bold">{c.relative_humidity_2m}%</p>
      </div>
    </div>

    <div class="bg-white/5 border border-white/5 p-4 rounded-2xl flex items-center gap-3">
      <div class="p-2.5 bg-amber-500/20 text-amber-400 rounded-xl"><i data-lucide="sun" class="w-5 h-5"></i></div>
      <div>
        <p class="text-white/40 text-xs">Indice UV</p>
        <p class="text-lg font-bold">{Math.round(d.uv_index_max[0])} di 10</p>
      </div>
    </div>

    <div class="bg-white/5 border border-white/5 p-4 rounded-2xl flex items-center gap-3">
      <div class="p-2.5 bg-sky-500/20 text-sky-400 rounded-xl"><i data-lucide="cloud-rain" class="w-5 h-5"></i></div>
      <div>
        <p class="text-white/40 text-xs">Precipitazioni</p>
        <p class="text-lg font-bold">{c.precipitation} mm</p>
      </div>
    </div>

    <div class="bg-white/5 border border-white/5 p-4 rounded-2xl flex items-center gap-3">
      <div class="p-2.5 bg-yellow-500/20 text-yellow-400 rounded-xl"><i data-lucide="sunrise" class="w-5 h-5"></i></div>
      <div>
        <p class="text-white/40 text-xs">Alba</p>
        <p class="text-lg font-bold">{formatTime(d.sunrise[0])}</p>
      </div>
    </div>

    <div class="bg-white/5 border border-white/5 p-4 rounded-2xl flex items-center gap-3">
      <div class="p-2.5 bg-rose-500/20 text-rose-400 rounded-xl"><i data-lucide="sunset" class="w-5 h-5"></i></div>
      <div>
        <p class="text-white/40 text-xs">Tramonto</p>
        <p class="text-lg font-bold">{formatTime(d.sunset[0])}</p>
      </div>
    </div>

    <div class="bg-white/5 border border-white/5 p-4 rounded-2xl flex items-center gap-3">
      <div class="p-2.5 bg-purple-500/20 text-purple-400 rounded-xl"><i data-lucide="compass" class="w-5 h-5"></i></div>
      <div>
        <p class="text-white/40 text-xs">Dir. Vento</p>
        <p class="text-lg font-bold">{getWindDirection(c.wind_direction_10m)}</p>
      </div>
    </div>
  </div>
</div>
