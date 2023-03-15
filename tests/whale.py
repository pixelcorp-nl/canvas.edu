import requests
import json
import time
import random
import copy

url = "http://api.pixels.codam.nl/"
headers = {'Content-Type': 'application/json'}

def create_whale(object, x, y):
  nobject = copy.deepcopy(object)
  for i in nobject :
    i.x += x
    i.y += y
  return nobject

class pxl:
  def __init__(self, x, y, data):
    self.x = x
    self.y = y
    self.data = data

blue = [45, 85, 255, 255]
lblue = [137, 196, 244, 255]

whale = [pxl(0, 2, blue), pxl(0, 3, lblue),
          pxl(1, 2, blue), pxl(1, 3, lblue),
          pxl(2, 2, blue), pxl(2, 3, lblue),
          pxl(3, 2, blue), pxl(3, 3, lblue),
          pxl(4, 1, blue), pxl(4, 0, blue),
          pxl(5, 1, blue)]

while True:
  x_seed = (random.random() * 195).__floor__()
  y_seed = (random.random() * 195).__floor__()
  print(x_seed, y_seed)
  random_whale = create_whale(whale, x_seed, y_seed)
  whale_dict = []
  for wh in random_whale:
    whale_dict.append(wh.__dict__)
  response = requests.post(url + 'canvas/multiple', headers=headers, data=json.dumps(whale_dict))
  if response.status_code == 200 | 201:
    print("Successfully sent data")
  else:
    print("Failed to send data", response.status_code)
  time.sleep(whale.__len__())
