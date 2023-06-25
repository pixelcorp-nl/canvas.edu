<script lang="ts">
	import { user } from '$lib/Stores/User'
	import Header from '$lib/components/Header.svelte'
	import Loader from '$lib/components/Loader.svelte'
	import '$lib/i18n'
	import { onMount } from 'svelte'
	import { _, isLoading, locale, waitLocale } from 'svelte-i18n'
	import '../app.postcss'
	import type { LayoutData } from './$types'

	export let data: LayoutData

	onMount(async () => {
		// refesh the entire page when the user logs in
		if (data.user) {
			$user = data.user
		}
		if (localStorage.getItem('locale') !== null) {
			// extract the locale from the localStorage by parsing the JSON string
			const lang = JSON.parse(localStorage.getItem('locale') || '')
			locale.set(lang.locale || 'en')
		}
		await waitLocale()
	})
</script>

{#if $isLoading}
	<Loader />
{:else}
	<div class="app">
		{#key data.user}
			<Header userData={data.user} />
		{/key}
		<main>
			<slot />
		</main>

		<a class="mx-auto" href="https://github.com/pixelcorp-nl/canvas.edu">
			<footer id="footer">
				<img src="/images/github.svg" class="m-1 w-8 h-8 hover:scale-95" alt="github" />
				<blockquote>
					{$_('footer')} <a class="person" href="https://github.com/Obult">Oswin</a>, <a class="person" href="https://github.com/LithiumOx">Mees</a> &
					<a class="person" href="https://github.com/SirMorfield">Joppe</a>
				</blockquote>
			</footer>
		</a>
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
		padding: 1rem;
		width: 100%;
		max-width: 64rem;
		margin: 0 auto;
		box-sizing: border-box;
	}

	.person:hover {
		text-decoration: underline;
	}

	footer {
		display: flex;
		flex-direction: column;
		justify-content: center;
		align-items: center;
		padding: 12px;
	}

	footer a {
		font-weight: bold;
	}

	@media (min-width: 480px) {
		footer {
			padding: 12px 0;
		}
	}
</style>
