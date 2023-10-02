<!-- Script -->
<script lang="ts">
	import { _ } from 'svelte-i18n'
	import atomOneDark from 'svelte-highlight/styles/github-dark'
	import { page } from '$app/stores'
	import Codeblock from '$components/Codeblock.svelte'
	import Opdracht from '$components/Opdracht.svelte'

	export let data

	let x = Math.random() * 200
	x = Math.round(Math.max(0, Math.min(x, 199)))
	let y = Math.random() * 200
	y = Math.round(Math.max(0, Math.min(y, 199)))

	console.log(data)

	const apikey = $page.data['user'].apikey
	const root = `${$page.url.protocol}//${$page.url.host}`

	const code = `import requests
import json

# Dit is de url van de server waar we depixels heensturen.
url = '${root}/api/single'
headers = {'Content-Type': 'application/json'}

# Pixel informatie in JSON formaat.
# De "key" bevat een geheime code die voor iedereen uniek is.
# Zo weet de server wie welke pixel gestuurd heeft.
pixel = {'x': ${x}, 'y': ${y}, 'color': [0, 25, 255], 'key': '${apikey}' }

# Hier wordt de pixelinformatie naar de server verstuurd.
# We gebruiken hiervoor de post functie uit de requests bibliotheek
response = requests.post(url, headers=headers, data=json.dumps(pixel))

# Hier wordt het resultaat geprint zodat we weten of ons script succesvol is uitgevoerd.
if response.ok:
    # If the request was successful, print a success message
    print("Pixel successfully changed!")
else:
    # If the request was unsuccessful, print an error message that includes the HTTP status code
    print("Failed to change pixel:", response.content)
`
	const code2 = `# Pixel informatie in JSON formaat.
# Deze pixel wordt rood, omdat de eerste waarde van "color" helemaal aan staat en de rest helemaal uit staat.
pixel = {'x': ${x}, 'y': ${y}, 'color': [255, 0, 0], 'key': '${apikey}' }`
	const comment1 = `Plaats een pixel op deze coordinaten (${x}:${y})`
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
	<h2 id="over-dit-project">Over dit project</h2>
	<p>
		<em>Op dit digitale canvas is het alleen mogelijk om pixels te plaatsen door middel van code.</em>
		<em>Tijdens deze workshop gaan we code schrijven om het canvas te bewerken en samen een kunstwerk te maken.</em>
	</p>
	<h2 id="inleiding">Inleiding</h2>
	<p>
		In dit project leren we hoe we een pixel op een canvas kunnen veranderen en ervoor zorgen dat iedereen de veranderingen in realtime kan zien. We gaan berichten naar een server
		sturen die zal de verandering uitvoeren op het canvas. De berichten worden opgesteld in JSON, dit is een manier om data te weergeven op een manier dat mensen en computers het
		kunnen gebruiken.
	</p>
	<blockquote>De opdrachten gaan er vannuit dat er geen voorkennis over programmeren is.</blockquote>
	<p>Alle voorbeelden mogen gekopieerd worden! De code kan worden gerunt op deze website (<a href="https://trinket.io/embed/python3">https://trinket.io/embed/python3</a>).</p>

	<Codeblock code={data.comment} />
	<p>Als eerste gaan we het allerkleinste script maken wat er bestaat.</p>
	<Opdracht
		content="Kopier dit stukje code en run het in de browser. Kijk nu waar de tekst die we willen printen op het
		scherm verschijnt." />
	<Codeblock code={data.helloworld} />
	<p>In scripts moeten we de computer vaak informatie kort laten onthouden. Dit doen we met variablen, het volgende voorbeeld laat zien hoe dat in zijn werk gaat.</p>
	<Codeblock code={data.printx} />
	<p>Variabelen zijn erg handig omdat je er ook mee kan rekenen.</p>

	<Opdracht content="Voeg de volgende regel toe aan het bovenstaande script zodat er 43 in de console wordt geprint." />
	<Codeblock code={data.addition} />
	<h3 id="een-wijziging-aanbrengen-op-het-canvas">Een wijziging aanbrengen op het canvas</h3>
	<p>
		We gaan nu een pixel plaatsen op het canvas met behulp van python code en de python requests bibliotheek. We hebben hier een voorbeeld dat 1 pixel zal veranderen op het canvas.
	</p>
	<Codeblock {code} />
	<Opdracht
		content="Kopier de code en controleer of we een pixel op het canvas hebben geplaatst nadat je het uitgevoerd
	hebt." />
	<Opdracht content={comment1} />
	<p>
		In het programmeren kan je verschillende kleuren maken door 3 verschillende basiskleuren te mengen. Door een kleur sterker of minder sterk naar voren te laten komen kan je alle
		kleuren maken.
	</p>
	<p>
		De kleuren die we gebruiken zijn RGB: <span class="text-red-900">rood</span>, groen en blauw. een waarde van 0 betekend dat de kleur bijna niet voorkomt en de hoogste waarde
		van 255 betekend dat de kleur helemaal aan staat.
	</p>
	<p class="bg-blue-100 p-2 rounded-lg">
		<span class="bg-yellow text-blue-500 font-semibold">ℹ️ Tip:</span> Als je er niet uikomt kijk hoe anderen het voor elkaar krijgen.
	</p>
	<Codeblock code={code2} />
	<Opdracht content="Plaats een gekleurde pixel op het canvas" />
	<Opdracht content="Plaats een roze, oranje, paarse en lichtgroene pixel op het canvas" />
	<Opdracht content="Plaats 2 pixels op het canvas door één keer het script te runnen." />
	<p>
		Tot nog toe hebben we om meer pixels te plaatsen het script aangepast of de code gekopieerd en onder elkaar geplakt. Dit is niet heel handig en als we een lijn willen maken
		moeten we bijvoorbeeld 10x het script veranderen en aanzetten.
	</p>
	<p>Bij de volgende opdracht gaan we gebruik maken van een for loop om meerdere pixels te plaatsen terwijl we het script maar 1x aan hoeven te zetten.</p>
	<Codeblock code={data.loop} />
	<Opdracht content="Wat gebeurt er wanneer de print functie buiten de loop ook evenveel indentatie heeft als de instructies in de for loop? (een tab)" />
	<Opdracht content="Gebruik een for loop om een lijn van 10 pixels te plaatsen." />
	<p>
		Tot nu toe hebben we alleen functies gebruikt die door andere mensen gemaakt zijn. Python laat ons ook zelf nieuwe functies maken, dit is heel handig, omdat we zo code heel
		makkelijk kunnen hergebruiken.
	</p>
	<Codeblock code={data.func} />
	<p>In ons script is het handig om een paar hulp functies te maken zodat het script overzichtelijk blijft.</p>
	<Opdracht content="Maak functies met de prototypen in het voorbeeld hieronder." />
	<Codeblock code={data.prototype} />
	<Opdracht content="Maak een vierkant op het canvas." />
	<Opdracht content="Maak een functie die een vierkant kan tekenen." />
	<h3>Vrij tekenen</h3>

	<p>Vanaf nu mag je alles doen wat je wilt. Hieronder zijn wat optionele eind opdrachten voor als je iets verder wilt gaan dan wat we in de opdrachten hiervoor hebben gedaan.</p>
	<Opdracht content="Maak een functie die een kleine walvis op het canvas kan plaatsen op een random locatie." />
	<Opdracht content="Maak een realistisch voorwerp enkel uit vierkanten (bijvoorbeeld een boom of auto)" />

	<blockquote>Voor een extra challenge vraag aan Joppe!</blockquote>
</article>
