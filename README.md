# Vacation

Vacation is an application that enables users after authentication to send an email to their manager with request for paid vacation.

## Project Setup 

### Server

1. Open server directory.
2. Right click + open terminal.
3. To install all the dependencies of the project, type **npm install** and click enter.
4. Add .env file in the server directory with the following data:
POSTGRES_HOST=127.0.0.1
POSTGRES_PORT=5432
POSTGRES_USER=postgres
POSTGRES_PASSWORD=mysecretpassword
POSTGRES_DATABASE=vacationdb
PORT=3001
MODE=DEV
RUN_MIGRATIONS=true
5. To initiate your database, type **npm run start:dev:db**.
6. To setup the database, type **npm run typeorm:migration:run**.
7. Now everying is set, you can type **npm run start:dev** to start your server.

Now your server is running.

### Client

1. Open client directory.
2. Right click + open terminal.
3. To install all the dependencies of the project, type **npm install** and click enter.
4. After installing all the dependencies, type **npm run start**.

Now both your client and server are running, the client app is at address **http://localhost:3000/**