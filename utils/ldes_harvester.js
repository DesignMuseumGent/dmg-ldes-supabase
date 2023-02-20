import {newEngine} from "@treecg/actor-init-ldes-client"
import {supabase} from "./supabaseClient.js";

// calculation of yesterday's date
// create a date object using Date constructor
var dateObj = new Date();
// subtract one day from current time
dateObj.setDate(dateObj.getDate() - 2);


export function fetchLDES() {

    const ldes_harvest = [];
    const options = {};

    try {
        let url = "https://apidg.gent.be/opendata/adlib2eventstream/v1/dmg/objecten"
        let options = {
            "pollingInterval": 5000,
            "disablePolling": true,
            "representation": "Object",
            "mimeType": "application/ld+json",
            "requestHeaders": {
                Accept: "application/ld+json",
            },
            "fromTime": new Date(dateObj),
            "emitMemberOnce": true,
            "disableSynchronization": true,
            "disableFraming": false,
            "jsonLdContext":{
                "@context": [
                    {
                        "dcterms:isVersionOf": {
                            "@type": "@id"
                        },
                        "prov": "http://www.w3.org/ns/prov#",
                        "skos": "http://www.w3.org/2004/02/skos/core#",
                        "label": "http://www.w3.org/2000/01/rdf-schema#label",
                        "opmerking": "http://www.w3.org/2004/02/skos/core#note",
                        "foaf:page": {
                            "@type": "@id"
                        },
                        "cest": "https://www.projectcest.be/wiki/Publicatie:Invulboek_objecten/Veld/",
                        "inhoud": "http://www.cidoc-crm.org/cidoc-crm/P190_has_symbolic_content",
                        "la": "https://linked.art/ns/terms/",
                        "conforms_to": {
                            "@id": "dcterms:conformsTo",
                            "@type": "@id",
                            "@container": "@set"
                        },
                        "equivalent": {
                            "@id": "la:equivalent",
                            "@type": "@id"
                        },
                        "dig": "http://www.ics.forth.gr/isl/CRMdig/",
                        "DigitalObject": {
                            "@id": "dig:D1_Digital_Object"
                        },
                        "kwalificatie": {
                            "@id": "http://purl.org/ontology/af/confidence"
                        }
                    }
                ]
            }
        };


        let LDESClient = newEngine();
        let eventstreamSync = LDESClient.createReadStream(url, options);
        eventstreamSync.on('data', async (member) => {
            if (options.representation) {
                if (options.representation === "Object") {
                    const memberURI = member.id;
                    const object = member.object;
                    ldes_harvest.push(member)
                    console.log(ldes_harvest.length);

                    // check if object in DB;
                    let {data, error} = await supabase
                        .from("dmg_objects_LDES")
                        .select("*")
                        .eq('is_version_of', member["object"]["http://purl.org/dc/terms/isVersionOf"]["@id"])

                    if (data) {
                        console.log("there is data for: " + member["object"]["http://purl.org/dc/terms/isVersionOf"]["@id"])
                        console.log("updating: " + member["object"]["http://purl.org/dc/terms/isVersionOf"]["@id"])
                        let {data, error} = await supabase.from('dmg_objects_LDES')
                            .update([
                                {
                                    LDES_raw: member,
                                    generated_at_time: member["object"]["prov:generatedAtTime"]
                                }])

                    } else {
                        console.log("there is no data for: " + member["object"]["http://purl.org/dc/terms/isVersionOf"]["@id"])
                        console.log("inserting: " + member["object"]["http://purl.org/dc/terms/isVersionOf"]["@id"])
                        let {data, error} = await supabase
                            .from('dmg_objects_LDES')
                            .insert([
                                {
                                    LDES_raw: member,
                                    id: member["object"]['http://www.w3.org/ns/adms#identifier'][0]['skos:notation']['@value'],
                                    objectNumber: member["object"]['http://www.w3.org/ns/adms#identifier'][1]['skos:notation']['@value'],
                                    generated_at_time: member["object"]["prov:generatedAtTime"],
                                    is_version_of: member["object"]["http://purl.org/dc/terms/isVersionOf"]["@id"]
                                }
                            ])
                    }

                } else if (options.representation === "Quads") {
                    /* When using Quads representation, the members adhere to the [@Treecg/types Member interface](https://github.com/TREEcg/types/blob/main/lib/Member.ts)
                        interface Member {
                            id: RDF.Term;
                            quads: Array<RDF.Quad>;
                        }
                    */
                    const memberURI = member.id.value;
                    const quads = member.quads;
                }
            } else {

            }

            // Want to pause event stream?
            //eventstreamSync.pause();
        });
        eventstreamSync.on('metadata', (metadata) => {
            if (metadata.treeMetadata) ; // console.log(metadata.treeMetadata) follows the structure of the TREE metadata extractor (https://github.com/TREEcg/tree-metadata-extraction#extracted-metadata)
        });
        eventstreamSync.on('pause', () => {
            // Export current state, but only when paused!
            let state = eventstreamSync.exportState();
        });
        eventstreamSync.on('end', () => {
            console.log("No more data!");
        });
        return ldes_harvest;
        //console.log(ldes_harvest);

    } catch (e) {
        console.error(e);
    }
    //console.log(ldes_harvest.length)

}

