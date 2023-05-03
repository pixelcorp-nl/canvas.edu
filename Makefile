# Start dependencies run frontend and backend seperately
start-deps:
	docker compose up --remove-orphans --build --detach redis

# Starts all containers
start:
	docker compose up --remove-orphans --build

# Starts all containers detached
start-detached:
	docker compose up --remove-orphans --build --detach

# Wait for services to start
wait-for-healthcheck: SHELL:=/bin/bash
wait-for-healthcheck:
	until [ "$$(docker inspect -f {{.State.Health.Status}} frontend)" = "healthy" ]; do sleep 0.5; echo -n .; done

# Stops all containers
down:
	docker-compose down --remove-orphans --timeout 4

# Run tests
test:
	docker compose up --remove-orphans --build --detach
	(cd frontend && pnpm run test)

# Lists all containers
ps:
	docker container list --no-trunc --format "table {{.Names}}\t{{.Status}}\t{{.Command}}\t{{.Ports}}"

# Print and follow logs for all containers
logs:
	docker compose logs -f --tail=1000
docker inspect --format='{{json .State.Health}}' db
