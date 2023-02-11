import { termToNTriples } from '@rdf-esm/to-ntriples'

export default class TermSet {
  constructor (terms) {
    this.index = new Map()

    if (terms) {
      for (const term of terms) {
        this.add(term)
      }
    }
  }

  get size () {
    return this.index.size
  }

  add (term) {
    const key = termToNTriples(term)

    if (this.index.has(key)) {
      return this
    }

    this.index.set(key, term)

    return this
  }

  clear () {
    this.index.clear()
  }

  delete (term) {
    return this.index.delete(termToNTriples(term))
  }

  entries () {
    return this.values().entries()
  }

  forEach (callbackfn, thisArg) {
    return this.values().forEach(callbackfn, thisArg)
  }

  has (term) {
    return this.index.has(termToNTriples(term))
  }

  values () {
    return new Set(this.index.values())
  }

  keys () {
    return this.values()
  }

  [Symbol.iterator] () {
    return this.values()[Symbol.iterator]()
  }
}
