'use strict'

function runTests (rdf) {
  require('./named-node.cjs')(rdf)
  require('./blank-node.cjs')(rdf)
  require('./literal.cjs')(rdf)
  require('./default-graph.cjs')(rdf)
  require('./variable.cjs')(rdf)
  require('./triple.cjs')(rdf)
  require('./quad.cjs')(rdf)
}

if (global.rdf) {
  runTests(global.rdf)
}

module.exports = runTests
