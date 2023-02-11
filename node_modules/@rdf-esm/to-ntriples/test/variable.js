/* global describe, it */

import assert from 'assert'
import { variable } from '../lib/variable.js'
import * as rdf from '@rdf-esm/data-model'

describe('variable', () => {
  it('should be a function', () => {
    assert.strictEqual(typeof variable, 'function')
  })

  it('should convert a Variable to a N-Triples string', () => {
    const v = rdf.variable('test')

    assert.strictEqual(variable(v), `?${v.value}`)
  })
})
