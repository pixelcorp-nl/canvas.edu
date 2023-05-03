# Start dependencies run frontend and backend seperately
start-deps:
	docker compose up --remove-orphans --build --detach redis

# Starts all containers
start:
	docker compose up --remove-orphans --build

# Starts all containers detached
start-detached:
	docker compose up --remove-orphans --build --detach

# Stops all containers
down:
	docker-compose down --remove-orphans --timeout 4

test:
	docker compose up --remove-orphans --build --detach
	(cd frontend && pnpm run test)
# Lists all containers
ps:
	docker container list --no-trunc --format "table {{.Names}}\t{{.Status}}\t{{.Command}}\t{{.Ports}}"

# Print and follow logs for all containers
logs:
	docker compose logs -f --tail=1000
