import {fetchLDES, fetchLDES_OSLO} from "./utils/ldes_harvester.js";
import * as cron from 'node-cron'

cron.schedule('00 10 * * *', start); // run harvest every day at 10:00
async function start(){
    // insert CIDOC
    fetchLDES();
    // insert OSLO
    fetchLDES_OSLO();
}



//console.log(dmg_objects_LDES);
