import {
    fetchObjectLDES,
    fetchThesaurusLDES,
    fetchPersonenLDES,
    fetchExhibitionLDES,
    fetchArchiveLDES
} from "./utils/ldes_harvester.js";

function executeEveryMonday() {
    setInterval(function() {

        var currentDate = new Date(); // initiate current data
        if (currentDate.getHours() === 8) { // run every morning at 08:00
            try {
                console.log("fetching human made objects")
                fetchObjectLDES();

                console.log("fetching thesaurus")
                fetchThesaurusLDES()

                console.log("fetching exhibition")
                fetchExhibitionLDES();

                console.log("fetching agents")
                fetchPersonenLDES();

                fetchArchiveLDES()
                console.log("done harvesting LDES")

            } catch(e) {
                console.log(e)
            }
            console.log("Executing next morning at 08:00");
        }
    }, 60000); // Check every minute
}

executeEveryMonday()