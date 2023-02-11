import { term } from './term.js'

export function quad (quad) {
  const subjectString = term(quad.subject)
  const predicateString = term(quad.predicate)
  const objectString = term(quad.object)
  const graphString = term(quad.graph)

  return `${subjectString} ${predicateString} ${objectString} ${graphString ? graphString + ' ' : ''}.`
}
