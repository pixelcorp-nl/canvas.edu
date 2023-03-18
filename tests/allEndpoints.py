import requests
import json
import time

# url = "http://localhost:3000/"
url = "http://api.pixels.codam.nl/"

headers = {'Content-Type': 'application/json'}

# place pixel
# response = requests.post(url + 'canvas/single', headers=headers, data=json.dumps({'x': 10, 'y': 8, 'data': [255, 0, 0, 255]}))
# print(response, response.content)
# 201 (creation of recourse), could return 200 instead with 204 (no content)

# # set timeout
# code = '4f385d17' #set code from backend here
# timeout = 42
# timeoutQuery = f'?time={timeout}&code=' + code
# response = requests.post(url + 'admin/timeout' + timeoutQuery, headers=headers)
# print(response, response.content)
# # 201 (creation of recourse), could return 200 instead with 204 (no content)

# # set/change username
# new_username = 'username'
# response = requests.post(url + 'canvas/nameUser/' + new_username, headers=headers)
# print(response, response.content)
# # 201, apropriate status code

# # get Pixelinfo
# x = 100
# y = 100
# pXquery = f'?x={x}&y={y}'
# print(pXquery)
# response = requests.get(url + 'canvas/coordinates' + pXquery, headers=headers)
# print(response, response.content)
# # 200, apropriate status code

# get myPixels
# response = requests.get(url + 'canvas/myPixels', headers=headers)
# # print(response, response.content)
# # returned nothing (weird)

# get allPixels
response = requests.get(url + 'canvas/allPixels', headers=headers)
print(response, response.content)
# returned everything (succes)

# backend is still alive
