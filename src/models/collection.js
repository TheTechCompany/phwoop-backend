const mongoose = require('mongoose')
const Schema = mongoose.Schema;

const modelCollection = new mongoose.Schema({
  name: String,
  items: [{type: Schema.Types.ObjectId, ref: 'Model'}]
}, {
  timestamps: true
})

module.exports = mongoose.model('ModelCollection', modelCollection)
