<script lang="ts">
	import { user } from '$stores/user'
	import '../app.postcss'
	import Header from '$lib/components/Header.svelte'
	import '$lib/i18n'
	import { _, isLoading, locale, waitLocale } from 'svelte-i18n'
	import Loader from '$lib/components/Loader.svelte'
	import { onMount } from 'svelte'
	import type { LayoutData } from './$types'

	export let data: LayoutData

	onMount(async () => {
		// refesh the entire page when the user logs in
		if (data.user != null) {
			$user = data.user as any
		}
		if (localStorage.getItem('locale') !== null) {
			// extract the locale from the localStorage by parsing the JSON string
			const lang = JSON.parse(localStorage.getItem('locale') || '')
			locale.set(lang.locale || 'en')
		}
		await waitLocale()
	})

	$: console.log($user)
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

		<a class="mx-auto" href="https://github.com/pixelcorp-nl/canvas.edu"><img src="/images/github.svg" alt="github" class="m-1 w-8 h-8 hover:scale-95 transition-all" /></a>

		<!-- <footer id="footer">
			<p>
				{$_('footer')} <a href="https://github.com/Obult">Oswin</a>,
				<a href="https://github.com/LithiumOx">Mees</a> & <a href="https://github.com/SirMorfield">Joppe</a>
			</p>
		</footer> -->
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

	/* footer {
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
	} */
</style>
