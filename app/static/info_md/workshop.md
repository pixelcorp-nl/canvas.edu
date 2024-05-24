# About

Today we are going to play around on a shared digital canvas.
You will be able to add this canvas by writing code only.
Every participant today will have access to **the same** digital canvas, which you can view at **/canvas**.
You do not need to have any coding experience before you start the workshop.

Let's create pixel art together!

# Python

We will be using python today.
Python is often used as a beginner language because it is high level and very powerful.

# Code where?

We will use [trinket](https://trinket.io/embed/python3) to write code.
The big box on the left is for writting code and the box on the right will print any output.
When you have create your first code you can run it in trinket with the **Run** button

# Printing

Printing on the standard output (the big box on the right in trinket) is quite easy.

```Python
# print a string (words)
print("hello")
# or print a number
print(14)
# maybe print both?
print("number: ", 5)
```

Lets try it!

# Placing a pixel!

The next step is placing a single pixel on the canvas.
We will provide the code for placing the pixel but you will need to edit it if you want to have a different color or location!

:::exercise

:::

```python
import requests
import json

# Dit is de url van de server waar we depixels heensturen.
url = 'https://canvas.pixelcorp.nl/api/single'
headers = {'Content-Type': 'application/json'}

def sendPixel(pixel):
    # Hier wordt de pixelinformatie naar de server verstuurd.
    # We gebruiken hiervoor de post functie uit de requests bibliotheek
    response = requests.post(url, headers=headers, data=json.dumps({**pixel, 'key': 'FZEXOCXU'}))
 
    print(response.content)

# create a variable with the pixel information
    # contains x and y coordiantes
    # and a color in RGB (google this)
pixel = {'x': 152, 'y': 64, 'color': [0, 25, 255]}
# Send the pixel using the funciton we defined above.
sendPixel(pixel)
```

# Colors

:::exercise
Place a pixel on the canvas in different colors:
- light green
- purple
- red
- orange
:::

# For loop

We have a for loop

:::exercise
Make a line on the canvas using a for loop.
:::

:::exercise
Create a square.
:::

# Funcitons



# Math

// use math lib
// you can do some advanced stuff with this

:::exercise
Create a circle.
:::
