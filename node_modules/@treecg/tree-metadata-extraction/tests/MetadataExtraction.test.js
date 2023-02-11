/* eslint-disable no-multi-str */
const expect = require('chai').expect
require('mocha')
const N3 = require('n3')
const ns = require('../dist/util/NameSpaces').default
const extractMetadata = require('../dist/lib/metadataExtraction').extractMetadata

const context = {
  "@vocab": ns.tree('')
}

const collectionContext = {
  "@vocab": ns.tree(''),
  "subset": ns.void("subset")
}

async function test(turtleString, result, message) {
  it(message, async () => {
    const quadArray = [];
    await new N3.Parser().parse(turtleString,
      (_error, quad, prefixes) => {
        if (_error) console.log('error', _error)
        if (quad) quadArray.push(quad)
      })

    await evaluateMetadataExtraction(quadArray, result)
  })
}

async function evaluateMetadataExtraction(input, result) {
  const extractedMetadataPerType = await extractMetadata(input)
  // Check if output is valid JSONLD
  for (let type of ['collections', 'nodes', 'relations']) {
    let extractedMapping = extractedMetadataPerType[type]
    let resultMapping = result[type]

    expect(extractedMapping.size)
      .to.equal(resultMapping.size, `Found ${extractedMapping.size} ${type}, expected ${resultMapping.size}`);

    for (let key of resultMapping.keys()) {
      expect(extractedMapping.get(key)).to.deep.equal(resultMapping.get(key))
    }
  }
}



describe('Testing individual metadata extractions', () => {
  var t = `
  @prefix ex: <${ns.ex('')}> . 
  @prefix tree: <${ns.tree('')}> . 
    ex:c a tree:Collection .
  `
  var r = {
    collections: new Map([
      [ns.ex("c"), {
        "@context": collectionContext,
        "@id": ns.ex("c"),
        "@type": [ ns.tree('Collection') ]
      }]
    ]),
    nodes: new Map(),
    relations: new Map(),
  }

  test(t, r, "Should be able to extract a TREE collection")


  var t = `
  @prefix ex: <${ns.ex('')}> . 
  @prefix hydra: <${ns.hydra('')}> . 
    ex:c a hydra:Collection .
  `
  var r = {
    collections: new Map([
      [ns.ex("c"), {
        "@context": collectionContext,
        "@id": ns.ex("c"),
        "@type": [ ns.hydra('Collection') ]
      }]
    ]),
    nodes: new Map(),
    relations: new Map(),
  }

  test(t, r, "Should be able to extract a HYDRA collection")

  var t = `
  @prefix ex: <${ns.ex('')}> . 
  @prefix hydra: <${ns.hydra('')}> . 
  @prefix tree: <${ns.tree('')}> . 
    ex:c1 a tree:Collection .
    ex:c2 a hydra:Collection .
  `
  var r = {
    collections: new Map([
      [ns.ex("c1"), {
        "@context": collectionContext,
        "@id": ns.ex("c1"),
        "@type": [ ns.tree('Collection') ]
      }],
      [ns.ex("c2"), {
        "@context": collectionContext,
        "@id": ns.ex("c2"),
        "@type": [ ns.hydra('Collection') ]
      }]
    ]),
    nodes: new Map(),
    relations: new Map(),
  }

  test(t, r, "Should be able to extract multiple collections")


  var t = `
  @prefix ex: <${ns.ex('')}> . 
  @prefix hydra: <${ns.hydra('')}> . 
  @prefix tree: <${ns.tree('')}> . 
  @prefix void: <${ns.void('')}> . 
  @prefix dct: <${ns.dct('')}> . 
    ex:c1 a tree:Collection .
    ex:c2 a hydra:Collection .
    ex:c1 tree:view ex:n1.
    ex:c1 hydra:view ex:n2.
    ex:c2 void:subset ex:n3.
    ex:n4 dct:isPartOf ex:c2.
    ex:n1 a tree:Node.
    ex:n2 a tree:Node.
    ex:n3 a tree:Node.
    ex:n4 a tree:Node.
  `
  var r = {
    collections: new Map([
      [ns.ex("c1"), {
        "@context": collectionContext,
        "@id": ns.ex("c1"),
        "@type": [ ns.tree('Collection') ],
        "view": [{ "@id": ns.ex('n1') }, { "@id": ns.ex('n2') }]
      }],
      [ns.ex("c2"), {
        "@context": collectionContext,
        "@id": ns.ex("c2"),
        "@type": [ ns.hydra('Collection') ],
        "subset": [{ "@id": ns.ex('n3') }, { "@id": ns.ex('n4') }]
      }]
    ]),
    nodes: new Map([
      [ns.ex('n1'), { 
        "@context": context,
        "@id": ns.ex('n1'),
        "@type": [ ns.tree('Node') ]
      }],
      [ns.ex('n2'), { 
        "@context": context,
        "@id": ns.ex('n2'),
        "@type": [ ns.tree('Node') ]
      }],
      [ns.ex('n3'), { 
        "@context": context,
        "@id": ns.ex('n3'),
        "@type": [ ns.tree('Node') ]
      }],
      [ns.ex('n4'), { 
        "@context": context,
        "@id": ns.ex('n4'),
        "@type": [ ns.tree('Node') ]
      }]
    ]),
    relations: new Map(),
  }

  test(t, r, "Should be able to extract multiple collections with multiple views")

})

