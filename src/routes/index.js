const express = require('express')
const moniker = require('moniker')
const cors = require('cors')
const bodyParser = require('body-parser')
const router = express.Router();
const { Model, ModelCollection } = require('../models')

module.exports = (db) => {
  router.use(cors({origin: [
    "http://localhost:8081",
    "https://vr.phwoop.com",
    "http://localhost:3000",
    "https://models.phwoop.com"
  ]}))
  router.use(bodyParser.json())

  router.get('/collections', (req, res) => {
    ModelCollection.find().populate('items').exec((err, models) => {
      res.send((err) ? {error: err} : models)
    })
  })

  router.post('/collections', (req, res) => {
    let modelCollection = new ModelCollection({
      name: req.body.name,
      items: [],
      moniker: moniker.choose()
    })

    modelCollection.save((err, collection) => {
      res.send((err) ? {error: err} : collection)
    })
  })

  router.route('/collections/:id')
    .get((req, res) => {
      ModelCollection.findById(req.params.id).populate('items').exec((err, collection) => {
        res.send((err) ? {error: err} : collection)
      })
    })
    .post((req, res) => {
      let model = new Model({
        name: req.body.name,
        ipfs: req.body.ipfs,
        tags: req.body.tags
      })

      model.save((err, _model) => {
        ModelCollection.findById(req.params.id, (err, collection) => {
          let items = collection.items || [];
          items.push(_model._id)
          ModelCollection.updateOne({
            _id: req.params.id
          }, {
            items: items
          }, {omitUndefined: true}, (err) => {
            res.send((err) ? {error: err} : _model)
          })
        })
      })
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
