/* global describe, it */

import assert from 'assert'
import { defaultGraph } from '../lib/defaultGraph.js'
import * as rdf from '@rdf-esm/data-model'

describe('defaultGraph', () => {
  it('should be a function', () => {
    assert.strictEqual(typeof defaultGraph, 'function')
  })

  it('should convert a Default Graph to a N-Triples string', () => {
    assert.strictEqual(defaultGraph(rdf.defaultGraph()), '')
  })
})