describe('testing elaborate extraction',
  () => {

    var collectionTest = `
      @prefix ex: <${ns.ex('')}> . 
      @prefix hydra: <${ns.hydra('')}> . 
      @prefix tree: <${ns.tree('')}> . 
      ex:c a tree:Collection ;
        tree:view ex:node1 ;
        hydra:view ex:node2 ;
        tree:member ex:m1 ;
        tree:member ex:m2 ;
        tree:member ex:m3 ;
        tree:import ex:filetoimport.ttl .
    `

    var c = {
      "@context": collectionContext,
      "@id": ns.ex("c"),
      "@type": [ns.tree('Collection')],
      "import": [{
        "@id": ns.ex("filetoimport.ttl")
      }],
      "member": [{
        "@id": ns.ex("m1")
      }, {
        "@id": ns.ex("m2")
      }, {
        "@id": ns.ex("m3")
      }],
      "view": [{
        "@id": ns.ex("node1")
      }, {
        "@id": ns.ex("node2")
      }]
    }

    var collections = new Map();
    collections.set(ns.ex("c"), c)

    var collectionTestResult = {
      collections: collections,
      nodes: new Map(),
      relations: new Map(),
    }

    test(collectionTest, collectionTestResult, "Should be able to extract TREE collection metadata from a quad array")


    var nodeTest = `
      @prefix ex: <${ns.ex('')}> . 
      @prefix tree: <${ns.tree('')}> . 
      ex:n a tree:Node ;
        tree:relation ex:relation1 ;
        tree:relation ex:relation2 ;
        tree:search _:search ;
        tree:conditionalImport _:conditionalimport .

      _:search tree:timeQuery "timeQuery";
        tree:zoom "zoom";
        tree:latitudeTile "latitudeTile";
        tree:longitudeTile "longitudeTile".

      _:conditionalimport  tree:path ex:pathName;
        tree:import ex:import;
        tree:importStream ex:importStream.
    `
    var n = {
      "@context": context,
      "@id": ns.ex("n"),
      "@type": [ns.tree('Node')],
      "conditionalImport": [{
        "import": [{
          "@id": ns.ex("import")
        }],
        "importStream": [{
          "@id": ns.ex("importStream")
        }],
        "path": [{
          "@id": ns.ex("pathName")
        }]
      }],
      "relation": [{
          "@id": ns.ex("relation1")
        },
        {
          "@id": ns.ex("relation2")
        }
      ],
      "search": [{
        [ns.tree("latitudeTile")]: [{
          "@value": "latitudeTile",
          "@type": ns.xsd("string"),
        }],
        [ns.tree("longitudeTile")]: [{
          "@value": "longitudeTile",
          "@type": ns.xsd("string"),
        }],
        [ns.tree("timeQuery")]: [{
          "@value": "timeQuery",
          "@type": ns.xsd("string"),
        }],
        [ns.tree("zoom")]: [{
          "@value": "zoom",
          "@type": ns.xsd("string"),
        }]
      }]
    }

    var nodes = new Map();
    nodes.set(ns.ex("n"), n)

    var relations = new Map();
    relations.set(ns.ex("relation1"), {
      "@context": context,
      "@id": ns.ex("relation1"),
    });
    relations.set(ns.ex("relation2"), {
      "@context": context,
      "@id": ns.ex("relation2"),
    });

    var nodeTestResult = {
      collections: new Map(),
      nodes: nodes,
      relations: relations,
    }

    test(nodeTest, nodeTestResult, "Should be able to extract TREE node metadata from a quad array")



    var relationTest = `
      @prefix ex: <${ns.ex('')}> . 
      @prefix tree: <${ns.tree('')}> . 
      @prefix xsd: <${ns.xsd('')}> . 
      ex:r a tree:PrefixRelation ;
        tree:remainingItems "10"^^xsd:integer ;
        tree:path ex:predicatePath ;
        tree:value "test" ;
        tree:node ex:Node2 ;
        tree:conditionalImport _:conditionalimport2 ;
        tree:import ex:import .

      _:conditionalimport2 tree:path ex:pathName ;
      tree:import ex:import ;
      tree:importStream ex:importStream .
    `
    var r = {
      "@context": context,
      "@id": ns.ex("r"),
      "@type": [ns.tree('PrefixRelation')],
      "conditionalImport": [{
        "import": [{
          "@id": ns.ex("import")
        }],
        "importStream": [{
          "@id": ns.ex("importStream")
        }],
        "path": [{
          "@id": ns.ex("pathName")
        }]
      }],
      "import": [{
        "@id": ns.ex("import")
      }],
      "node": [{
        "@id": ns.ex("Node2")
      }],
      "path": [{
        "@id": ns.ex("predicatePath")
      }],
      "remainingItems": [{
        "@value": "10",
        "@type": ns.xsd("integer"),
      }],
      "value": [{
        "@value": "test",
        "@type": ns.xsd("string"),
      }]
    }

    var relations = new Map();
    relations.set(ns.ex("r"), r)

    var relationTestResult = {
      collections: new Map(),
      nodes: new Map(),
      relations: relations,
    }

    test(relationTest, relationTestResult, "Should be able to extract TREE relation metadata from a quad array")






    var combinedTest = `
      @prefix ex: <${ns.ex('')}> . 
      @prefix tree: <${ns.tree('')}> . 
      @prefix xsd: <${ns.xsd('')}> . 
      ex:c a tree:Collection ;
        tree:view ex:node1 ;
        tree:view ex:node2 ;
        tree:member ex:m1 ;
        tree:member ex:m2 ;
        tree:member ex:m3 ;
        tree:import ex:filetoimport.ttl .

      ex:n a tree:Node ;
        tree:relation ex:relation1 ;
        tree:relation ex:relation2 ;
        tree:search _:search ;
        tree:conditionalImport _:conditionalimport .

      ex:r a tree:PrefixRelation ;
      tree:remainingItems "10"^^xsd:integer ;
      tree:path ex:predicatePath ;
      tree:value "test" ;
      tree:node ex:Node2 ;
      tree:conditionalImport _:conditionalimport2 ;
      tree:import ex:import .

      _:search tree:timeQuery "timeQuery";
        tree:zoom "zoom";
        tree:latitudeTile "latitudeTile";
        tree:longitudeTile "longitudeTile".

      _:conditionalimport  tree:path ex:pathName;
        tree:import ex:import;
        tree:importStream ex:importStream.

      _:conditionalimport2  tree:path ex:pathName ;
        tree:import ex:import ;
        tree:importStream ex:importStream .
    `



    var collections = new Map();
    collections.set(ns.ex("c"), c)
    var nodes = new Map();
    nodes.set(ns.ex("n"), n)
    var relations = new Map();
    relations.set(ns.ex("r"), r);
    relations.set(ns.ex("relation1"), {
      "@context": context,
      "@id": ns.ex("relation1"),
    });
    relations.set(ns.ex("relation2"), {
      "@context": context,
      "@id": ns.ex("relation2"),
    });
    var combinedTestResults = {
      collections: collections,
      nodes: nodes,
      relations: relations,
    }

    test(combinedTest, combinedTestResults, "Should be able to extract all TREE metadata from a quad array")

    const sensordatatest = `
      @prefix ex: <${ns.ex('')}> . 
      @prefix tree: <${ns.tree('')}> . 
      @prefix xsd: <${ns.xsd('')}> . 
      <https://streams.datapiloten.be/sensors#lora.3432333857376518@2020-06-30T14:32:57.732Z> <http://purl.org/dc/terms/isVersionOf> <https://streams.datapiloten.be/sensors#lora.3432333857376518> .
      <https://streams.datapiloten.be/sensors#lora.3432333857376518@2020-06-30T14:32:57.732Z> <http://www.opengis.net/ont/geosparql#hasGeometry> _:b7 .
      <https://streams.datapiloten.be/sensors#lora.3432333857376518@2020-06-30T14:32:57.732Z> <http://www.w3.org/ns/prov#generatedAtTime> "2020-06-30T14:32:57.732Z"^^xsd:dateTime .
      <https://streams.datapiloten.be/sensors#lora.3432333857376518@2020-06-30T14:32:57.732Z> <http://www.w3.org/ns/sosa/observes> <https://w3id.org/cot/PM1> .
      <https://streams.datapiloten.be/sensors#lora.3432333857376518@2020-06-30T14:32:57.784Z> <http://purl.org/dc/terms/isVersionOf> <https://streams.datapiloten.be/sensors#lora.3432333857376518> .
      <https://streams.datapiloten.be/sensors#lora.3432333857376518@2020-06-30T14:32:57.784Z> <http://www.opengis.net/ont/geosparql#hasGeometry> _:b8 .
      <https://streams.datapiloten.be/sensors#lora.3432333857376518@2020-06-30T14:32:57.784Z> <http://www.w3.org/ns/prov#generatedAtTime> "2020-06-30T14:32:57.784Z"^^xsd:dateTime .
      <https://streams.datapiloten.be/sensors#lora.3432333857376518@2020-06-30T14:32:57.784Z> <http://www.w3.org/ns/sosa/observes> <https://w3id.org/cot/NO2> .
      <https://streams.datapiloten.be/sensors#lora.3432333857376518@2020-06-30T14:32:57.784Z> <http://www.w3.org/ns/sosa/observes> <https://w3id.org/cot/O3> .
      <https://streams.datapiloten.be/sensors#lora.3432333857376518@2020-06-30T14:32:57.784Z> <http://www.w3.org/ns/sosa/observes> <https://w3id.org/cot/PM10> .
      <https://streams.datapiloten.be/sensors#lora.3432333857376518@2020-06-30T14:32:57.784Z> <http://www.w3.org/ns/sosa/observes> <https://w3id.org/cot/PM1> .
      <https://streams.datapiloten.be/sensors#lora.3432333857376518@2020-06-30T14:32:57.784Z> <http://www.w3.org/ns/sosa/observes> <https://w3id.org/cot/PM25> .
      <https://streams.datapiloten.be/sensors#lora.3432333857376518@2020-06-30T14:32:57.785Z> <http://purl.org/dc/terms/isVersionOf> <https://streams.datapiloten.be/sensors#lora.3432333857376518> .
      <https://streams.datapiloten.be/sensors#lora.3432333857376518@2020-06-30T14:32:57.785Z> <http://www.opengis.net/ont/geosparql#hasGeometry> _:b10 .
      <https://streams.datapiloten.be/sensors#lora.3432333857376518@2020-06-30T14:32:57.785Z> <http://www.opengis.net/ont/geosparql#hasGeometry> _:b11 .
      <https://streams.datapiloten.be/sensors#lora.3432333857376518@2020-06-30T14:32:57.785Z> <http://www.opengis.net/ont/geosparql#hasGeometry> _:b12 .
      <https://streams.datapiloten.be/sensors#lora.3432333857376518@2020-06-30T14:32:57.785Z> <http://www.w3.org/ns/prov#generatedAtTime> "2020-06-30T14:32:57.785Z"^^xsd:dateTime .
      <https://streams.datapiloten.be/sensors#lora.3432333857376518@2020-06-30T14:32:57.785Z> <http://www.w3.org/ns/sosa/observes> <https://w3id.org/cot/NO2> .
      <https://streams.datapiloten.be/sensors#lora.3432333857376518@2020-06-30T14:32:57.785Z> <http://www.w3.org/ns/sosa/observes> <https://w3id.org/cot/O3> .
      <https://streams.datapiloten.be/sensors#lora.3432333857376518@2020-06-30T14:32:57.785Z> <http://www.w3.org/ns/sosa/observes> <https://w3id.org/cot/PM1> .
      <https://streams.datapiloten.be/sensors#lora.3432333857376518@2020-06-30T14:32:57.785Z> <http://www.w3.org/ns/sosa/observes> <https://w3id.org/cot/PM25> .
      <https://streams.datapiloten.be/sensors> <https://w3id.org/tree#member> <https://streams.datapiloten.be/sensors#lora.3432333857376518@2020-06-30T14:32:57.732Z> .
      <https://streams.datapiloten.be/sensors> <https://w3id.org/tree#member> <https://streams.datapiloten.be/sensors#lora.3432333857376518@2020-06-30T14:32:57.784Z> .
      <https://streams.datapiloten.be/sensors> <https://w3id.org/tree#member> <https://streams.datapiloten.be/sensors#lora.3432333857376518@2020-06-30T14:32:57.785Z> .
      <https://streams.datapiloten.be/sensors> <https://w3id.org/tree#member> <urn:ngsi-v2:cot-imec-be:device:imec-airquality-mobile-55vA4L2hoZ3VA48YJQcUiJ#@2020-06-30T14:32:57.785Z> .
      <https://streams.datapiloten.be/sensors> <https://w3id.org/tree#shape> _:b0 .
      <https://streams.datapiloten.be/sensors> <https://w3id.org/tree#view> <https://streams.datapiloten.be/sensors?page=1> .
      <https://streams.datapiloten.be/sensors?page=1> <http://www.w3.org/ns/hydra/core#next> <https://streams.datapiloten.be/sensors?page=2> .
      <https://streams.datapiloten.be/sensors?page=1> <https://w3id.org/tree#relation> _:b13 .
      <urn:ngsi-v2:cot-imec-be:device:imec-airquality-mobile-55vA4L2hoZ3VA48YJQcUiJ#@2020-06-30T14:32:57.785Z> <http://purl.org/dc/terms/isVersionOf> <urn:ngsi-v2:cot-imec-be:device:imec-airquality-mobile-55vA4L2hoZ3VA48YJQcUiJ> .
      <urn:ngsi-v2:cot-imec-be:device:imec-airquality-mobile-55vA4L2hoZ3VA48YJQcUiJ#@2020-06-30T14:32:57.785Z> <http://www.opengis.net/ont/geosparql#hasGeometry> _:b9 .
      <urn:ngsi-v2:cot-imec-be:device:imec-airquality-mobile-55vA4L2hoZ3VA48YJQcUiJ#@2020-06-30T14:32:57.785Z> <http://www.w3.org/ns/prov#generatedAtTime> "2020-06-30T14:32:57.785Z"^^xsd:dateTime .
      <urn:ngsi-v2:cot-imec-be:device:imec-airquality-mobile-55vA4L2hoZ3VA48YJQcUiJ#@2020-06-30T14:32:57.785Z> <http://www.w3.org/ns/sosa/observes> <https://w3id.org/cot/PM10> .
      _:b0 <https://www.w3.org/ns/shacl#property> _:b1 .
      _:b0 <https://www.w3.org/ns/shacl#property> _:b2 .
      _:b0 <https://www.w3.org/ns/shacl#property> _:b3 .
      _:b0 <https://www.w3.org/ns/shacl#property> _:b6 .
      _:b1 <https://www.w3.org/ns/shacl#maxCount> "1"^^xsd:integer .
      _:b1 <https://www.w3.org/ns/shacl#minCount> "1"^^xsd:integer .
      _:b1 <https://www.w3.org/ns/shacl#nodeKind> <https://www.w3.org/ns/shacl#IRI> .
      _:b1 <https://www.w3.org/ns/shacl#path> <http://purl.org/dc/terms/isVersionOf> .
      _:b10 <http://www.opengis.net/ont/geosparql#asWKT> "POINT (4.8376199416816235 50.977539075538516)"^^<http://www.opengis.net/ont/geosparql#wktLiteral> .
      _:b11 <http://www.opengis.net/ont/geosparql#asWKT> "POINT (4.8376199416816235 50.977539075538516)"^^<http://www.opengis.net/ont/geosparql#wktLiteral> .
      _:b12 <http://www.opengis.net/ont/geosparql#asWKT> "POINT (4.8376199416816235 50.977539075538516)"^^<http://www.opengis.net/ont/geosparql#wktLiteral> .
      _:b13 <http://www.w3.org/1999/02/22-rdf-syntax-ns#type> <https://w3id.org/tree#GreaterThanRelation> .
      _:b13 <https://w3id.org/tree#node> <https://streams.datapiloten.be/sensors?page=2> .
      _:b13 <https://w3id.org/tree#path> <http://www.w3.org/ns/prov#generatedAtTime> .
      _:b13 <https://w3id.org/tree#value> "2020-06-30T14:48:52.013Z"^^xsd:dateTime .
      _:b2 <https://www.w3.org/ns/shacl#datatype> xsd:dateTime .
      _:b2 <https://www.w3.org/ns/shacl#maxCount> "1"^^xsd:integer .
      _:b2 <https://www.w3.org/ns/shacl#minCount> "1"^^xsd:integer .
      _:b2 <https://www.w3.org/ns/shacl#path> <http://www.w3.org/ns/prov#generatedAtTime> .
      _:b3 <https://www.w3.org/ns/shacl#maxCount> "1"^^xsd:integer .
      _:b3 <https://www.w3.org/ns/shacl#minCount> "1"^^xsd:integer .
      _:b3 <https://www.w3.org/ns/shacl#node> _:b4 .
      _:b3 <https://www.w3.org/ns/shacl#path> <http://www.opengis.net/ont/geosparql#hasGeometry> .
      _:b4 <https://www.w3.org/ns/shacl#property> _:b5 .
      _:b5 <https://www.w3.org/ns/shacl#datatype> <http://www.opengis.net/ont/geosparql#wktLiteral> .
      _:b5 <https://www.w3.org/ns/shacl#maxCount> "1"^^xsd:integer .
      _:b5 <https://www.w3.org/ns/shacl#minCount> "1"^^xsd:integer .
      _:b5 <https://www.w3.org/ns/shacl#path> <http://www.opengis.net/ont/geosparql#asWKT> .
      _:b6 <https://www.w3.org/ns/shacl#minCount> "1"^^xsd:integer .
      _:b6 <https://www.w3.org/ns/shacl#nodeKind> <https://www.w3.org/ns/shacl#IRI> .
      _:b6 <https://www.w3.org/ns/shacl#path> <http://www.w3.org/ns/sosa/observes> .
      _:b7 <http://www.opengis.net/ont/geosparql#asWKT> "POINT (4.8376199416816235 50.977539075538516)"^^<http://www.opengis.net/ont/geosparql#wktLiteral> .
      _:b8 <http://www.opengis.net/ont/geosparql#asWKT> "POINT (4.8376199416816235 50.977539075538516)"^^<http://www.opengis.net/ont/geosparql#wktLiteral> .
      _:b9 <http://www.opengis.net/ont/geosparql#asWKT> "POINT (4.415566977113485 51.23746876604855)"^^<http://www.opengis.net/ont/geosparql#wktLiteral> .
    `

    const sensorCollections = new Map()
    sensorCollections.set("https://streams.datapiloten.be/sensors", {
      "@context": collectionContext,
      "@id": "https://streams.datapiloten.be/sensors",
      "member": [{
          "@id": "https://streams.datapiloten.be/sensors#lora.3432333857376518@2020-06-30T14:32:57.732Z",
        },
        {
          "@id": "https://streams.datapiloten.be/sensors#lora.3432333857376518@2020-06-30T14:32:57.784Z",
        },
        {
          "@id": "https://streams.datapiloten.be/sensors#lora.3432333857376518@2020-06-30T14:32:57.785Z",
        },
        {
          "@id": "urn:ngsi-v2:cot-imec-be:device:imec-airquality-mobile-55vA4L2hoZ3VA48YJQcUiJ#@2020-06-30T14:32:57.785Z",
        }
      ],
      "shape": [{
        "https://www.w3.org/ns/shacl#property": [{
            "https://www.w3.org/ns/shacl#maxCount": [{
              "@type": "http://www.w3.org/2001/XMLSchema#integer",
              "@value": "1"
            }],
            "https://www.w3.org/ns/shacl#minCount": [{
              "@type": "http://www.w3.org/2001/XMLSchema#integer",
              "@value": "1"
            }],
            "https://www.w3.org/ns/shacl#nodeKind": [{
              "@id": "https://www.w3.org/ns/shacl#IRI",
            }],
            "https://www.w3.org/ns/shacl#path": [{
              "@id": "http://purl.org/dc/terms/isVersionOf",
            }],
          },
          {
            "https://www.w3.org/ns/shacl#datatype": [{
              "@id": "http://www.w3.org/2001/XMLSchema#dateTime",
            }],
            "https://www.w3.org/ns/shacl#maxCount": [{
              "@type": "http://www.w3.org/2001/XMLSchema#integer",
              "@value": "1",
            }],
            "https://www.w3.org/ns/shacl#minCount": [{
              "@type": "http://www.w3.org/2001/XMLSchema#integer",
              "@value": "1",
            }],
            "https://www.w3.org/ns/shacl#path": [{
              "@id": "http://www.w3.org/ns/prov#generatedAtTime",
            }],
          },
          {
            "https://www.w3.org/ns/shacl#maxCount": [{
              "@type": "http://www.w3.org/2001/XMLSchema#integer",
              "@value": "1",
            }],
            "https://www.w3.org/ns/shacl#minCount": [{
              "@type": "http://www.w3.org/2001/XMLSchema#integer",
              "@value": "1",
            }],
            "https://www.w3.org/ns/shacl#node": [{
              "https://www.w3.org/ns/shacl#property": [{
                "https://www.w3.org/ns/shacl#datatype": [{
                  "@id": "http://www.opengis.net/ont/geosparql#wktLiteral",
                }],
                "https://www.w3.org/ns/shacl#maxCount": [{
                  "@type": "http://www.w3.org/2001/XMLSchema#integer",
                  "@value": "1",
                }],
                "https://www.w3.org/ns/shacl#minCount": [{
                  "@type": "http://www.w3.org/2001/XMLSchema#integer",
                  "@value": "1",
                }],
                "https://www.w3.org/ns/shacl#path": [{
                  "@id": "http://www.opengis.net/ont/geosparql#asWKT",
                }],
              }]
            }],
            "https://www.w3.org/ns/shacl#path": [{
              "@id": "http://www.opengis.net/ont/geosparql#hasGeometry",
            }],
          }, {
            "https://www.w3.org/ns/shacl#minCount": [{
              "@type": "http://www.w3.org/2001/XMLSchema#integer",
              "@value": "1"
            }],
            "https://www.w3.org/ns/shacl#nodeKind": [{
              "@id": "https://www.w3.org/ns/shacl#IRI"
            }],
            "https://www.w3.org/ns/shacl#path": [{
              "@id": "http://www.w3.org/ns/sosa/observes"
            }],
          }
        ],
      }],
      "view": [{
        "@id": "https://streams.datapiloten.be/sensors?page=1"
      }]
    })

    // blank node ids are required to reference the relevant objects
    const sensorNodes = new Map();
    sensorNodes.set("https://streams.datapiloten.be/sensors?page=1", {
      "@context": context,
      "@id": "https://streams.datapiloten.be/sensors?page=1",
      "relation": [
        {
          "@id": "_:b8_b13"
        }, {
          "@id": "_:nextRelation-0"
        }
      ]
    })

    // blank node ids are required to reference the relevant objects
    const sensorRelations = new Map();
    sensorRelations.set('_:b8_b13', {
      "@context": context,
      "@id": "_:b8_b13",
      "@type": [ns.tree("GreaterThanRelation")],
      "node": [{
        "@id": "https://streams.datapiloten.be/sensors?page=2"
      }],
      "path": [{
        "@id": "http://www.w3.org/ns/prov#generatedAtTime"
      }],
      "value": [{
        "@type": ns.xsd("dateTime"),
        "@value": "2020-06-30T14:48:52.013Z"
      }]
    })
    sensorRelations.set('_:nextRelation-0', {
      "@context": context,
      "@id": "_:nextRelation-0",
      "@type": [ns.tree("Relation")],
      "node": [{
        "@id": "https://streams.datapiloten.be/sensors?page=2"
      }]
    })

    const sensordataResult = {
      collections: sensorCollections,
      nodes: sensorNodes,
      relations: sensorRelations,
    }

    test(sensordatatest, sensordataResult, "Should be able to extract all metadata for the example sensor data.")


    var t = `
    @prefix ex: <${ns.ex('')}> . 
    @prefix hydra: <${ns.hydra('')}> . 
    @prefix tree: <${ns.tree('')}> . 
    @prefix xsd: <${ns.xsd('')}> . 
    ex:c1 a tree:Collection ;
      tree:view ex:node1 .
    
    ex:node1 a tree:Node;
      tree:relation ex:relation1 .

    ex:relation1 a tree:SubstringRelation ;
      tree:remainingItems "10"^^xsd:integer ;
      tree:path ex:predicatePath ;
      tree:value "substr1" ;
      tree:value "substr2" ;
      tree:node ex:Node2 .
    `
    var r = {
      collections: new Map([
        [ns.ex("c1"), {
          "@context": collectionContext,
          "@id": ns.ex("c1"),
          "@type": [ ns.tree('Collection') ],
          "view": [
            {
              "@id": "http://example.com/node1"
            }
          ]
        }],
      ]),
      nodes: new Map([
        [ns.ex('node1'), { 
          "@context": context,
          "@id": ns.ex('node1'),
          "@type": [ ns.tree('Node') ],
          "relation": [ { "@id": ns.ex("relation1") } ]
        }],
      ]),
      relations: new Map([
        [ns.ex('relation1'), { 
          "@context": context,
          "@id": ns.ex("relation1"),
          "@type": [ns.tree('SubstringRelation')],
          "node": [{
            "@id": ns.ex("Node2")
          }],
          "path": [{
            "@id": ns.ex("predicatePath")
          }],
          "remainingItems": [{
            "@value": "10",
            "@type": ns.xsd("integer"),
          }],
          "value": [{
            "@value": "substr1",
            "@type": ns.xsd("string"),
          }, {
            "@value": "substr2",
            "@type": ns.xsd("string"),
          }]
        } ]
      ]),
    }   

    test(t, r, "Should be able to extract multiple values for the same relation")
  })
