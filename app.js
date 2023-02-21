import {fetchLDES, fetchLDES_OSLO} from "./utils/ldes_harvester.js";
import * as cron from 'node-cron'

cron.schedule('09 00 * * *', start); // run harvest every day at 10:00
async function start(){
    // insert CIDOC
    fetchLDES();
    // insert OSLO
    fetchLDES_OSLO();
}



//console.log(dmg_objects_LDES);
