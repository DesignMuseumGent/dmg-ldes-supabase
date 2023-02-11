import { blankNode } from './blankNode.js'
import { defaultGraph } from './defaultGraph.js'
import { literal } from './literal.js'
import { namedNode } from './namedNode.js'
import { variable } from './variable.js'

export function term (term) {
  switch (term.termType) {
    case 'BlankNode':
      return blankNode(term)
    case 'DefaultGraph':
      return defaultGraph(term)
    case 'Literal':
      return literal(term)
    case 'NamedNode':
      return namedNode(term)
    case 'Variable':
      return variable(term)
    default:
      return undefined
  }
}
