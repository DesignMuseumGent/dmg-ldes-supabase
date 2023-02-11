import * as RDF from 'rdf-js'
import * as N3 from 'n3'
import ns from '../util/NameSpaces'
import { RelationType, Literal, Collection, Node, Relation, ConditionalImport, RetentionPolicy } from '../util/Util';

const context: any = { "@vocab": ns.tree('') }
const collectionContext: any = { "@vocab": ns.tree(''), "subset": ns.void("subset") }

export async function extractMetadata (quads: RDF.Quad[]) {
  // Create triple store of data quads
  const store : N3.Store = await new N3.Store(quads as N3.Quad[]) // have some issues with BaseQuad typing.

  const collectionIds = await extractCollectionids(store)
  const nodeIds = await extractNodeIds(store)
  const relationIds = await extractRelationIds(store)

  const collectionsMetadata = new Map();
  const nodesMetadata = new Map();
  const relationsMetadata = new Map();

  for (let id of collectionIds) {
    const metadata = await extractCollectionData(store, id)
    collectionsMetadata.set(id, metadata)
  }
  
  for (let id of nodeIds) {
    const metadata = await extractNodeData(store, id)
    nodesMetadata.set(id, metadata.node)

    // Set the dummy relations generated for the hydra:next and as:next predicates
    metadata.relations.map(relation => relationsMetadata.set(relation["@id"], relation))
  }
  for (let id of relationIds) {
    const metadata = await extractRelationMetadata(store, id)
    relationsMetadata.set(id, metadata)
    
  }
  return {collections: collectionsMetadata, nodes: nodesMetadata, relations: relationsMetadata}
}

/**
 * Extract the ids of the collections from the store
 * @param store 
 */
function extractCollectionids(store: N3.Store) {
  let ids: string[] = []
  // Search for collection ids on type
  ids = ids.concat( store.getQuads(null, ns.rdf('type'), ns.tree('Collection'), null).map(quad => quad.subject.id) );
  ids = ids.concat( store.getQuads(null, ns.rdf('type'), ns.ldes('EventStream'), null).map(quad => quad.subject.id) );
  ids = ids.concat( store.getQuads(null, ns.rdf('type'), ns.hydra('Collection'), null).map(quad => quad.subject.id) );
  ids = ids.concat( store.getQuads(null, ns.rdf('type'), ns.as('Collection'), null).map(quad => quad.subject.id) );
  ids = ids.concat( store.getQuads(null, ns.rdf('type'), ns.as('OrderedCollection'), null).map(quad => quad.subject.id) );
  ids = ids.concat( store.getQuads(null, ns.rdf('type'), ns.dct('Collection'), null).map(quad => quad.subject.id) );
  ids = ids.concat( store.getQuads(null, ns.rdf('type'), ns.ldp('Container'), null).map(quad => quad.subject.id) );

  // Search for collection ids on view
  ids = ids.concat( store.getQuads(null, ns.tree('view'), null, null).map(quad => quad.subject.id) );
  ids = ids.concat( store.getQuads(null, ns.hydra('view'), null, null).map(quad => quad.subject.id) );
  ids = ids.concat( store.getQuads(null, ns.void('subset'), null, null).map(quad => quad.subject.id) );
  // reverse view properties
  ids = ids.concat( store.getQuads(null, ns.dct('isPartOf'), null, null).map(quad => quad.object.id) );
  ids = ids.concat( store.getQuads(null, ns.as('partOf'), null, null).map(quad => quad.object.id) );

  // Search for collection ids on members
  ids = ids.concat( store.getQuads(null, ns.tree('member'), null, null).map(quad => quad.subject.id) );
  ids = ids.concat( store.getQuads(null, ns.hydra('member'), null, null).map(quad => quad.subject.id) );
  ids = ids.concat( store.getQuads(null, ns.ldp('contains'), null, null).map(quad => quad.subject.id) );
  return Array.from(new Set(ids))
}

/**
 * Extract the ids of the nodes from the store
 * @param store 
 */
