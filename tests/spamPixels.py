import requests
import json
import time
from random import *
import threading

url = "http://pixels.codam.nl/api/single"
# url = "http://localhost:5173/api/single"
headers = {'Content-Type': 'application/json',
		   'x-real-ip': 'my.amazing.fake.ip'}

threads = 10
def run():
	total = 0
	while True:
		x_start = randint(0, 160)
		y_start = randint(0, 160)
		color = [randint(20, 255), randint(20, 255), randint(20, 255), 255]

		for x in range(x_start, x_start + 30):
			for y in range(y_start, y_start + 30):
				data = {
					"x": x,
					"y": y,
					"color": color
				}
				total += 1
				response = requests.post(url, headers=headers, data=json.dumps(data), timeout=10)
				if response.status_code != 200:
					print("Failed to send", response.status_code)
			print("Sent", total * threads, "pixels")
					# exit(1)

for _ in range(threads):
	threading.Thread(target=run).start()