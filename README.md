# ldes-supabase

Node service  using the treeCG actor-init-ldes-client for harvesting Linked Data Event Streams containing data related to Design Museum Gent. These streams are transformed into fragments, containing the Linked Data of a single entity. This service transforms the eventstreams into fragments are then stored into a postgres database that acts as a backend for the museums' REST-API. 

## dependencies
* [node-service-eventstream-api](https://github.com/StadGent/node_service_eventstream-api)https://github.com/StadGent/node_service_eventstream-api)
* [eventstream-client](https://github.com/TREEcg/event-stream-client/tree/main/packages/actor-init-ldes-client#treecgactor-init-ldes-client)
* Postgres DB

## setup 

Make sure you have Node installed on your device. 

### install dependencies 
```
npm install --save
```

### setup environment

add .env at top level containing the credentials to connect with PG. (we are running our instance on a Supabase)

```
SUPABASE_KEY= *****
SUPABSASE_URL = *****
```

### set paramaters
change range: (if harvesting for the first time, make sure to use "harvest from start"). 
define which eventstream to harvest: 

### run service 
to run the service, use the following commands in the terminal. 
```
node index.js
```







