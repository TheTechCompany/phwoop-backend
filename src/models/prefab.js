const mongoose = require('mongoose')
const Schema = mongoose.Schema;

const prefab = new mongoose.Schema({
  name: String,
  components: [{type: Schema.Types.ObjectId, ref: 'Model'}],
  locations: [{
    model: String,
    scaling: {
      x: Number,
      y: Number,
      z: Number
    },
    rotation: {
      x: Number,
      y: Number,
      z: Number
    },
    position: {
      x: Number,
      y: Number,
      z: Number
    }
  }]
}, {
  timestamps: true
})

module.exports = mongoose.model('Prefab', prefab) 
