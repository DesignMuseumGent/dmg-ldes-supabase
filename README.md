# ldes-supabase

Node service  using the treeCG actor-init-ldes-client for harvesting Linked Data Event Streams containing data related to Design Museum Gent. These streams are transformed into fragments, containing the Linked Data of a single entity. These fragments are then stored into a postgres database that acts as a backend for the museums' REST-API. 

## dependencies
* [node-service-eventstream-api](https://github.com/StadGent/node_service_eventstream-api)https://github.com/StadGent/node_service_eventstream-api)
* [eventstream-client](https://github.com/TREEcg/event-stream-client/tree/main/packages/actor-init-ldes-client#treecgactor-init-ldes-client)
* Postgres DB

## setup 

Make sure you have Node installed on your device. 

1. add .env at top level containing the credentials to connect with PG. (we are running our instance on a Supabase)

```
SUPABASE_KEY= *****
SUPABSASE_URL = *****
```





