rebuild:
	docker rmi nest-rest-api-app --force && docker compose up -d
	docker network connect yst_api nest-rest-api-app-1