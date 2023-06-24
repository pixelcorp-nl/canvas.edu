<script>
	import { _ } from 'svelte-i18n'
	import Locale from './Locale.svelte'
	import { page } from '$app/stores'
	import { slide } from 'svelte/transition'
	import { cubicOut } from 'svelte/easing'
	import { onMount } from 'svelte'
	import { user } from '$stores/user'

	let show_popout = false

	function toggle_logout() {
		show_popout = !show_popout
	}



</script>

<nav aria-label="Site Nav" class=" flex w-full items-center justify-between p-4">
	<a href="/" class="inline-flex h-10 w-10 items-center justify-center">
		<!-- <span class="sr-only">Logo</span> -->
		<img src="/pixels.svg" class="m-1 p-1 w-full h-full hover:scale-95 transition-all" alt="" srcset="" />
	</a>

	<ul class="flex items-center gap-2 text-sm font-medium text-gray-500">
		<!-- <li class="hidden lg:block">
      <a class="rounded-lg px-3 py-2" href="/"> Home </a>
    </li> -->

		<li><a class="rounded-lg px-3 py-2" class:bg-gray-100={$page.route.id === '/canvas'} href="/canvas"> {$_('header.canvas')} </a></li>

		<li>
			<a class="rounded-lg inline-flex items-center gap-2 px-3 py-2" class:bg-gray-100={$page.route.id === '/info'} href="/info">
				{$_('header.info')}
			</a>
		</li>
		<!-- <li>
			<a href="https://github.com/pixelcorp-nl/canvas.edu"><img src="/images/github.svg" alt="github" class="m-1 w-8 h-8 hover:scale-95 transition-all" /></a>
		</li> -->
		<!-- <li>
			<Locale />
		</li> -->
		<!-- make me a nice line seperator -->
		{#if $user.username}
			<li>
				<div class="h-8 w-0.5 bg-gray-300/50 mr-2" />
			</li>
			<li class="flex p-1 rounded-lg group" on:mouseenter={toggle_logout} on:mouseleave={toggle_logout}>
				<!-- make the div show the logout button on hover -->
				<div class="flex h-8 gap-1">
					<button class="flex h-full px-2 py-1 my-auto rounded-md items-center justify-center bg-gray-100 hover:bg-gray-200 transition-all font-mono">
						{$user.username ? $user.username : 'Guest'}
					</button>
					<!-- make a logout button -->
					{#if show_popout}
						<div transition:slide={{ duration: 300, delay: 0, axis: 'x', easing: cubicOut}}>
							<Locale />

							<button
								class="rounded-lg px-2 py-2 bg-red-400/50 hover:bg-red-400 transition-all items-center"
								class:bg-gray-100={$page.route.id === '/logout'}
								on:click={() => fetch('/logout')}>
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
				<a class="rounded-lg px-2 py-2 bg-gray-200/50 hover:bg-gray-200 transition-all items-center" class:bg-gray-100={$page.route.id === '/login'} href="/login"> Login </a>
			</li>
		{/if}
	</ul>
</nav>
