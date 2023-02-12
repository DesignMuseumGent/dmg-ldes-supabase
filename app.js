import {supabase} from "./utils/supabaseClient.js";
import {fetchLDES} from "./utils/ldes_harvester.js";

await fetchLDES();

//console.log(dmg_objects_LDES);
