# Deployment
This directory contains all scrips and config files required to run this project on a server with minimal setup

# Deploying
`git clone --depth=1 git@github.com:pixelcorp-nl/canvas.edu.git`
create `.env` file in the `canvas.edu.git/deployment` folder
`docker-compose -f canvas.edu.git/deployment/docker-compose.prod.yaml up -d`
