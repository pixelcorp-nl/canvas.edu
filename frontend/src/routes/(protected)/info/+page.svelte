<!-- Script -->
<script lang="ts">
	import Highlight from 'svelte-highlight'
	import python from 'svelte-highlight/languages/python'
	import json from 'svelte-highlight/languages/json'
	import { _ } from 'svelte-i18n'
	import atomOneDark from 'svelte-highlight/styles/atom-one-dark'
	import CopyButton from '$components/CopyButton.svelte'
	import { page } from '$app/stores'

	const apikey = $page.data['user'].apikey
	const root = `${$page.url.protocol}//${$page.url.host}`
	const jsonExample = `{
	"x": 42,
	"y": 42,
	"color": [255, 0, 0, 255], // rgba
	"key": "${apikey}"
}`

	const code = `import requests
import json

# Define the URL of the API endpoint and the request headers
url = '${root}/api/single'
headers = {'Content-Type': 'application/json'}

# Define the pixel data as a Python dictionary
pixel = {'x': 42, 'y': 42, 'color': [0, 25, 255, 255], 'key': '${apikey}' }

# Send a POST request to the API endpoint with the pixel data as JSON
response = requests.post(url, headers=headers, data=json.dumps(pixel))

# Check if the request was successful
if response.ok:
    # If the request was successful, print a success message
    print("Pixel successfully changed!")
else:
    # If the request was unsuccessful, print an error message that includes the HTTP status code
    print("Failed to change pixel:", response.status_code)
`
</script>

<svelte:head>
	<title>Pixels - information</title>
	<meta name="description" content="Info on the project" />
	<!-- eslint-disable-next-line svelte/no-at-html-tags -->
	{@html atomOneDark}
</svelte:head>

<!-- <pre class="code">
	{JSON.stringify(data.user, null, 2)}
</pre> -->

<!-- HTML -->
<article class="text-column prose lg:prose-lg mx-auto mb-5 mt-10">
	<div>
		<h1 class="font-bold text-3xl">{$_('info.title')}</h1>
		<blockquote class="text-sm font-light">
			{$_('info.subtitle')}
		</blockquote>
	</div>
	<h2 class="text-xl font-semibold">{$_('info.header1')}</h2>
	<p>
		{$_('info.content1')}
	</p>
	<h2 class="text-xl font-semibold">{$_('info.header2')}</h2>
	<p>
		{$_('info.content2')}
	</p>
	<h2 class="text-xl font-semibold">{$_('info.header4')}</h2>
	<p>
		{$_('info.content4')}
	</p>
	<div class="flex flex-col mt-2">
		<div class="flex justify-between h-16 -my-1 items-center bg-slate-100 rounded-t-xl">
			<span class="font-semibold ml-2.5">{$_('code.json.title')}</span>
			<CopyButton code={jsonExample} />
		</div>
		<Highlight class="bg-[#282c34] !m-0 transition-all duration-1000" language={json} code={jsonExample} />
	</div>
	<h2 class="text-xl font-semibold">{$_('info.header5')}</h2>
	<p>
		{$_('info.content5')}
	</p>
	<div class="flex flex-col">
		<div class="flex justify-between h-16 -my-1 items-center bg-slate-100 rounded-t-xl">
			<span class="font-semibold ml-2.5">{$_('code.python.title')}</span>
			<CopyButton {code} />
		</div>
		<Highlight class="bg-[#282c34] !m-0 transition-all duration-1000" language={python} {code} />
	</div>
</article>
