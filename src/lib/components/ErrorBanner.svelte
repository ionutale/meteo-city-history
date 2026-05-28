<script lang="ts">
	let { message = '', onclose }: { message?: string; onclose?: () => void } = $props();
</script>

{#if message}
	<div
		id="error-banner"
		class="mb-6 flex items-center justify-between rounded-2xl border border-rose-400/50 bg-rose-500/90 px-4 py-3 text-white shadow-lg backdrop-blur-md transition-all duration-300"
	>
		<div class="flex items-center gap-3">
			<i data-lucide="alert-circle" class="h-5 w-5 flex-shrink-0"></i>
			<span id="error-text" class="text-sm font-medium">{message}</span>
		</div>
		<button
			onclick={() => onclose?.()}
			aria-label="Chiudi errore"
			class="rounded-full p-1 transition-all hover:bg-white/10"
		>
			<i data-lucide="x" class="h-4 w-4"></i>
		</button>
	</div>
{/if}
