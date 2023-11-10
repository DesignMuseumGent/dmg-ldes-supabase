import {
  fetchObjectLDES,
  fetchThesaurusLDES,
  fetchPersonenLDES,
  fetchExhibitionLDES,
  fetchArchiveLDES,
} from "./utils/ldes_harvester.js";

import cron from "node-cron";

function main() {
  console.log("----------------------------------------------------------");
  console.log("             start sync LDES-postGres                     ");
  console.log("                                                          ");
  console.log("----------------------------------------------------------");

  try {
    console.log("fetching human made objects");
    fetchObjectLDES();

    console.log("fetching thesaurus");
    fetchThesaurusLDES();

    console.log("fetching exhibition");
    fetchExhibitionLDES();

    console.log("fetching agents");
    fetchPersonenLDES();

    fetchArchiveLDES();
    console.log("done harvesting LDES");
  } catch (e) {
    console.log(e);
  }

  console.log("----------------------------------------------------------");
  console.log("             finished sync LDES-postGres                  ");
  console.log("                                                          ");
  console.log("----------------------------------------------------------");
}

// run this script every day at 23:00
cron.schedule("0 23 * * *", () => {
  main();
});

