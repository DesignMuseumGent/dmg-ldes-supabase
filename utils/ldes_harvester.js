import {newEngine} from "@treecg/actor-init-ldes-client"
export function fetchLDES() {

    const ldes_harvest = [];

    try {
        let url = "https://apidg.gent.be/opendata/adlib2eventstream/v1/dmg/objecten"
        let options = {
            "pollingInterval": 5000,
            "representation": "Object",
            "mimeType": "application/ld+json",
            "requestHeaders": {
                Accept: "application/ld+json",
            }, // comma needed?
            "fromTime": new Date("2021-02-03T15:46:12.307Z"),
            "emitMemberOnce": false,
            "disableSynchronization": true,
            "disableFraming": false,
            "jsonLdContext":{
                "@context": [
                    "https://apidg.gent.be/opendata/adlib2eventstream/v1/context/cultureel-erfgoed-object-ap.jsonld",
                    "https://apidg.gent.be/opendata/adlib2eventstream/v1/context/persoon-basis.jsonld",
                    "https://apidg.gent.be/opendata/adlib2eventstream/v1/context/cultureel-erfgoed-event-ap.jsonld",
                    "https://apidg.gent.be/opendata/adlib2eventstream/v1/context/organisatie-basis.jsonld",
                    "https://apidg.gent.be/opendata/adlib2eventstream/v1/context/generiek-basis.jsonld",
                    "https://apidg.gent.be/opendata/adlib2eventstream/v1/context/dossier.jsonld",
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
        eventstreamSync.on('data', (member) => {
            if (options.representation) {
                if (options.representation === "Object") {
                    const memberURI = member.id;
                    console.log(memberURI);
                    const object = member.object;
                    console.log(object);
                    ldes_harvest.push(object);
                    //console.log(member);

                } else if (options.representation === "Quads") {
                    /* When using Quads representation, the members adhere to the [@Treecg/types Member interface](https://github.com/TREEcg/types/blob/main/lib/Member.ts)
                        interface Member {
                            id: RDF.Term;
                            quads: Array<RDF.Quad>;
                        }
                    */
                    const memberURI = member.id.value;
                    console.log(memberURI);
                    const quads = member.quads;
                    console.log(quads);
                }
            } else {
                console.log(member);
            }

            // Want to pause event stream?
            eventstreamSync.pause();
        });
        eventstreamSync.on('metadata', (metadata) => {
            if (metadata.treeMetadata) console.log(metadata.treeMetadata); // follows the structure of the TREE metadata extractor (https://github.com/TREEcg/tree-metadata-extraction#extracted-metadata)
            console.log(metadata.url); // page from where metadata has been extracted
        });
        eventstreamSync.on('pause', () => {
            // Export current state, but only when paused!
            let state = eventstreamSync.exportState();
        });
        eventstreamSync.on('end', () => {
            console.log("No more data!");
        });

    } catch (e) {
        console.error(e);
    }

    return ldes_harvest;
}
