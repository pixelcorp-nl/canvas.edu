# Start dependencies run frontend and backend seperately
start-deps:
	docker compose up --remove-orphans --detach redis

# Starts all containers in dev mode
start:
	docker compose up --remove-orphans

# Stops all containers
down:
	docker-compose down --remove-orphans

# Lists all containers
ps:
	docker container list --no-trunc --format "table {{.Names}}\t{{.Status}}\t{{.Command}}\t{{.Ports}}"

# Print and follow logs for all containers
logs:
	docker compose logs -f --tail=1000