export function fetchLDES_OSLO() {

    const ldes_harvest = [];
    const options = {};

    try {
        let url = "https://apidg.gent.be/opendata/adlib2eventstream/v1/dmg/objecten"

        let options = {
            "pollingInterval": 5000,
            "disablePolling": true,
            "representation": "Object",
            "mimeType": "application/ld+json",
            "requestHeaders": {
                Accept: "application/ld+json",
            },
            "fromTime": new Date(dateObj),
            "emitMemberOnce": true,
            "disableSynchronization": true,
            "disableFraming": false,
            "jsonLdContext":{
                "@context": [
                    "https://apidg.gent.be/opendata/adlib2eventstream/v1/context/persoon-basis.jsonld",
                    "https://apidg.gent.be/opendata/adlib2eventstream/v1/context/cultureel-erfgoed-event-ap.jsonld",
                    "https://apidg.gent.be/opendata/adlib2eventstream/v1/context/cultureel-erfgoed-object-ap.jsonld",
                    "https://apidg.gent.be/opendata/adlib2eventstream/v1/context/generiek-basis.jsonld",
                    {
                        "dcterms:isVersionOf": {
                            "@type": "@id"
                        },
                        "prov": "http://www.w3.org/ns/prov#",
                        "skos": "http://www.w3.org/2004/02/skos/core#",
                        "label": "http://www.w3.org/2000/01/rdf-schema#label",
                        "opmerking": "http://www.w3.org/2004/02/skos/core#note",
                        "foaf:page": {
                            "@type": "@id"
                        },
                        "cest": "https://www.projectcest.be/wiki/Publicatie:Invulboek_objecten/Veld/",
                        "inhoud": "http://www.cidoc-crm.org/cidoc-crm/P190_has_symbolic_content",
                        "la": "https://linked.art/ns/terms/",
                        "conforms_to": {
                            "@id": "dcterms:conformsTo",
                            "@type": "@id",
                            "@container": "@set"
                        },
                        "equivalent": {
                            "@id": "la:equivalent",
                            "@type": "@id"
                        },
                        "dig": "http://www.ics.forth.gr/isl/CRMdig/",
                        "DigitalObject": {
                            "@id": "dig:D1_Digital_Object"
                        },
                        "kwalificatie": {
                            "@id": "http://purl.org/ontology/af/confidence"
                        }
                    }
                ]
            }
        };


        let LDESClient = newEngine();
        let eventstreamSync = LDESClient.createReadStream(url, options);
        eventstreamSync.on('data', async (member) => {
            if (options.representation) {
                if (options.representation === "Object") {
                    const memberURI = member.id;
                    //console.log(memberURI);
                    const object = member.object;
                    //console.log(object);
                    //console.log(member);
                    ldes_harvest.push(member)
                    console.log(ldes_harvest.length);
                    //console.log(member["object"]['Stuk.identificator'][1]['skos:notation']['@value'])


                    let {data, error} = await supabase
                        .from('dmg_objects_LDES')
                        .update([
                            {
                                OSLO: member
                            }
                        ])
                        .eq('is_version_of', member["object"]["http://purl.org/dc/terms/isVersionOf"]["@id"])



                } else if (options.representation === "Quads") {
                    /* When using Quads representation, the members adhere to the [@Treecg/types Member interface](https://github.com/TREEcg/types/blob/main/lib/Member.ts)
                        interface Member {
                            id: RDF.Term;
                            quads: Array<RDF.Quad>;
                        }
                    */
                    const memberURI = member.id.value;
                    //console.log(memberURI);
                    const quads = member.quads;
                    //console.log(quads);
                }
            } else {
                //console.log(member);
            }

            // Want to pause event stream?
            //eventstreamSync.pause();
        });
        eventstreamSync.on('metadata', (metadata) => {
            if (metadata.treeMetadata) console.log(metadata.treeMetadata); // follows the structure of the TREE metadata extractor (https://github.com/TREEcg/tree-metadata-extraction#extracted-metadata)
            //console.log(metadata.url); // page from where metadata has been extracted
        });
        eventstreamSync.on('pause', () => {
            // Export current state, but only when paused!
            let state = eventstreamSync.exportState();
        });
        eventstreamSync.on('end', () => {
            console.log("No more data!");
        });
        return ldes_harvest;
        console.log(ldes_harvest);

    } catch (e) {
        console.error(e);
    }
    //console.log(ldes_harvest.length)

}