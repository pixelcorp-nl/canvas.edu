<script context="module" lang="ts">
	export type Field = {
		label: string
		type: 'int' | 'float' | 'checkbox' | 'text'
		value: string
	}
</script>

<script lang="ts">
	import { enhance } from '$app/forms'
	import Button from './Button.svelte'

	export let fields: Field[]
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
		}}>
	{#each fields as { label, type, value }}
		<label for={label}>{label}</label>
		<input
			id={label}
			name={label}
			class="rounded-lg border-gray-200 p-4 pe-12 text-sm shadow-sm"
			type={typeToButton(type)}
			{value}
			step={type === 'float' ? 'any' : ''}
			on:input={() => (valueChanged = true)} />
	{/each}
	<br />
	<Button type="submit" enabled={valueChanged}>Update</Button>
</form>

{#if !valueChanged}
	<slot />
{/if}

<style>
	form::placeholder {
		color: #ccc;
	}
</style>
