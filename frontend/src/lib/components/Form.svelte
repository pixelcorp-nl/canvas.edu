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

	function typeToStep(type: Field['type']) {
		if (type === 'float') {
			return 'any'
		}
		return ''
	}
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
		({ update }) =>
			update({ reset: false })}>
	{#each fields as { label, type, value }}
		<label for={label}>{label}</label>
		<input
			class="rounded-lg border-gray-200 p-4 pe-12 text-sm shadow-sm"
			name={label}
			type={typeToButton(type)}
			{value}
			step={typeToStep(type)}
			on:input={() => (valueChanged = true)} />
	{/each}
	<br />
	<Button type="submit" enabled={valueChanged}>Update</Button>
</form>

<style>
	form::placeholder {
		color: #ccc;
	}
</style>
