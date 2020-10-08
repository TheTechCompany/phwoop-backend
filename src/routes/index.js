const express = require('express')
const cors = require('cors')
const bodyParser = require('body-parser')
const router = express.Router();
const { Model, ModelCollection } = require('../models')

module.exports = (db) => {
  router.use(cors({origin: [
    "http://localhost:3000",
    "https://models.phwoop.com"
  ]}))
  router.use(bodyParser.json())

  router.get('/collections', (req, res) => {
    ModelCollection.find((err, models) => {
      res.send(models)
    })
  })

  router.post('/collections', (req, res) => {

  })

  router.get('/collection/:id', (req, res) => {
    
  })

  router.route('/models')
    .get((req, res) => {
      Model.find((err, models) => {
        res.send((err) ? {error: err} : models)
      })
    }).post((req, res) => {
    
    let model = new Model({
      name: req.body.name,
      ipfs: req.body.ipfs,
      tags: req.body.tags
    })

    model.save((err, _model) => {
      res.send((err) ? {error: err} : _model)
    })
    })

  return router;
}
