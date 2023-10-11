import requests
import json
import time
from random import *
import threading

url = "https://pixelcorp.nl/api/single"
# url = "http://localhost:5173/api/single"
headers = {'Content-Type': 'application/json'}

def put():
	data = {
		"x": round(random() * 199),
		"y": round(random() * 199),
		"color": [255, 0, 0],
		"key": "joppe"
	}
	try:
		response = requests.post(url, headers=headers, data=json.dumps(data), timeout=3)
		if response.status_code == 200:
			print("Send", data['x'], data['y'], data['color'], "successfully")
		else:
			print("Failed to send", response.status_code, response.text)
	except:
		print("Failed to send")

def put_infinite():
	while True:
		put()

threads = list()
for index in range(20):
	x = threading.Thread(target=put_infinite)
	threads.append(x)
	x.start()
print("Started", len(threads), "threads")

for index, thread in enumerate(threads):
	thread.join()