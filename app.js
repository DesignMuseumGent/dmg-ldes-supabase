import {supabase} from "./utils/supabaseClient.js";
import {fetchLDES} from "./utils/ldes_harvester.js";

const x = fetchLDES();

let { data: dmg_objects_LDES, error } = await supabase
    .from('dmg_objects_LDES')
    .select('*')

console.log(dmg_objects_LDES);
