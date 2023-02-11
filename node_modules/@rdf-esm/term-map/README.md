# @rdf-esm/term-map

A Map for RDF/JS Terms keys.

This package implements the JavaScript Map interface exclusively for RDF/JS Terms keys and treats Terms with the same N-Triples representation as they are the same object.

## Fork alert :exclamation:

This package is an ES Modules fork of [@rdfjs/term-map](https://npm.im/@rdfjs/term-map)

The original, commonjs version is used node environment.

## Usage

The package exports the constructor of the Term-Map.
New instances can be created just like JavaScript Maps:

```js
import * as rdf from '@rdf-esm/data-model'
import TermMap from '@rdf-esm/term-map'

const terms = new TermMap([
  [rdf.namedNode('http://example.org/'), { data: 1 }],
  [rdf.literal('test'), { data: 2 }]
])

// The rdf factory will return a new instance of the literal,
// but the TermMap will check for the N-Triple representation.
// That's why the output will be: "true"
console.log(terms.has(rdf.literal('test')))
```
