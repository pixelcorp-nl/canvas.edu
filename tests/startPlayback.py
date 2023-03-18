import requests
import json
import time

# url = "http://api.pixels.codam.nl"
url = "http://localhost:3000"
code = "4d720f1b"
url = url + f"/admin/playback?code=" + code
headers = {'Content-Type': 'application/json',
           'x-real-ip': 'my.amazing.fake.ip'}

class pxlInfo:
  def __init__(self, width, height, data):
    self.width = width
    self.height = height
    self.data = data

x, y = 20, 80 # starting coordinates
data = pxlInfo(x, y, [0, 33, 255, 255])
response = requests.post(url, headers=headers)

if response.status_code == 200 | 201:
  print("Successfully sent data")
else:
  print("Failed to send data", response.status_code)