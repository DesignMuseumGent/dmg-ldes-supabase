## TREE metadata extraction
This library handles the extraction of [TREE](https://treecg.github.io/specification/) metadata from RDF data.

### Installation

#### Node
```
const extractMetadata = require('@treecg/tree-metadata-extraction').extractMetadata
```

#### typescript
```
import { extractMetadata } from '@treecg/tree-metadata-extraction';
```

### Usage

```
// quads is an array of RDF Quads (RDF.Quad[])
const metadata = extractMetadata(quads)

// Retrieve extracted collections metadata
for (const collectionId of metadata.collections.keys()) {
  const collection = metadata.collections.get(collectionId)
}

// Retrieve extracted nodes metadata
for (const nodeId of metadata.nodes.keys()) {
  const node = metadata.nodes.get(nodeId)
}

// Retrieve extracted relations metadata
for (const relationId of metadata.relations.keys()) {
  const relation = metadata.relations.get(relationId)
}
```

### Extracted metadata
In this section, the extracted fields per class are listed.
In the case an Object is returned, it can have arbitrary fields that are not listed below.

| Object                | Metadata field      | type                  | referenced object type |
|-----------------------|---------------------|-----------------------|------------------------|
| Collection            | @id                 | string                |                        |
|                       | @type               | [ string ]            |                        |
|                       | view                | [ URI ]               | Node                   |
|                       | subset              | [ URI ]               | Node                   |
|                       | member              | [ URI ]               | Member                 |
|                       | shape               | [ Shape ]             |                        |
|                       | totalItems          | [ Literal ]           |                        |
|                       | import              | [ URI ]               |                        |
|                       | importStream        | [ URI ]               |                        |
|                       | conditionalImport   | [ ConditionalImport ] |                        |
|                       | ...                 | [ any ]               |                        |
| Node                  | @id                 | string                |                        |
|                       | @type               | [ string ]            |                        |
|                       | relation            | [ URI ]               | Relation               |
|                       | search              | [ object ]            |                        |
|                       | retentionPolicy     | [ RetentionPolicy ]   |                        |
|                       | import              | [ object ]            |                        |
|                       | importStream        | [ object ]            |                        |
|                       | conditionalImport   | [ ConditionalImport ] |                        |
|                       | ...                 | [ any ]               |                        |
| Relation              | @id                 | string                |                        |      
|                       | @type               | [ string ]            |                        |
|                       | remainingItems      | [ Literal ]           |                        |
|                       | path                | [ object ]            | shacl:propertyPath     |
|                       | value               | [ object ]            |                        |
|                       | node                | [ URI ]               | Node                   |
|                       | import              | [ URI ]               |                        |
|                       | importStream        | [ URI ]               |                        |
|                       | conditionalImport   | [ ConditionalImport ] |                        |
| Member                | ...                 | [ any ]               |                        |
| Shape                 | ...                 | [ any ]               | shacl:NodeShape / shex:Shape |
| IriTemplate           | ...                 | [ any ]               | hydra:IriTemplate      |
| ConditionalImport     | path                | [ object ]            | shacl:propertyPath     |
|                       | import              | [ URI ]               |                        |
|                       | importStream        | [ URI ]               |                        |
| RetentionPolicy       | @type               | [ string ]            |                        |
|                       | amount              | [ Literal ]           |                        |
|                       | versionKey          | [ object ]            |                        |
|                       | path                | [ object ]            | shacl:propertyPath     |
|                       | value               | [ object ]            |                        |
| Literal               | @value              | [ string ]            |                        |
|                       | @type               | [ string ]            |                        |
|                       | @language           | [ string ]            |                        |
| URI                   | @id                 | string                |                        |
| object                | @id                 | string                |                        |
|                       | ...                 | [ any ]               |                        |


```
Note: Blank node URIs can be returned as a URI. 
We expect any additional data used in combination with the extracted metadata to be retrieved from the same rdfjs data factory.
```

### Examples

#### Retrieve the ids of all members of all collections available in the quad array.
```
// Parse the input into a quad array
const quads = parse(input)

// Extract the tree metadata from the quad array
const metadata = extractMetadata(quads)

const memberIds = []

// Retrieve extracted collections metadata
for (const collectionId of metadata.collections.keys()) {
  // Get the collection object
  const collection = metadata.collections.get(collectionId)
  // Map the member URIs to extract the @id values
  const memberURIs = collection.member.map(uri => uri["@id"])
  // Store the @id values
  memberIds = memberIds.concat(memberURIs)
}

return memberIds
```