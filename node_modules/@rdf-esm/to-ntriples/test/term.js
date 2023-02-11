/* global describe, it */

import assert from 'assert'
import { term } from '../lib/term.js'
import * as rdf from '@rdf-esm/data-model'

describe('term', () => {
  it('should be a function', () => {
    assert.deepStrictEqual(typeof term, 'function')
  })

  it('should convert a Blank Node to a N-Triples string', () => {
    const blankNode = rdf.blankNode()

    assert.deepStrictEqual(term(blankNode), `_:${blankNode.value}`)
  })

  it('should convert a Default Graph to a N-Triples string', () => {
    assert.deepStrictEqual(term(rdf.defaultGraph()), '')
  })

  it('should convert a Literal to a N-Triples string', () => {
    const literal = rdf.literal('test')

    assert.deepStrictEqual(term(literal), `"${literal.value}"`)
  })

  it('should convert a Named Node to a N-Triples string', () => {
    const namedNode = rdf.namedNode()

    assert.deepStrictEqual(term(namedNode), `<${namedNode.value}>`)
  })

  it('should convert a Variable to a N-Triples string', () => {
    const variable = rdf.variable()

    assert.deepStrictEqual(term(variable), `?${variable.value}`)
  })
})
