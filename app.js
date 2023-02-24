import {fetchObjectLDES, fetchObjectLDES_OSLO, fetchThesaurusLDES} from "./utils/ldes_harvester.js";
import * as cron from 'node-cron'

cron.schedule('09 00 * * *', start); // run harvest every day at 10:00
async function start(){
    // OBJECTS
    // insert CIDOC
    fetchObjectLDES();
    // insert OSLO
    fetchObjectLDES_OSLO();

    //THESAURUS
    fetchThesaurusLDES();
}

