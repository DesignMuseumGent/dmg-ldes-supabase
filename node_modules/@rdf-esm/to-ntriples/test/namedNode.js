/* global describe, it */

import assert from 'assert'
import { namedNode } from '../lib/namedNode.js'
import * as rdf from '@rdf-esm/data-model'

describe('namedNode', () => {
  it('should be a function', () => {
    assert.strictEqual(typeof namedNode, 'function')
  })

  it('should convert a Named Node to a N-Triples string', () => {
    const node = rdf.namedNode('http://example.org/namedNode')

    assert.strictEqual(namedNode(node), `<${node.value}>`)
  })
})
