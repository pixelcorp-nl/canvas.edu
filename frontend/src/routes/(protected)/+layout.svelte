<script>
    import { _ } from 'svelte-i18n'
    import { user } from '$stores/user'
    export let data

    $user = data.user

</script>

<slot />

<footer class="mx-auto mt-5">
	<p>
		{$_('footer')} <a href="https://github.com/Obult">Oswin</a>,
		<a href="https://github.com/LithiumOx">Mees</a> & <a href="https://github.com/SirMorfield">Joppe</a>
	</p>
</footer>
