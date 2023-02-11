/* global describe, it */

import assert from 'assert'
import { literal } from '../lib/literal.js'
import * as rdf from '@rdf-esm/data-model'

describe('literal', () => {
  it('should be a function', () => {
    assert.strictEqual(typeof literal, 'function')
  })

  it('should convert a Literal to a N-Triples string', () => {
    const l = rdf.literal('test')

    assert.strictEqual(literal(l), `"${l.value}"`)
  })
})
