/* global describe, it */

import assert from 'assert'
import { blankNode } from '../lib/blankNode.js'
import * as rdf from '@rdf-esm/data-model'

describe('blankNode', () => {
  it('should be a function', () => {
    assert.strictEqual(typeof blankNode, 'function')
  })

  it('should convert a Blank Node to a N-Triples string', () => {
    const node = rdf.blankNode()

    assert.strictEqual(blankNode(node), `_:${node.value}`)
  })
})
