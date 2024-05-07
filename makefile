rebuild:
	docker rmi nest-rest-api-app --force && docker rmi nest-rest-api-studio --force && docker compose up -d
	docker network connect yst_api nest-rest-api-app-1
	docker network connect yst_api nest-rest-api-studio-1

prod:
	docker rmi ystserver-app --force && docker rmi ystserver-studio --force && docker compose up -d
	docker network connect yst_api ystserver-app-1
	docker network connect yst_api ystserver-studio-1

