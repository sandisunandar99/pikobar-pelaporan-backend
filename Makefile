docker-start:
	docker-compose up --build --remove-orphans --force-recreate
docker-stop:
	docker-compose stop
docker-coverage:
	docker-compose exec backend npm run test:coverage