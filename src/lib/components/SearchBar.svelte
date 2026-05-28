<script lang="ts">
  import { browser } from '$app/environment';
  import type { GeoResult } from '$lib/types';

  let { onsearch }: { onsearch?: (city: string) => void } = $props();

  let inputValue = $state('');
  let suggestions = $state<GeoResult[]>([]);
  let showDropdown = $state(false);

  let debounceTimer: ReturnType<typeof setTimeout>;

  async function handleInput() {
    clearTimeout(debounceTimer);
    const q = inputValue.trim();
    if (q.length < 2) {
      suggestions = [];
      showDropdown = false;
      return;
    }
    debounceTimer = setTimeout(async () => {
      try {
        const res = await fetch(
          `https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(q)}&count=5&language=it&format=json`
        );
        if (!res.ok) return;
        const data = await res.json();
        suggestions = data.results || [];
        showDropdown = suggestions.length > 0;
      } catch {
        suggestions = [];
        showDropdown = false;
      }
    }, 250);
  }

  function selectSuggestion(item: GeoResult) {
    const region = item.admin1 ? `, ${item.admin1}` : '';
    const query = `${item.name}, ${item.country ?? ''}${region}`;
    onsearch?.(query);
    inputValue = '';
    suggestions = [];
    showDropdown = false;
  }

  function handleSubmit(e: Event) {
    e.preventDefault();
    if (inputValue.trim()) {
      onsearch?.(inputValue.trim());
      inputValue = '';
      suggestions = [];
      showDropdown = false;
    }
  }

  function quickSearch(city: string) {
    onsearch?.(city);
  }
</script>

<section class="mb-8">
  <div class="relative max-w-xl mx-auto">
    <form onsubmit={handleSubmit} class="flex items-center gap-2">
      <div class="relative w-full">
        <i data-lucide="search" class="absolute left-4 top-1/2 transform -translate-y-1/2 text-white/50 w-5 h-5"></i>
        <input
          type="text"
          bind:value={inputValue}
          oninput={handleInput}
          placeholder="Cerca una città nel mondo (es. Milano, Tokyo, Paris...)"
          class="w-full bg-white/10 hover:bg-white/15 focus:bg-white/20 border border-white/10 focus:border-white/30 rounded-2xl py-3.5 pl-12 pr-4 text-white placeholder-white/50 outline-none focus:ring-2 focus:ring-indigo-500/50 backdrop-blur-md transition-all text-base"
        />
        {#if showDropdown}
          <div class="absolute top-full left-0 right-0 mt-2 bg-slate-900/95 border border-white/10 rounded-2xl shadow-2xl overflow-hidden z-50 backdrop-blur-lg">
            <ul class="divide-y divide-white/5 max-h-60 overflow-y-auto">
              {#each suggestions as item}
                <li>
                  <button
                    onclick={() => selectSuggestion(item)}
                    class="w-full text-left px-4 py-3 hover:bg-white/10 transition-colors text-sm"
                  >
                    <span class="font-medium text-white">{item.name}</span>
                    {#if item.admin1}
                      <span class="text-white/50">, {item.admin1}</span>
                    {/if}
                    {#if item.country}
                      <span class="text-white/40">, {item.country}</span>
                    {/if}
                  </button>
                </li>
              {/each}
            </ul>
          </div>
        {/if}
      </div>
      <button type="submit"
        class="bg-indigo-600 hover:bg-indigo-500 active:scale-95 text-white font-semibold px-6 py-3.5 rounded-2xl shadow-lg transition-all flex items-center gap-2">
        Cerca
      </button>
    </form>
  </div>

  <div class="flex flex-wrap justify-center gap-2 mt-4 text-xs md:text-sm">
    <span class="text-white/40 self-center">Suggeriti:</span>
    {#each ['Roma', 'Milano', 'Napoli', 'Palermo', 'Londra', 'New York'] as city}
      <button onclick={() => quickSearch(city)}
        class="bg-white/5 hover:bg-white/10 border border-white/5 px-3 py-1.5 rounded-xl transition-all">
        {city}
      </button>
    {/each}
  </div>
</section>
