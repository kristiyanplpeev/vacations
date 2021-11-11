# Vacation

Vacation is an application that enables users after authentication to send an email to their manager with request for paid vacation.

## Project Setup 

To run the project you will need to do the following steps.

1. Open server directory and create an **.env** file with the following sample data:

        PORT=5000
        POSTGRES_HOST=127.0.0.1
        POSTGRES_PORT=5432
        POSTGRES_USER=postgres
        POSTGRES_PASSWORD=mysecretpassword
        POSTGRES_DATABASE=vacationdb
        MODE=DEV
        RUN_MIGRATIONS=true
        SECRET_KEY=secret_key
        GOOGLE_CLIENT_ID=57121685326-pegp31vlg3n02i5hl57qdpqagekcsfdb.apps.googleusercontent.com
        GOOGLE_SECRET=XAwXulsNk650Wvoz1e923YI-
        SPRINT_START_DATE=2021-11-03
To get your own "GOOGLE_CLIENT_ID" and "GOOGLE_SECRET" you need to do Step 1 of the following [article](https://developers.google.com/identity/sign-in/web/server-side-flow).

2. Open the client directory and create an **.env** file with the following sample data:

        REACT_APP_FIRST_SPRINT_BEGINNING=2021-11-03
        REACT_APP_SPRINT_LENGTH=14
4. Go back to the vacation directory and open terminal.
5. Type **./run.sh** to run your application.
6. In a moment, your application will be running and you will be able to access it at **http://localhost:3000/**
