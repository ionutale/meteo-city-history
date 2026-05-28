<script lang="ts">
  let { unit, onunitchange, ongpsclick }: {
    unit: 'C' | 'F';
    onunitchange?: (u: 'C' | 'F') => void;
    ongpsclick?: () => void;
  } = $props();
</script>

<header class="flex flex-col md:flex-row justify-between items-center gap-4 mb-8">
  <div>
    <h1 class="text-3xl md:text-4xl font-extrabold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-blue-200 to-indigo-100 flex items-center gap-2">
      <i data-lucide="cloud-lightning" class="text-amber-400 w-8 h-8 animate-pulse"></i>
      MeteoCast
    </h1>
    <p class="text-indigo-200/80 text-sm md:text-base">Previsioni meteo in tempo reale e analisi climatica storica</p>
  </div>

  <div class="flex items-center gap-3">
    <button onclick={() => ongpsclick?.()}
      class="flex items-center gap-2 bg-white/10 hover:bg-white/20 active:scale-95 border border-white/10 px-4 py-2 rounded-full text-sm font-medium backdrop-blur-md transition-all">
      <i data-lucide="map-pin" class="w-4 h-4 text-emerald-400"></i>
      Usa GPS
    </button>
    <div class="bg-white/10 p-1 rounded-full border border-white/10 backdrop-blur-md flex">
      <button onclick={() => onunitchange?.('C')}
        class="px-3 py-1 rounded-full text-xs font-bold transition-all {unit === 'C' ? 'bg-white text-slate-900 shadow' : 'text-white hover:text-indigo-200'}">
        °C
      </button>
      <button onclick={() => onunitchange?.('F')}
        class="px-3 py-1 rounded-full text-xs font-bold transition-all {unit === 'F' ? 'bg-white text-slate-900 shadow' : 'text-white hover:text-indigo-200'}">
        °F
      </button>
    </div>
  </div>
</header>
