# Vacation

Vacation is an application that enables users after authentication to send an email to their manager with request for paid vacation.

## Project Setup 

To run the project you will need to do the following steps.

1. Open server directory and create an **.env** file with the following sample data:

        POSTGRES_HOST=127.0.0.1
        POSTGRES_PORT=5432
        POSTGRES_USER=postgres
        POSTGRES_PASSWORD=mysecretpassword
        POSTGRES_DATABASE=vacationdb
        PORT=3001
        MODE=DEV
        RUN_MIGRATIONS=true

2. Go back to the vacation directory and open terminal.
3. Type **./run.sh** to run your application.
4. In a moment, your application will be running and you will be able to access it at **http://localhost:3000/**
