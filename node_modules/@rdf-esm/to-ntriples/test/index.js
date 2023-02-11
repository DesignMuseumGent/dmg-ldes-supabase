/* global describe, it */

import assert from 'assert'
import { quad } from '../lib/quad.js'
import { term } from '../lib/term.js'
import * as lib from '../index.js'

describe('to-ntriples', () => {
  it('should expose quadToNTriples', () => {
    assert.strictEqual(typeof lib.quadToNTriples, 'function')
    assert.strictEqual(quad, lib.quadToNTriples)
  })

  it('should expose termToNTriples', () => {
    assert.strictEqual(typeof lib.termToNTriples, 'function')
    assert.strictEqual(term, lib.termToNTriples)
  })
})
