<script lang="ts">
	import { enhance } from '$app/forms'
	import Button from '$components/Button.svelte'

	export let form: { message?: string }
</script>

<div class="mx-auto max-w-screen-xl px-4 py-16 sm:px-6 lg:px-8">
	<div class="mx-auto max-w-lg text-center">
		<h1 class="text-2xl font-bold sm:text-3xl">Create an account</h1>
	</div>

	<form method="post" use:enhance class="mx-auto mb-0 mt-8 min-w-[11vw] space-y-4">
		<div>
			<label for="username" class="sr-only">Username</label>

			<div class="relative">
				<input id="username" name="username" class="w-full rounded-lg border-gray-200 p-4 pe-12 text-sm shadow-sm" placeholder="Username" />

				<span class="absolute inset-y-0 end-0 grid place-content-center px-4">
					<svg fill="none" stroke="currentColor" stroke-width="1.5" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" aria-hidden="true" class="h-4 w-4 text-gray-400">
						<path
							stroke-linecap="round"
							stroke-linejoin="round"
							d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z" />
					</svg>
				</span>
			</div>
		</div>

		<div>
			<label for="class" class="sr-only">Class</label>
			<div class="relative">
				<input id="classId" name="classId" class="w-full rounded-lg border-gray-200 p-4 pe-12 text-sm shadow-sm" placeholder="Class ID" />
			</div>
		</div>

		<div>
			<label for="password" class="sr-only">Password</label>

			<div class="relative">
				<input type="password" id="password" name="password" class="w-full rounded-lg border-gray-200 p-4 pe-12 text-sm shadow-sm" placeholder="Enter password" />

				<span class="absolute inset-y-0 end-0 grid place-content-center px-4">
					<svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
						<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
						<path
							stroke-linecap="round"
							stroke-linejoin="round"
							stroke-width="2"
							d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
					</svg>
				</span>
			</div>
		</div>
		<div>
			<label for="password" class="sr-only">Password</label>

			<div class="relative">
				<input type="password" id="password-confirm" name="passwordConfirm" class="w-full rounded-lg border-gray-200 p-4 pe-12 text-sm shadow-sm" placeholder="Re-enter password" />

				<span class="absolute inset-y-0 end-0 grid place-content-center px-4">
					<svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
						<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
						<path
							stroke-linecap="round"
							stroke-linejoin="round"
							stroke-width="2"
							d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
					</svg>
				</span>
			</div>
		</div>

		<div class="flex items-center justify-between">
			<p class="text-sm text-gray-500">
				Already have an account?
				<a class="underline" href="/login">Login</a>
			</p>
			<Button type="submit">Sign Up</Button>
		</div>
	</form>
	{#if form?.message}
		<p class="error bg-red-200 rounded-full text-red-500 my-5 text-center flex h-8 items-center justify-center gap-2.5">
			<svg fill="none" stroke="currentColor" stroke-width="1.5" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" aria-hidden="true" class="h-6 w-6 inline">
				<path stroke-linecap="round" stroke-linejoin="round" d="M12 9v3.75m9-.75a9 9 0 11-18 0 9 9 0 0118 0zm-9 3.75h.008v.008H12v-.008z" />
			</svg>{form.message || ''}
		</p>
	{/if}
</div>
