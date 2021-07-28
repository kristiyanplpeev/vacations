echo First, lets open a terminal which will run the client app
gnome-terminal -e ./run-helper.sh

echo Now, lets run the server + database

cd server
npm install && npm run pretypeorm && npm run start:dev:db && npm run typeorm:migration:run && npm run start:dev

# & cd .. && cd client && npm run start

