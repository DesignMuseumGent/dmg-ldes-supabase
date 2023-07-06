import {fetchObjectLDES,
    fetchObjectLDES_OSLO,
    fetchThesaurusLDES,
    fetchPersonenLDES, fetchExhibitionLDES} from "./utils/ldes_harvester.js";
import * as cron from 'node-cron'

console.log("---- harvester online -----")
console.log("---- next harvest today at: 15:00 -----")


cron.schedule('00 15 * * *', start); // run harvest every day at 10:00
async function start(){

    // OBJECTS
    // insert CIDOC
    console.log("-----------------------------")
    console.log("start harvesting objects")
    fetchObjectLDES();
    console.log("done harvesting objects")
    
    // insert OSLO (UNSTABLE)
    //fetchObjectLDES_OSLO();

    //THESAURUS
    console.log("-----------------------------")
    console.log("start harvesting thesaurus")
    fetchThesaurusLDES();
    console.log("done harvesting thesaurus")


    // PERSONEN EN INSTELLINGEN
    //fetchPersonenLDES();

    // EXHIBITION
    console.log("-----------------------------")
    console.log("start harvesting exhibitions")
    fetchExhibitionLDES();
    console.log("done harvesting exhibitions")

    console.log("-----------------------------")
    console.log("---- next harvest today at: 15:00 -----")

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
