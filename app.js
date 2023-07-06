import {fetchObjectLDES,
    fetchObjectLDES_OSLO,
    fetchThesaurusLDES,
    fetchPersonenLDES, fetchExhibitionLDES} from "./utils/ldes_harvester.js";
import * as cron from 'node-cron'

cron.schedule('0 14 30 * *', start); // run harvest every day at 10:00
async function start(){

    // OBJECTS
    // insert CIDOC
    fetchObjectLDES();
    // insert OSLO (UNSTABLE)
    fetchObjectLDES_OSLO();

    //THESAURUS
    fetchThesaurusLDES();

    // PERSONEN EN INSTELLINGEN
    fetchPersonenLDES();

    // EXHIBITION
    fetchExhibitionLDES();
}

//fetchObjectLDES();
// insert OSLO
//fetchObjectLDES_OSLO();
// THESAURUS
//fetchThesaurusLDES();
// PERSONEN EN INSTELLINGEN
//fetchPersonenLDES();
// TENTOONSTELLING
//fetchExhibitionLDES();
