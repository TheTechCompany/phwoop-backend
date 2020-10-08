const mongoose = require('mongoose')

const modelCollection = new mongoose.schema({
  name: String,
  ipfs: String,
  tags: [String],
}, {
  timestamps: true
})

module.exports = mongoose.model('Model', modelCollection)