function extractNodeIds(store: N3.Store) {
  let ids: string[] = []

  // Search for node ids on type
  ids = ids.concat( store.getQuads(null, ns.rdf('type'), ns.tree('Node'), null).map(quad => quad.subject.id) );
  ids = ids.concat( store.getQuads(null, ns.rdf('type'), ns.hydra('PartialCollectionView'), null).map(quad => quad.subject.id) );
  ids = ids.concat( store.getQuads(null, ns.rdf('as'), ns.hydra('CollectionPage'), null).map(quad => quad.subject.id) );
  ids = ids.concat( store.getQuads(null, ns.rdf('as'), ns.hydra('OrderedCollectionPage'), null).map(quad => quad.subject.id) );

  // // Searching on view causes nodes to be displayed that still need to be retrieved form another page
  // // Search for node ids on view
  // ids = ids.concat( store.getQuads(null, ns.tree('view'), null, null).map(quad => quad.object.id) );
  // ids = ids.concat( store.getQuads(null, ns.hydra('view'), null, null).map(quad => quad.object.id) );
  // ids = ids.concat( store.getQuads(null, ns.void('subset'), null, null).map(quad => quad.object.id) );
  // // reverse view properties
  // ids = ids.concat( store.getQuads(null, ns.dct('isPartOf'), null, null).map(quad => quad.subject.id) );
  // ids = ids.concat( store.getQuads(null, ns.as('partOf'), null, null).map(quad => quad.subject.id) );

  // Search for node ids on their properties
  ids = ids.concat( store.getQuads(null, ns.tree('search'), null, null).map(quad => quad.subject.id) );
  ids = ids.concat( store.getQuads(null, ns.tree('relation'), null, null).map(quad => quad.subject.id) );
  ids = ids.concat( store.getQuads(null, ns.ldes('retentionPolicy'), null, null).map(quad => quad.subject.id) );
  ids = ids.concat( store.getQuads(null, ns.hydra('next'), null, null).map(quad => quad.subject.id) );
  ids = ids.concat( store.getQuads(null, ns.as('next'), null, null).map(quad => quad.subject.id) );
  return Array.from(new Set(ids))
}

/**
 * Extract the ids of the relations from the store
 * @param store 
 */
function extractRelationIds(store: N3.Store) {
  let ids: string[] = []
  // Search for node ids
  ids = ids.concat( store.getQuads(null, ns.tree('relation'), null, null).map(quad => quad.object.id) );
  ids = ids.concat( store.getQuads(null, ns.tree('node'), null, null).map(quad => quad.subject.id) );
  return Array.from(new Set(ids))
}

function extractCollectionData(store: N3.Store, id: string) {
  const c : Collection = { 
    "@context": collectionContext,
    "@id": id,
   }

  // Extract collection type
  setField(c, "@type", store.getQuads(id, ns.rdf('type'), null, null).map(quad => quad.object.id));

  // Extract view ids
  setField(c, "view", store.getQuads(id, ns.tree('view'), null, null).map(quad => retrieveTerm(store, quad.object)));
  setField(c, "view", store.getQuads(id, ns.hydra('view'), null, null).map(quad => retrieveTerm(store, quad.object)));
  setField(c, "subset", store.getQuads(id, ns.void('subset'), null, null).map(quad => retrieveTerm(store, quad.object)));
  // reverse properties
  setField(c, "subset", store.getQuads(null, ns.dct('isPartOf'), id, null).map(quad => retrieveTerm(store, quad.subject)));
  setField(c, "subset", store.getQuads(null, ns.as('partOf'), id, null).map(quad => retrieveTerm(store, quad.subject)));
  
  // Extract member ids
  setField(c, "member", store.getQuads(id, ns.tree('member'), null, null).map(quad => retrieveTerm(store, quad.object)));
  setField(c, "member", store.getQuads(id, ns.hydra('member'), null, null).map(quad => retrieveTerm(store, quad.object)));
  setField(c, "member", store.getQuads(id, ns.as('items'), null, null).map(quad => retrieveTerm(store, quad.object)));
  setField(c, "member", store.getQuads(id, ns.hydra('contains'), null, null).map(quad => retrieveTerm(store, quad.object)));

  // Extract shape objects
  setField(c, "shape", store.getQuads(id, ns.tree('shape'), null, null).map(quad => retrieveFullObject(store, quad.object)));
  setField(c, "shape", store.getQuads(id, ns.st('validatedBy'), null, null).map(quad => retrieveFullObject(store, quad.object)));

  // Extract full import objects
  setField(c, "import", store.getQuads(id, ns.tree('import'), null, null).map(quad => retrieveTerm(store, quad.object)));
  setField(c, "importStream", store.getQuads(id, ns.tree('importStream'), null, null).map(quad => retrieveTerm(store, quad.object)));
  setField(c, "conditionalImport", store.getQuads(id, ns.tree('conditionalImport'), null, null).map(quad => retrieveConditionalImportData(store, quad.object)));

  // Extract totalItems
  setField(c, "totalItems", store.getQuads(id, ns.hydra('totalItems'), null, null).map(quad => retrieveTerm(store, quad.object)));

  // TODO:: extract additional metadata?

  return c;
}

