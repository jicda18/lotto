COMPOSE = docker compose -f docker-compose-prod.yml
NETWORK = lotto
FRONTEND_DIR = ./frontend

# services groups
CORE_SERVICES = db redis chromium
MID_SERVICES = scrapper oapi
AUTOMATIZATION_SERVICES = imaker snpublisher

# =======================================================
# Helpers
# =======================================================

# wait for OAPI service to be up
wait-oapi:
	@echo "Waiting for OAPI to be up..."
	@i=0; \
	while [ $$i -lt 30 ]; do \
		if docker run --rm --network $(NETWORK) curlimages/curl:8.8.0 \
			-s http://oapi:3000/health >/dev/null 2>&1; then \
			echo "OAPI IS UP!"; \
			exit 0; \
		fi; \
		echo "Not yet available..."; \
		i=$$((i+1)); \
		sleep 2; \
	done; \
	echo "ERROR: OAPI didn't respond in time." && exit 1

# ensure that the Docker network exists
ensure-network:
	@if ! docker network inspect $(NETWORK) >/dev/null 2>&1; then \
		echo "Creating network $(NETWORK)"; \
		docker network create $(NETWORK); \
	else \
		echo "The network $(NETWORK) is already exists"; \
	fi


# =======================================================
# Main Targets
# =======================================================

up: down ensure-network
	@echo "Upping services..."
	$(COMPOSE) up -d $(CORE_SERVICES)
	$(COMPOSE) up -d $(MID_SERVICES)
	$(COMPOSE) up -d $(AUTOMATIZATION_SERVICES)

	$(MAKE) wait-oapi

	@echo "running logos scripts..."
	docker run --rm --network $(NETWORK) \
		-v $(FRONTEND_DIR):/app -w /app \
		-e VITE_OAPI_URL=http://oapi:3000 \
		node:22.17-alpine \
		node scripts/GetCollectionsLogo.js
	
	@echo "building and upping frontend..."
	$(COMPOSE) build frontend
	$(COMPOSE) up -d frontend

	@echo "Done"

down:
	$(COMPOSE) down
