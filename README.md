# Shield

## Description
A nodeJs microservice that provides token based authentication and user management

For more information about the API endpoints please click [here](docs/API.md)

## Setup

You can run this locally or using our docker compose file.

Regardless of what method you chose you will need to follow the below instructions first then move onto 
the setup of your choosing (local or docker)

Create a .env from our template
```
cp .env-example .env
```

### Docker

*The .env-example file is configured for docker so you won't need to make any changes to the file*

Build the docker images

```
docker-compose -f docker/docker-compose-dev.yml build
```

Run the docker compose file
```
docker-compose -f docker/docker-compose-dev.yml up
```

### Local

You will need to modify the .env file for local development

```
vim .env
```

Then change the DB_HOST environment variable

```
DB_HOST=localhost
```

Install javascript packages
```
npm install
```

Run development server

```
npm run dev
```

## Tests

Run all unit tests
```
npm run test
```

## Lint

View linting errors
```
npm run lint
```

fix linting errors
```
npm run lint-fix
```