function extractNodeData(store: N3.Store, id: string) {
  const n : Node = { 
    "@context": context,
    "@id": id,
   }

  // Extract node type
  setField(n, "@type", store.getQuads(id, ns.rdf('type'), null, null).map(quad => quad.object.id));

  // extract full search object
  setField(n, "search", store.getQuads(id, ns.tree('search'), null, null).map(quad => retrieveFullObject(store, quad.object)));
  
  // Extract relation ids
  setField(n, "relation", store.getQuads(id, ns.tree('relation'), null, null).map(quad => retrieveTerm(store, quad.object)));

  // Extract retentionPolicy
  setField(n, "retentionPolicy", store.getQuads(id, ns.ldes('retentionPolicy'), null, null).map(quad => retrieveRetentionPolicyData(store, quad.object)));

  // Extract full import objects
  setField(n, "import", store.getQuads(id, ns.tree('import'), null, null).map(quad => retrieveFullObject(store, quad.object)));
  setField(n, "importStream", store.getQuads(id, ns.tree('importStream'), null, null).map(quad => retrieveFullObject(store, quad.object)));
  setField(n, "conditionalImport", store.getQuads(id, ns.tree('conditionalImport'), null, null).map(quad => retrieveConditionalImportData(store, quad.object)));

  // Extract next links
  let nextQuads = store.getQuads(id, ns.hydra('next'), null, null).concat(store.getQuads(id, ns.as('next'), null, null))
  let generatedNextDummyRelations = nextQuads.map((quad, index) => createNextDummyRelation(quad.subject.id, quad.object.id, index))
  
  setField(n, "relation", generatedNextDummyRelations.map(relation => { return({"@id": relation["@id"] }) }) );

  // TODO:: extract additional metadata?
  return {node: n, relations: generatedNextDummyRelations};
}

function extractRelationMetadata(store: N3.Store, id: string) {
  const r : Relation = { 
    "@context": context,
    "@id": id,
   }

  // Extract relation type
  setField(r, "@type", store.getQuads(id, ns.rdf('type'), null, null).map(quad =>  quad.object.id));
  
  // Extract remaining Items literal 
  setField(r, "remainingItems", store.getQuads(id, ns.tree('remainingItems'), null, null).map(quad => retrieveFullObject(store, quad.object)));
  
  // Extract full path object
  setField(r, "path", store.getQuads(id, ns.tree('path'), null, null).map(quad => retrieveFullObject(store, quad.object)));

  // Extract full value object
  setField(r, "value", store.getQuads(id, ns.tree('value'), null, null).map(quad => retrieveFullObject(store, quad.object)));

  // Extract node id
  setField(r, "node", store.getQuads(id, ns.tree('node'), null, null).map(quad => retrieveTerm(store, quad.object)));

  // Extract full import objects
  setField(r, "import", store.getQuads(id, ns.tree('import'), null, null).map(quad => retrieveFullObject(store, quad.object)));
  setField(r, "importStream", store.getQuads(id, ns.tree('importStream'), null, null).map(quad => retrieveFullObject(store, quad.object)));
  setField(r, "conditionalImport", store.getQuads(id, ns.tree('conditionalImport'), null, null).map(quad => retrieveConditionalImportData(store, quad.object)));
  return r;
}

function retrieveRetentionPolicyData(store: N3.Store, term: N3.Term) {
  const rp : RetentionPolicy = { }
  if (N3.Util.isNamedNode(term)) { 
    rp ["@id"] = term.value 
  }
  const id = term.id
  // Extract retention policy data
  setField(rp, "@type", store.getQuads(id, ns.rdf('type'), null, null).map(quad => quad.object.id));
  setField(rp, "amount", store.getQuads(id, ns.ldes('amount'), null, null).map(quad => retrieveTerm(store, quad.object)));
  setField(rp, "versionKey", store.getQuads(id, ns.ldes('versionKey'), null, null).map(quad => retrieveFullObject(store, quad.object)));
  setField(rp, "path", store.getQuads(id, ns.tree('path'), null, null).map(quad => retrieveFullObject(store, quad.object)));
  setField(rp, "value", store.getQuads(id, ns.tree('value'), null, null).map(quad => retrieveFullObject(store, quad.object)));
  return rp
}

