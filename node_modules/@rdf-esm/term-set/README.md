# @rdf-esm/term-set

[![Build Status](https://github.com/rdf-esm/term-set/workflows/Test/badge.svg)](https://github.com/rdf-esm/term-set/actions?query=workflow%3ATest)

[![npm version](https://img.shields.io/npm/v/@rdf-esm/term-set.svg)](https://www.npmjs.com/package/@rdf-esm/term-set)

A Set for RDFJS Terms.

This package implements the JavaScript Set interface exclusively for RDFJS Terms and treats Terms with the same N-Triples representation as they are the same object.

## Fork alert :exclamation:

This package is an ES Modules fork of [@rdfjs/term-set](https://npm.im/@rdfjs/term-set)

The original, commonjs version is used node environment.

## Usage

The package exports the constructor of the Term-Set.
New instances can be created just like JavaScript Sets:

```js
import * as rdf from '@rdf-esm/data-model'
import TermSet from '@rdf-esm/term-set'

const terms = new TermSet([
  rdf.namedNode('http://example.org/'),
  rdf.literal('test')
])

// The rdf factory will return a new instance of the literal,
// but the Term-Set will check for the N-Triple representation.
// That's why the output will be: "true"
console.log(terms.has(rdf.literal('test')))
```
