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
wait-for-healthcheck: $(eval SHELL:=/bin/bash)
	while [ 1 ]; do \
		STATUS=$$(docker inspect -f {{.State.Health.Status}} frontend); \
		echo "$$STATUS"; \
		[[ "$$STATUS" = "unhealthy" ]] && sleep 1 && docker compose logs && exit 1; \
		[[ "$$STATUS" = "healthy" ]] && exit 0; \
		sleep 1; \
	done;

# Stops all containers
down:
	docker-compose down --remove-orphans --timeout 4

# Run tests
test:
	docker compose up --remove-orphans --build --detach
	(cd frontend && npm run test)

# Lists all containers
ps:
	docker container list -a --no-trunc --format "table {{.Names}}\t{{.Status}}\t{{.Command}}\t{{.Ports}}"

# Print and follow logs for all containers
logs:
	docker compose logs -f --tail=1000
