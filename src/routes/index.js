const express = require('express')
const moniker = require('moniker')
const cors = require('cors')
const bodyParser = require('body-parser')
const router = express.Router();
const { World, Prefab, Model, ModelCollection } = require('../models')

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
  
  router.route('/prefabs')
    .post((req, res) => {
      let prefab = new Prefabs({
        name: moniker.choose(),
        components: [],
        locations: []
      })
      prefab.save((err, _p) => {
        res.send((err) ? {error : err}: _p)
      })
    })
    .get((req, res) => {
      Prefabs.find().populate('models').exec((err, prefabs) => {
        res.send((err) ? {error: err} : prefabs)
      })
    })

  router.route('/prefabs/:id')
    .post((req, res) => {
      Prefabs.findById(req.params.id, (err, prefab) => {
        let components = prefab.components;
        let locations = prefab.locations;

        if(components.indexOf(req.params.id) < 0) components.push(req.params.id)
        locations.push({
          model: req.params.id,
          scaling: {
            x: req.body.scaling,
            y: req.body.scaling,
            z: req.body.scaling
          },
          rotation: req.body.rotation,
          position: req.body.position
        })

        Prefabs.updateOne({_id: req.params.id}, {
          components:components,
          locations: 
        }, (err) => {
          res.send((err) ? {error: err}: {success: true})
        })
      })
    })

  router.route('/worlds')
    .post((req, res) => {

    })
    .get((req, res) => {

    })
  return router;
}
