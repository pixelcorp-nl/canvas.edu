<script context="module" lang="ts">
	export type Field = {
		label: string
		type: 'int' | 'float' | 'checkbox' | 'text' | 'textarea'
		value: string
		rows?: number
	}
</script>

<script lang="ts">
	import { enhance } from '$app/forms'
	import Button from './Button.svelte'
	// @ts-ignore
	import { Tooltip } from '@svelte-plugins/tooltips'

	export let fields: Field[]
	export let action = '?/default'
	export let buttonText = 'Update'

	let valueChanged = false

	function typeToButton(type: Field['type']) {
		if (type === 'int' || type === 'float') {
			return 'number'
		}
		return type
	}
</script>

<form
	method="post"
	use:enhance={() =>
		({ update }) => {
			update({ reset: false })
			valueChanged = false
		}}
	{action}>
	<table class="w-full">
		{#each fields as { label, type, value, rows }}
			<tr>
				{#if type !== 'textarea'}
					<td><label for={label}>{label}</label></td>
				{/if}
				<td colspan={type === 'textarea' ? 2 : 1}>
					{#if type === 'textarea'}
						<textarea
							id={label}
							name={label}
							class="rounded-lg border-gray-200 p-4 pe-12 text-sm shadow-sm w-full"
							{value}
							rows={rows ?? 5}
							on:input={() => (valueChanged = true)} />
					{:else}
						<input
							id={label}
							name={label}
							class="rounded-lg border-gray-200 p-4 pe-12 text-sm shadow-sm"
							type={typeToButton(type)}
							{value}
							step={type === 'float' ? 'any' : ''}
							on:input={() => (valueChanged = true)} />
					{/if}
				</td>
				<br />
			</tr>
		{/each}
		<br />

		{#if valueChanged}
			<Button type="submit" id={buttonText} enabled={valueChanged}>{buttonText}</Button>
		{:else}
			<Tooltip theme="tooltips" content="No changes to submit">
				<Button type="submit" id={buttonText} enabled={valueChanged}>{buttonText}</Button>
			</Tooltip>
		{/if}
	</table>
</form>

{#if !valueChanged}
	<slot />
{/if}

<style>
	form::placeholder {
		color: #ccc;
	}
</style>
