<!-- Script -->
<script lang="ts">
	import { _ } from 'svelte-i18n'
	import atomOneDark from 'svelte-highlight/styles/github-dark'
	import { page } from '$app/stores'
	import Codeblock from '$components/Codeblock.svelte'
	import Opdracht from '$components/Opdracht.svelte'
	import Info from '$components/Info.svelte'

	export let data

	const apikey = $page.data['user']['user'].key
	const { x, y } = $page.data['infoPixel']
	const root = `${$page.url.protocol}//${$page.url.host}`

	const location = `(${x}:${y})`
	const code2 = `# Pixel informatie in JSON formaat.
# Deze pixel wordt rood, omdat de eerste waarde van "color" helemaal aan staat en de rest helemaal uit staat.
pixel = {'x': ${x}, 'y': ${y}, 'color': [255, 0, 0], 'key': '${apikey}' }`
	const comment1 = `Plaats een pixel op deze coordinaten (${x}:${y})`
</script>

<svelte:head>
	<title>Pixels - info</title>
	<meta name="description" content="Info on the project" />
	<!-- eslint-disable-next-line svelte/no-at-html-tags -->
	{@html atomOneDark}
</svelte:head>

<!-- <pre class="code">
	{JSON.stringify(data.user, null, 2)}
</pre> -->

<!-- HTML -->
<article class="text-column prose-md lg:prose-lg mx-auto mb-5 mt-10">
	<h2 id="over-dit-project">{$_('info.title')}</h2>
	<p><em>{$_('info.short')}</em></p>
	<h2 id="inleiding">{$_('info.header1')}</h2>
	<p>{$_('info.content1')}</p>
	<Info content= {$_('info.info1')} />
	<p>{$_('info.codeEnvironment')} <a href="https://trinket.io/embed/python3" target="_blank" class="text-white bg-orange-700 hover:bg-red-800 focus:ring-4 focus:ring-orang-300 font-medium rounded-lg text-sm px-5 py-2.5 dark:bg-orange-600 dark:hover:bg-orange-700 focus:outline-none dark:focus:ring-orange-800">Trinket</a></p>

	<!-- Basics -->
	<Codeblock code={data.comment} />
	<p>{$_('info.helloworld')}</p>
	<Codeblock code={data.helloworld} />
	<Opdracht
		content="Kopier dit stukje code en run het in de browser. Kijk nu waar de tekst die we willen printen op het
		scherm verschijnt." />
	<p>{$_('info.variables')}</p>
	<Codeblock code={data.printx} />

	<!-- Basics | Math -->
	<p>{$_('info.math')}</p>
	<Codeblock code={data.addition} />
	<Opdracht content={$_('exercise.addition')} />

	<!-- First pixel -->
	<h3 id="color">{$_('info.header2')}</h3>
	<p>{$_('info.putPixel')}</p>
	<Codeblock code={$_('code.python.putPixel')} />
	<Opdracht content={$_('exercise.putPixel')} />
	<Opdracht content="{$_('exercise.putPixel2')} {location} "/>

	<!-- Colors -->
	<h3 id="een-wijziging-aanbrengen-op-het-canvas">{$_('header.color')}</h3>
	<p>{$_('info.color1')}</p>
	<p>{$_('info.color2')}</p>
	<p>{$_('info.color3')}</p>

	<p class="bg-blue-100 p-2 rounded-lg">
		<span class="bg-yellow text-blue-500 font-semibold">ℹ️ Tip:</span> Als je er niet uikomt kijk hoe anderen het voor elkaar krijgen.
	</p>
	<Codeblock code={code2} />
	<Opdracht content="Plaats een gekleurde pixel op het canvas" />
	<Opdracht content="Plaats een roze, oranje, paarse en lichtgroene pixel op het canvas" />
	<Opdracht content="Plaats 2 pixels op het canvas door één keer het script te runnen." />

	<!-- Loops -->
	<h3 id="loops">Loops</h3>
	<p>{$_('info.loops1')}</p>
	<p>{$_('info.loops2')}</p>
	<Codeblock code={data.loop} />
	<Info content="{$_('info.indentation')}" />
	<Opdracht content="{$_('exercise.loop')}" />
	<p>{$_('info.functions1')}</p>
	<Codeblock code={data.func} />
	<p>{$_('info.functions2')}</p>
	<Opdracht content="{$_('exercise.functions1')}" />
	<Codeblock code={data.prototype} />
	<Opdracht content="{$_('exercise.functions2')}" />
	<Opdracht content="{$_('exercise.functions3')}" />

	<!-- Extra -->
	<h3>{$_('header.extra')}</h3>

	<p>{$_('info.extra1')}</p>
	<Opdracht content="{$_('exercise.extra1')}" />
	<Opdracht content="{$_('exercise.extra2')}" />
	<Info content="{$_('info.challenges')}" />
</article>
