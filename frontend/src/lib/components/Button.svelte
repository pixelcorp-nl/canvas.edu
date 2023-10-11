<script lang="ts">
	export let type: 'submit' | 'reset' | undefined
	export let enabled = true
	export let id = ''
</script>

<button disabled={!enabled} {type} {id}>
	<slot />
</button>

<style>
	button {
		border-radius: 0.5rem;
		background-color: #f2ac93;
		border-width: 1px;
		transition-property: all;
		transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1);
		transition-duration: 120ms;
		padding-left: 1.25rem;
		padding-right: 1.25rem;
		padding-top: 0.75rem;
		padding-bottom: 0.75rem;
		font-size: 0.875rem;
		line-height: 1.25rem;
	}
	button:hover {
		background-color: #a45949;
	}
	button:disabled {
		border-color: rgb(107, 114, 128);
		background-color: white;
	}
	button:disabled:hover {
		text-decoration: line-through;
	}
	button:focus {
		background-color: #f2ac93;
		scale: 0.97;
	}
</style>
