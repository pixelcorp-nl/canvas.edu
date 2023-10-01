## Over dit project
*Op dit digitale canvas is het alleen mogelijk om pixels te plaatsen door middel van code.*
*Tijdens deze workshop gaan we code schrijven om het canvas te bewerken en samen een kunstwerk te maken.*

## Inleiding
In dit project leren we hoe we een pixel op een canvas kunnen veranderen en ervoor zorgen dat iedereen de veranderingen in realtime kan zien.
We gaan berichten naar een server sturen die zal de verandering uitvoeren op het canvas.
De berichten worden opgesteld in JSON, dit is een manier om data te weergeven op een manier dat mensen en computers het kunnen gebruiken.

###
De opdrachten gaan er vannuit dat er geen voorkennis over programmeren is.

er is bij elke opdracht een voorbeeld wat gekopieerd mag worden.

```python
# De # aan het begin van deze regel geeft aan dat dit een comment is.
# Comments worden niet uitgevoerd wanneer we een script runnen.
# Ze zijn wel heel handig voor onszelf om aan te geven waarom we iets hebben gedaan!
```

Als eerste gaan we het allerkleinste script maken wat er bestaat.

[] Opdracht:
    Kopier dit stukje code en run het in de browser.
    Kijk nu waar de tekst die we willen printen op het scherm verschijnt.
```python
# Dit is de print functie, deze kan infomatie weergeven en een venster wat wij de console noemen.
print("hello world!")
```

In scripts moeten we de computer vaak informatie kort laten onthouden.
Dit doen we met variablen, het volgende voorbeeld laat zien hoe dat in zijn werk gaat.
```python
x = 42
print(x)
```

Variabelen zijn erg handig omdat je er ook mee kan rekenen.
[] Opdracht:
    Voeg de volgende regel toe aan het bovenstaande script zodat er 43 in de console wordt geprint.
```python
x = x + 1
```

### Een wijziging aanbrengen op het canvas
We gaan nu een pixel plaatsen op het canvas met behulp van python code en de python requests bibliotheek.
We hebben hier een voorbeeld dat 1 pixel zal veranderen op het canvas.

```python
# Dit is de url van de server waar we depixels heensturen.
url = 'https://pixels.joppekoers.nl/api/single'
headers = {'Content-Type': 'application/json'}

# Pixel informatie in JSON formaat.
pixel = {'x': 42, 'y': 42, 'color': [0, 25, 255], 'key': 'KRVKIWWW' }

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
```

[] Opdracht:
    Kopier de code en controleer of we een pixel op het canvas hebben geplaatst nadat je het uitgevoerd hebt.

[] Opdracht:
    Plaats een pixel op deze coordinaten (x:y)

**Tip** Als je er niet uikomt kijk hoe anderen het voor elkaar krijgen.

In het programmeren kan je verschillende kleuren maken door 3 verschillende basiskleuren te mengen. Door een kleur sterker of minder sterk naar voren te laten komen kan je alle kleuren maken.

De kleuren die we gebruiken zijn RGB: rood, groen en blauw.
een waarde van 0 betekend dat de kleur bijna niet voorkomt en de hoogste waarde van 255 betekend dat de kleur helemaal aan staat.

```python
# Pixel informatie in JSON formaat.
# Deze pixel wordt rood, omdat de eerste waarde van "color" helemaal aan staat en de rest helemaal uit staat.
pixel = {'x': 42, 'y': 42, 'color': [255, 0, 0], 'key': 'KRVKIWWW' }
```

[] Opdrachten:
    - Plaats een blauwe pixel op het canvas.
    - Plaats een roze, oranje, paarse en lichtgroene pixel op het canvas.

[] Opdracht (optioneel):
    Plaats 2 pixels op het canvas door 1x het script te runnen.

Tot nog toe hebben we om meer pixels te plaatsen het script aangepast of de code gekopieerd en onder elkaar geplakt.
Dit is niet heel handig en als we een lijn willen maken moeten we bijvoorbeeld 10x het script veranderen en aanzetten.

Bij de volgende opdracht gaan we gebruik maken van een for loop om meerdere pixels te plaatsen terwijl we het script maar 1x aan hoeven te zetten.

```python
# Dit script gebruikt een for loop om 1 tot en met 10 te printen.
for i in range(0, 10):
    # Alles wat op deze indentatie staat valt in de for loop.
    p = i + 1
    print(p)

# Zodra er weer iets zonder extra indentatie staat valt het buiten de for loop.
print("buiten de for loop")
```

[] Opdracht:
    - Wat gebeurt er wanneer de print("buiten de for loop") ook evenveel indentatie heeft als de instructies in de for loop?
    - Gebruik een for loop om een lijn van 10 pixels te plaatsen.

Tot nu toe hebben we alleen functies gebruikt die door andere mensen gemaakt zijn. Python laat ons ook zelf nieuwe functies maken, dit is heel handig, omdat we zo code heel makkelijk kunnen hergebruiken.

```python
# Het keyword def geeft aan dat we een eigen functie maken
# tussen de haakjes staat world, dit is een variabel die we mee kunnen geven die in de functie gebruikt kan worden.
def hallo_wereld(world):
    print("hello world:", world, "!")

hallo_wereld("aarde")
```

In ons script is het handig om een paar hulp functies te maken zodat het script overzichtelijk blijft.

[] Opdracht:
    Maak de functies met de volgende prototypen:
```python
# key is de key die we ook in het eerdere voorbeel hebben gebruikt.
def put_pixel(x, y, color, key)

# len is het aantal pixels dat de lijn lang is.
def create_horizontal_line(x, y, color, len, key)
```

[] Opdracht:
    - Maak een vierkant op het canvas
    - Maak een functie die een vierkant kan tekenen 

Vrij tekenen op het canvas

Extra opdrachten:
    - Maak een functie die een kleine walvis op het canvas kan plaatsen op een random locatie.
    - Maak een realistisch voorwerp enkel uit vierkanten (bv een boom of auto)
    - Maak een circel
    - Vraag een extra challenge aan Joppe.
