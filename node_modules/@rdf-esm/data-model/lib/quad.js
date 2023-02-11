import { DefaultGraph } from './default-graph.js'

export class Quad {
  constructor (subject, predicate, object, graph) {
    this.subject = subject
    this.predicate = predicate
    this.object = object

    if (graph) {
      this.graph = graph
    } else {
      this.graph = new DefaultGraph()
    }
  }

  equals (other) {
    return !!other && other.subject.equals(this.subject) && other.predicate.equals(this.predicate) &&
      other.object.equals(this.object) && other.graph.equals(this.graph)
  }
}
