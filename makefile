rebuild:
	docker rmi nest-rest-api-app --force && docker compose up -d
	docker network connect yst_api nest-rest-api-app-1

prod:
	docker rmi ystserver-app --force && docker compose up -d
	docker network connect yst_api ystserver-app-1
