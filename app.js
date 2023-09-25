import {
    fetchObjectLDES,
    fetchObjectLDES_OSLO,
    fetchThesaurusLDES,
    fetchPersonenLDES,
    fetchExhibitionLDES,
    fetchArchiveLDES
} from "./utils/ldes_harvester.js";

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
