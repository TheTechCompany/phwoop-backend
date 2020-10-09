const mongoose = require('mongoose')
const Schema = mongoose.Schema;

const worldSchema  = new mongoose.Schema({
  name: String,
  prefabs: [{type: Schema.Types.ObjectId, ref: 'Prefab'}]
}, {
  timestamps: true
})

module.exports = mongoose.model('World', worldSchema)
