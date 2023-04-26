import requests
import json
import time
from random import *
import threading

# url = "http://pixels.codam.nl/api/single"
url = "http://localhost:5173/api/single"
headers = {'Content-Type': 'application/json',
		   'x-real-ip': 'my.amazing.fake.ip'}

data = {
	"x": 10,
	"y": 10,
	"color": [255, 0, 0, 255]
}
response = requests.post(url, headers=headers, data=json.dumps(data))

if response.status_code == 200:
	print("Send", data['x'], data['y'], data['color'], "successfully")
else:
	print("Failed to send", response.status_code, response.text)
