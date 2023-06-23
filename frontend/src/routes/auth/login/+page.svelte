<script lang="ts">
	import { enhance } from '$app/forms'

	export let form: { message?: string }
</script>

<h2>Sign in</h2>
<p class="center">or</p>
<form method="post" use:enhance>
	<label for="username">username</label><br />
	<input id="username" name="username" /><br />
	<label for="password">password</label><br />
	<input type="password" id="password" name="password" /><br />
	<input type="submit" value="Continue" class="button" />
</form>
{#if form?.message}
	<p class="error">{form.message || ''}</p>
{/if}
<a href="/auth/signup" class="link">Create a new account</a>
