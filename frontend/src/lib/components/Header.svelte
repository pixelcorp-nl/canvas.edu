<script lang="ts">
	import { _ } from 'svelte-i18n'
	import Locale from './Locale.svelte'
	import { page } from '$app/stores'
	import { slide } from 'svelte/transition'
	import { cubicOut } from 'svelte/easing'
	import { signOut } from '$lib/public/util'
	import { user } from '$lib/Stores/User'
	let showPopout = false

	function toggleLogout() {
		showPopout = !showPopout
	}
</script>

<nav aria-label="Site Nav" class=" flex w-full items-center justify-between p-4">
	<a href="/" class="flex h-10 items-center">
		<img src="/pixels.svg" class="m-1 p-1 w-full h-full hover:scale-95 transition-all" alt="" srcset="" />
		<p class="font-mono text-center">PixelCorp</p>
	</a>

	<ul class="flex items-center gap-2 text-sm font-medium text-gray-500">
		{#if $user}
			<li><a class="rounded-lg px-3 py-2" class:bg-gray-100={$page.route?.id === '/canvas'} href="/canvas"> {$_('header.canvas')} </a></li>

			<li>
				<a class="rounded-lg inline-flex items-center gap-2 px-3 py-2" class:bg-gray-100={$page.route?.id === '/info'} href="/info">
					{$_('header.info')}
				</a>
			</li>
			<li>
				<div class="h-8 w-0.5 bg-gray-300/50 mr-2" />
			</li>

			<div class="flex h-full px-2 py-1 my-auto rounded-md items-center justify-center bg-gray-100 font-mono">
				{$user.class.name}
			</div>

			<li class="flex p-1 rounded-lg group" on:mouseenter={toggleLogout} on:mouseleave={toggleLogout}>
				<div class="flex h-8 gap-1">
					<button class="flex h-full px-2 py-1 my-auto rounded-md items-center justify-center bg-gray-100 hover:bg-gray-200 transition-all font-mono" id="header-username">
						{$user.name}
					</button>
					{#if showPopout}
						<div transition:slide={{ duration: 300, delay: 0, axis: 'x', easing: cubicOut }}>
							<Locale />
							<button class="rounded-lg px-2 py-2 bg-red-400/50 hover:bg-red-400 transition-all items-center" on:click={() => signOut()}>
								<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-4 h-4 text-white">
									<path
										stroke-linecap="round"
										stroke-linejoin="round"
										d="M15.75 9V5.25A2.25 2.25 0 0013.5 3h-6a2.25 2.25 0 00-2.25 2.25v13.5A2.25 2.25 0 007.5 21h6a2.25 2.25 0 002.25-2.25V15M12 9l-3 3m0 0l3 3m-3-3h12.75" />
								</svg>
							</button>
						</div>
					{/if}
				</div>
			</li>
		{:else}
			<li>
				<a class="rounded-lg px-3 py-2 bg-gray-200/50 hover:bg-gray-200 transition-all items-center" class:bg-gray-100={$page.route.id === '/login'} href="/login"> Login </a>
			</li>
			<li>
				<a class="rounded-lg px-3 py-2 bg-[#f2ac93] hover:bg-[#a45949] text-white transition-all items-center" class:bg-gray-100={$page.route.id === '/signup'} href="/signup">
					Sign up
				</a>
			</li>
			<li>
				<Locale />
			</li>
		{/if}
	</ul>
</nav>
