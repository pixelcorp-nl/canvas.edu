import requests
import json

# Dit is de url van de server waar we depixels heensturen.
url = "http://localhost:5173/api/single"
headers = {'Content-Type': 'application/json'}

# Dit is een functie.
# Deze functie gaan we straks gebruiken om een pixel te sturen naar het canvas.
def sendPixel(pixel):
    response = requests.post(url, headers=headers, data=json.dumps({**pixel, 'key': 'joppe'}))
    print(response.content)

# Eerst gaan we een pixel aanmaken.
# Dit is een variabele die de volgende informatie bevat.
#    x: het x coordinaat waar we de pixel willen plaatsen.
#    y: het y coordinaat waar we de pixel willen plaatsen.
#    color: de kleur dat de pixel moet worden in RGB.
pixel = {'x': 191, 'y': 137, 'color': [255, 0, 0]}

# Door deze pixel variabele mee te geven aan de sendPixel functie wordt hij naar de server verstuurd.
sendPixel(pixel)
