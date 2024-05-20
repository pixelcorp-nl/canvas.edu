<script lang="ts">
	import { _ } from 'svelte-i18n'
</script>

<slot />

<footer id="footer" class="mx-auto mt-5">
	<!-- <blockquote>
		{$_('footer')} <a class="person" href="https://github.com/Obult">Oswin</a>, <a class="person" href="https://github.com/LithiumOx">Mees</a> &
		<a class="person" href="https://github.com/SirMorfield">Joppe</a>
	</blockquote> -->
</footer>

<style>
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
