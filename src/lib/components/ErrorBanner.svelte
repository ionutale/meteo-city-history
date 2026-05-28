<script lang="ts">
  let { message = '', onclose }: { message?: string; onclose?: () => void } = $props();
</script>

{#if message}
  <div class="bg-rose-500/90 border border-rose-400/50 text-white px-4 py-3 rounded-2xl backdrop-blur-md shadow-lg mb-6 flex items-center justify-between transition-all duration-300">
    <div class="flex items-center gap-3">
      <i data-lucide="alert-circle" class="w-5 h-5 flex-shrink-0"></i>
      <span class="text-sm font-medium">{message}</span>
    </div>
    <button onclick={() => onclose?.()} aria-label="Chiudi errore" class="p-1 hover:bg-white/10 rounded-full transition-all">
      <i data-lucide="x" class="w-4 h-4"></i>
    </button>
  </div>
{/if}
