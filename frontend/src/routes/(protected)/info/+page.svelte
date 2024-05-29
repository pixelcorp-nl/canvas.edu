<!-- Script -->
<script lang="ts">
	export const csr = true
	import { _ } from 'svelte-i18n'
	import atomOneDark from 'svelte-highlight/styles/github-dark'
	import { page } from '$app/stores'
	import Codeblock from '$components/Codeblock.svelte'
	import Opdracht from '$components/Opdracht.svelte'
	import Info from '$components/Info.svelte'
	import Trinket from '$components/Trinket.svelte'

	const apikey = $page.data['user']['user'].key
	const { x, y } = $page.data['infoPixel']
	const root = `url = "${$page.url.protocol}//${$page.url.host}/api/single"`
	const location = `(${x}:${y})`
	const pixel = `pixel = {'x': ${x}, 'y': ${y}, 'color': [255, 0, 0]}`
	const sendPixel = `    response = requests.post(url, headers=headers, data=json.dumps({**pixel, 'key': '${apikey}'}))`
</script>

<svelte:head>
	<title>Pixels - info</title>
	<meta name="description" content="Info on the project" />
	<!-- eslint-disable-next-line svelte/no-at-html-tags -->
	{@html atomOneDark}
</svelte:head>

<!-- HTML -->
<article class="text-column prose prose-md lg:prose-lg mx-auto mb-5 mt-10">
	<h2 id="over-dit-project">{$_('info.title')}</h2>
	<p><em>{$_('info.short')}</em></p>
	<h2 id="inleiding">{$_('info.header1')}</h2>
	<p>{$_('info.content1')}</p>
	<Info content={$_('info.info1')} />
	<Trinket content={$_('trinket')} />
	<!-- <div class="rounded-lg bg-white p-4 flex justify-between">
		{$_('info.codeEnvironment')}
		<a href="https://trinket.io/embed/python3" target="_blank" class="">Trinket</a>
	</div> -->

	<!-- Basics -->
	<Codeblock code={$_('code.python.comment1')} />
	<p>{$_('info.helloworld')}</p>
	<Codeblock code={$_('code.python.helloworld')} />
	<Opdracht content={$_('exercise.helloworld')} />
	<p>{$_('info.variables')}</p>
	<Codeblock code={$_('code.python.printx')} />

	<!-- Basics | Math -->
	<p>{$_('info.math')}</p>
	<Codeblock code={$_('code.python.addition')} />
	<Opdracht content={$_('exercise.addition')} />

	<!-- First pixel -->
	<h3 id="color">{$_('info.header2')}</h3>
	<p>{$_('info.putPixel')}</p>
	<Codeblock code="{$_('code.python.putPixel1')}{root}{$_('code.python.putPixel2')}{sendPixel}{$_('code.python.putPixel3')}{pixel}{$_('code.python.putPixel4')}" />
	<Opdracht content={$_('exercise.putPixel')} />
	<Opdracht content="{$_('exercise.putPixel2')} {location} " />

	<!-- Colors -->
	<h3 id="een-wijziging-aanbrengen-op-het-canvas">{$_('header.color')}</h3>
	<p>{$_('info.color1')}</p>
	<p>{$_('info.color2')}</p>
	<p>{$_('info.color3')}</p>

	<Info content={$_('hint.colab')} />
	<Codeblock code="{$_('code.python.color')}{pixel}" />
	<Opdracht content={$_('exercise.color1')} />
	<Opdracht content={$_('exercise.color2')} />
	<Opdracht content={$_('exercise.color3')} />

	<!-- Loops -->
	<h3 id="loops">Loops</h3>
	<p>{$_('info.loops1')}</p>
	<p>{$_('info.loops2')}</p>
	<Codeblock code={$_('code.python.loop')} />
	<Info content={$_('info.indentation')} />
	<Opdracht content={$_('exercise.loop')} />
	<p>{$_('info.functions1')}</p>
	<Codeblock code={$_('code.python.function')} />
	<p>{$_('info.functions2')}</p>
	<Opdracht content={$_('exercise.functions1')} />
	<Codeblock code={$_('code.python.prototypes')} />
	<Opdracht content={$_('exercise.functions2')} />
	<Opdracht content={$_('exercise.functions3')} />

	<!-- Extra -->
	<h3>{$_('header.extra')}</h3>

	<p>{$_('info.extra1')}</p>
	<Opdracht content={$_('exercise.extra1')} />
	<Opdracht content={$_('exercise.extra2')} />
	<Info content={$_('info.challenges')} />
</article>
