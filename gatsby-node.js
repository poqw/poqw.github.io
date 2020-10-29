require('ts-node').register()

// eslint-disable-next-line @typescript-eslint/no-var-requires
const { createPages } = require('./src/lib/createPages')
// eslint-disable-next-line @typescript-eslint/no-var-requires
const { onCreateNode } = require('./src/lib/onCreateNode')

exports.createPages = createPages
exports.onCreateNode = onCreateNode
