import {fetchLDES, fetchLDES_OSLO} from "./utils/ldes_harvester.js";

// insert CIDOC
await fetchLDES();

// insert OSLO
await fetchLDES_OSLO();

//console.log(dmg_objects_LDES);
