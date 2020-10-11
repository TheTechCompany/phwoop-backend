var express = require('express')
var greenlock = require('greenlock-express')
var mongoose = require('mongoose')
var app = express()
var routes = require('./src/routes')
const StorageLayer = require('./src/storage')

mongoose.connect('mongodb://localhost/phwoop')

const db = mongoose.connection;

db.on('error', console.error.bind(console, 'connection error: '))
let storage = new StorageLayer(() => {
  db.once('open', () => {
    app.use(routes(db, storage))

    greenlock.init({
      packageRoot: __dirname,
      configDir: "./greenlock.d",
      maintainerEmail: "professional.balbatross@gmail.com",
      cluster: false
    }).serve(app)

  })
})
