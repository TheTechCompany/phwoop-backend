const express = require('express')
const moniker = require('moniker')
const cors = require('cors')
const bodyParser = require('body-parser')
const router = express.Router();
const { World, Prefab, Model, ModelCollection } = require('../models')

module.exports = (db) => {
  router.use(cors({origin: [
    "http://localhost:8081",
    "https://game.phwoop.com",
    "http://localhost:3000",
    "https://models.phwoop.com"
  ]}))
  router.use(bodyParser.json())

  router.get('/collections', (req, res) => {
    ModelCollection.find().populate('items').exec((err, models) => {
      res.send((err) ? {error: err} : models)
    })
  })

  router.route('/collections/:type')
    .post((req, res) => {
    let modelCollection = new ModelCollection({
      name: req.body.name,
      type: req.params.type,
      items: [],
      moniker: moniker.choose()
    })

    modelCollection.save((err, collection) => {
      res.send((err) ? {error: err} : collection)
    })
  })
    .get((req, res) => {
      ModelCollection.find({type: req.params.type}).populate('items').exec((err, models) => {
        res.send((err) ? {error: err} : models)
      })
    })

  router.route('/collections/id/:id')
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

  router.route('/models/:id')
    .get((req, res) => {
      Model.findById(req.params.id, (err, models) => {
        res.send((err) ? {error: err} : models)
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
      let prefab = new Prefab({
        name: moniker.choose(),
        components: [],
        locations: []
      })
      prefab.save((err, _p) => {
        res.send((err) ? {error : err}: _p)
      })
    })
    .get((req, res) => {
      Prefab.find().populate('models').exec((err, prefabs) => {
        res.send((err) ? {error: err} : prefabs)
      })
    })

  router.route('/prefabs/:id')
    .post((req, res) => {
      Prefab.findById(req.params.id, (err, prefab) => {
        let components = prefab.components;
        let locations = prefab.locations;

        if(components.indexOf(req.body.model) < 0) components.push(req.body.model)
        locations.push({
          model: req.body.model,
          scaling: {
            x: req.body.scaling,
            y: req.body.scaling,
            z: req.body.scaling
          },
          rotation: req.body.rotation,
          position: req.body.position
        })

        Prefab.updateOne({_id: req.params.id}, {
          components:components,
          locations: locations
        }, (err) => {
          res.send((err) ? {error: err}: {success: true})
        })
      })
    })
    .get((req, res) => {
      Prefab.findById(req.params.id).populate('components').exec((err, prefab) => {
        res.send((err) ? {error: err} : prefab)
      })
    })

  router.route('/prefabs/:id/lights')
    .post((req, res) => {
      Prefab.findById(req.params.id, (err, prefab) => {
        let lights = prefab.lights || [];
        lights.push({
          color: req.body.color,
          intensity: req.body.intensity,
          position: req.body.position
        })
        Prefab.updateOne({_id: req.params.id}, {lights: lights}, (err) => {
          res.send((err) ? {error: err} : {success: true})
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
