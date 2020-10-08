const mongoose = require('mongoose')

const modelCollection = new mongoose.Schema({
  name: String,
  ipfs: String,
  tags: [String],
}, {
  timestamps: true
})

module.exports = mongoose.model('Model', modelCollection)
