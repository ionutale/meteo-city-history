<script lang="ts">
  import type { WeatherData } from '$lib/types';
  import { getWeatherDetails, convertTemp } from '$lib/utils';

  let { weatherData, unit }: {
    weatherData: WeatherData;
    unit: 'C' | 'F';
  } = $props();

  let currentHour = $derived(new Date().getHours());

  let hours = $derived(() => {
    const items = [];
    const start = currentHour;
    for (let i = start; i < start + 24; i++) {
      if (i >= weatherData.hourly.time.length) break;
      const date = new Date(weatherData.hourly.time[i]);
      const rawHour = date.getHours();
      const label = rawHour === currentHour ? 'Ora' : `${rawHour}:00`;
      const temp = convertTemp(weatherData.hourly.temperature_2m[i], unit);
      const code = weatherData.hourly.weather_code[i];
      const isDay = (rawHour > 6 && rawHour < 21) ? 1 : 0;
      const details = getWeatherDetails(code, isDay);
      items.push({ label, temp, icon: details.icon, color: details.color });
    }
    return items;
  });
</script>

<div class="bg-white/10 border border-white/15 rounded-3xl p-6 backdrop-blur-xl shadow-xl">
  <h3 class="text-lg font-bold mb-4 flex items-center gap-2">
    <i data-lucide="clock" class="w-5 h-5 text-indigo-300"></i> Nelle Prossime Ore
  </h3>
  <div class="flex gap-4 overflow-x-auto pb-3 custom-scrollbar">
    {#each hours() as h}
      <div class="flex-shrink-0 bg-white/5 border border-white/5 hover:border-white/10 w-20 py-4 rounded-2xl flex flex-col items-center gap-2 transition-all">
        <span class="text-xs text-white/60 font-medium">{h.label}</span>
        <i data-lucide={h.icon} class="{h.color} w-6 h-6"></i>
        <span class="text-sm font-bold">{h.temp}°</span>
      </div>
    {/each}
  </div>
</div>