function retrieveConditionalImportData(store: N3.Store, term: N3.Term) {
  const ci : ConditionalImport = { }
  if (N3.Util.isNamedNode(term)) { 
    ci ["@id"] = term.value 
  }
  const id = term.id
  // Extract full import objects
  setField(ci, "path", store.getQuads(id, ns.tree('path'), null, null).map(quad => retrieveFullObject(store, quad.object)));
  setField(ci, "import", store.getQuads(id, ns.tree('import'), null, null).map(quad => retrieveFullObject(store, quad.object)));
  setField(ci, "importStream", store.getQuads(id, ns.tree('importStream'), null, null).map(quad => retrieveFullObject(store, quad.object)));
  return ci;
}

/**
 * Retrieve base object
 * @param store 
 * @param term 
 * @param recursive 
 * @param processedIds 
 */
function retrieveTerm(store: N3.Store, term: N3.Term) {
  return retrieveFullObject(store, term, false)
}

/**
 * Recursively retrieve data by following all available predicates
 * @param store 
 * @param term 
 * @param recursive 
 * @param processedIds 
 */
function retrieveFullObject(store: N3.Store, term: N3.Term, recursive = true, processedIds : string[] = []){
  switch (term.termType) {
    case "Literal":
      return createLiteral(store, term as N3.Literal)
    case "BlankNode":
      if (recursive) {
        return createObject(store, term as N3.BlankNode, processedIds)
      } else {
        return { '@id': term.id }
      }
    case "NamedNode":
      if (recursive) {
        return createObject(store, term as N3.NamedNode, processedIds)
      } else {
        return { '@id': term.id }
      }
    default:
      // We do not process variables in metadata extraction.Literal
      return {};
  } 
}

function createNextDummyRelation (sourceURI: string, targetURI: string, index:number): Relation {
  // Generate unique blank Id
  let id = `_:nextRelation-${index}`
  const r : Relation = { 
    "@context": context,
    "@id": id,
   }
  setField(r, "@type", [ns.tree('Relation')] ) ;
  setField(r, "node", [{"@id": targetURI}] );
  return r;
}

/**
 * Create a literal object
 * @param store 
 * @param literal 
 */
const createLiteral = (store: N3.Store, literal: N3.Literal) : Literal => {
  const item : Literal = { "@value": literal.value }
  if (literal.datatype) item["@type"] = literal.datatype.id
  if (literal.language) item["@language"] = literal.language;
  return item;
}

/**
 * Create an object, and recursively add objects for all 
 * @param store 
 * @param namedNode 
 * @param processedIds 
 */
const createObject = (store: N3.Store, namedNode: N3.NamedNode | N3.BlankNode, processedIds: string[]) => {
  const item : any = namedNode.termType === "NamedNode" ? { "@id": namedNode.id } : {}
  const quads = store.getQuads(namedNode.id, null, null, null)
  for (let quad of quads) {
    if (quad.predicate.id === ns.rdf('type')) item["@type"] = quad.object.id
    else {
      // Check for circular dereferencing
      if (!quad.object.id || processedIds.indexOf(quad.object.id) === -1) {
        const newProcessedIds = processedIds.concat(quad.object.id)
        const object = retrieveFullObject(store, quad.object, true, newProcessedIds)
        item[quad.predicate.id] = item[quad.predicate.id] ? item[quad.predicate.id].concat([object]) : [object] 
      } else {
        console.error(`circular dependency discovered for ${quad.object.id}`)
        const object = {"@id": quad.object.id}
        item[quad.predicate.id] = item[quad.predicate.id] ? item[quad.predicate.id].concat([object]) : [object] 
      }
    }
  }
  return item
}

/**
 * Helper function. Only add a field if there is a value for this field.
 * If the field already has results, concatenate the new results.
 */
function setField(object: any, field: string, results: any[]) {
  if (results && results.length) {
    if (object[field] && object[field].length) {
      object[field] = object[field].concat(results)
    } else {
      object[field] = results
    }
  }
}