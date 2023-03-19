import requests
import json
import time

url = "http://api.pixels.codam.nl"
# url = "http://localhost:3000"
code = "34ad6213"
url = url + f"/admin/playback?code=" + code
headers = {'Content-Type': 'application/json',
           'x-real-ip': 'my.amazing.fake.ip'}

response = requests.post(url, headers=headers)

if response.status_code == 200 | 201:
  print("Successfully sent data")
else:
  print("Failed to send data", response.status_code)