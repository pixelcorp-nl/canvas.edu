# Deployment
This directory contains all scrips and config files required to run this project on a server with minimal setup

# Deploying
`git clone --depth=1 git@github.com:pixelcorp-nl/canvas.edu.git`
`mv canvas.edu/deployment/* .`
create `.env` file in the `deployment` folder
`docker-compose -f deployment/docker-compose.prod.yaml up -d`
