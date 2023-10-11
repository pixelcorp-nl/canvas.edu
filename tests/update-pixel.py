import requests
import json
import time
from random import *
import threading
from time import sleep

# url = "https://pixelcorp.nl/api/single"
url = "http://localhost:5173/api/single"
headers = {'Content-Type': 'application/json',}

data = {
	"x": 10,
	"y": 10,
	"color": [255, 0, 0],
	"key": "joppe"
}
while True:
	response = requests.post(url, headers=headers, data=json.dumps(data), timeout=3)

	print (response.content)
	sleep(0.5)
