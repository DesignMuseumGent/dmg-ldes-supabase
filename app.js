import {
    fetchObjectLDES,
    fetchThesaurusLDES,
    fetchPersonenLDES,
    fetchExhibitionLDES,
    fetchArchiveLDES
} from "./utils/ldes_harvester.js";

function executeEveryMonday() {
    setInterval(function() {
        var currentDate = new Date();
        if (currentDate.getDay() === 1 && currentDate.getHours() === 15) {
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

            console.log("Executing every Monday at 15:00");
        }
    }, 60000); // Check every minute
}

executeEveryMonday()

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