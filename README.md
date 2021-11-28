# JoyCar Admins API

JoyCar Admins is a project developed to resolve a technical test.

This is not a real or productive JoyCar API.

## Table of Contents

* Requirements
* Getting Started
  * Database
* Development
  * Start the application

## Requirements

* Node version >= 14.17.0
* NPM version >= 6.14.13
* Nest-CLI >= 7.6.0

## Getting Started

* Clone the repository `git clone https://github.com/victor5516/nest-api-test.git`
* Install Node Dependencies with the command run `npm install`
* copy the .env.example file from nest-api-test project `cp .env.example .env`

### Database

    In the project folder there is a `docker-compose.yml` file with the configuration of a mongoDB container, run the following commands to start it.

* `docker-compose up -d mongo` - Start the mongodb service
* `docker-compose ps` - Check the status of mongodb
* `docker-compose down` - turn off the mongodb service

## Development

* `npm start` - Start application
* `npm run start:watch` - Start application in watch mode
* `npm run test` - run Jest test runner
* `npm run start:prod` - Build application

### Start the application

* Run `npm start` and test the api with `http://localhost:3000/v1/docs` in your favourite browser
