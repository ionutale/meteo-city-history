<script lang="ts">
  import type { WeatherData } from '$lib/types';
  import { getWeatherDetails, convertTemp } from '$lib/utils';

  let { weatherData, unit, cityName, country, timezone }: {
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
        timeZone: timezone, hour: '2-digit', minute: '2-digit', hour12: false
      }).format(now);
    } catch { return '--:--'; }
  });

  let details = $derived(getWeatherDetails(weatherData.current.weather_code, weatherData.current.is_day));
  let maxToday = $derived(convertTemp(weatherData.daily.temperature_2m_max[0], unit));
  let minToday = $derived(convertTemp(weatherData.daily.temperature_2m_min[0], unit));
  let feelsLike = $derived(convertTemp(weatherData.current.apparent_temperature, unit));
</script>

<div class="lg:col-span-1 bg-white/10 border border-white/15 rounded-3xl p-6 backdrop-blur-xl flex flex-col justify-between shadow-xl relative overflow-hidden">
  <div class="absolute -right-10 -top-10 w-40 h-40 bg-indigo-500/20 rounded-full blur-3xl pointer-events-none"></div>

  <div>
    <div class="flex justify-between items-start">
      <div>
        <h2 class="text-3xl font-extrabold tracking-tight">{cityName}</h2>
        <p class="text-white/60 text-sm font-medium">{country}</p>
      </div>
      <span class="bg-white/10 border border-white/10 px-3 py-1 rounded-full text-xs font-semibold">Ora locale: {localTime()}</span>
    </div>

    <div class="my-8 flex items-center justify-between">
      <div>
        <div class="flex items-start">
          <span class="text-7xl font-black tracking-tighter">{convertTemp(weatherData.current.temperature_2m, unit)}</span>
          <span class="text-3xl font-bold text-indigo-300 mt-1">°{unit}</span>
        </div>
        <div class="flex items-center gap-1.5 mt-2">
          <span class="text-sm font-medium text-white/80">Max: {maxToday}°{unit} &bull; Min: {minToday}°{unit}</span>
        </div>
      </div>
      <div class="flex flex-col items-center">
        <div class="w-24 h-24 flex items-center justify-center filter drop-shadow-[0_8px_16px_rgba(255,255,255,0.2)]">
          <i data-lucide={details.icon} class="{details.color} w-20 h-20"></i>
        </div>
        <span class="text-sm font-semibold tracking-wide text-center mt-1 uppercase text-indigo-200">{details.desc}</span>
      </div>
    </div>
  </div>

  <div class="border-t border-white/10 pt-4 mt-4">
    <p class="text-xs text-white/40 uppercase font-semibold tracking-wider mb-2">Previsione odierna</p>
    <p class="text-sm text-indigo-100">
      Oggi a {cityName} si prevede una condizione di {details.desc.toLowerCase()}.
      La temperatura massima raggiungerà i {maxToday}°{unit} con un'umidità del {weatherData.current.relative_humidity_2m}%.
    </p>
  </div>
</div>
