# imse2020W
Uni Wien IMSE course 2020W project assignment

1. Clone the repository
2. Use "docker-compose up" in the folder with the docker-compose file
3. Backend is listening on localhost:3000
4. DB adminer listens on localhost:8080 (see credential details in docker-compose file)

For local development

1. go to directory: ms2/mysql
2. build mysql db container: docker build . --rm --tag mysql:covid_cinema
3. start mysql db container (detached): docker run -p 3306:3306 --name mysql -d mysql:covid_cinema
4. go to directory: ms2/nodejs
5. npm install
6. node server.js (use the db.dev.config.json file)