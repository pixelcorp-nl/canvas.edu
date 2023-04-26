#!/bin/bash

URL="https://raw.githubusercontent.com/pixelcorp-nl/canvas.edu/main/deployment/docker-compose.yaml"
LOCAL_FILE_PATH="/root/docker-compose.yaml"


wget -N $URL -P $(dirname $LOCAL_FILE_PATH)

if ! cmp -s $LOCAL_FILE_PATH $(basename $URL); then
	echo "The downloaded file is different from the local file."
	echo "Running 'docker compose up (...)"
	docker compose up -d --remove-orphans
else
	echo "The downloaded file is the same as the local file."
fi
