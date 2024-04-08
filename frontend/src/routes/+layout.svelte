<script lang="ts">
	import Header from '$lib/components/Header.svelte'
	import Loader from '$lib/components/Loader.svelte'
	import '$lib/i18n'
	import { onMount } from 'svelte'
	import { isLoading, locale, waitLocale } from 'svelte-i18n'
	import '../app.postcss'
	import type { LayoutData } from './$types'
	import { user } from '$lib/Stores/User'
	export let data: LayoutData

	onMount(async () => {
		if (localStorage.getItem('locale') !== null) {
			// extract the locale from the localStorage by parsing the JSON string
			const lang = JSON.parse(localStorage.getItem('locale') || '')
			locale.set(lang.locale || 'en')
		}
		await waitLocale()
		user.set(data.session?.user)
	})
</script>

{#if $isLoading}
	<Loader />
{:else}
	<div class="app">
		{#key data.session?.user}
			<Header />
		{/key}
		<main><slot /></main>

		<a class="mx-auto" href="https://github.com/pixelcorp-nl/canvas.edu"><img src="/images/github.svg" class="m-1 w-8 h-8 hover:scale-95" alt="github" /></a>
	</div>
{/if}

<style>
	.app {
		display: flex;
		flex-direction: column;
		min-height: 90vh;
	}

	main {
		flex: 1;
		display: flex;
		flex-direction: column;
		justify-content: flex-start;
		width: 100%;
		max-width: 64rem;
		margin: 0 auto;
		box-sizing: border-box;
	}
</style>
