const { run } = require('mocha')

import('../index.js').then(rdf => {
  require('./index.cjs')(rdf)
  run()
})
