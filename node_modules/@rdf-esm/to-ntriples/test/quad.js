/* global describe, it */

import assert from 'assert'
import { quad } from '../lib/quad.js'
import * as rdf from '@rdf-esm/data-model'

describe('quad', () => {
  it('should be a function', () => {
    assert.strictEqual(typeof quad, 'function')
  })

  it('should convert a Quad to a N-Triples string', () => {
    const q = rdf.quad(
      rdf.blankNode(),
      rdf.namedNode('http://example.org/predicate'),
      rdf.literal('object'),
      rdf.namedNode('http://example.org/graph')
    )

    const expected = `_:${q.subject.value} <${q.predicate.value}> "${q.object.value}" <${q.graph.value}> .`

    assert.deepStrictEqual(quad(q), expected)
  })

  it('should convert a Quad with Default Graph to a N-Triples string', () => {
    const q = rdf.quad(
      rdf.blankNode(),
      rdf.namedNode('http://example.org/predicate'),
      rdf.literal('object')
    )

    const expected = `_:${q.subject.value} <${q.predicate.value}> "${q.object.value}" .`

    assert.deepStrictEqual(quad(q), expected)
  })
})
