// modules import
const express = require('express')
const exphbs = require('express-handlebars')
const bodyParser = require('body-parser')
const mongoose = require('mongoose')
const URL = require('./models/url')
const urlgenerate = require('./urlgenerate')
require('dotenv').config()

const app = express()
const PORT = process.env.PORT || 3000

// Database
mongoose.connect(process.env.MONGODB_URI, {useNewUrlParser: true, useUnifiedTopology: true})
const db = mongoose.connection

db.on('error', () => console.log('MongoDB connect error!'))
db.once('open', () => console.log('MongoDB connected!'))

// set and use
app.engine('hbs', exphbs({defaultLayout: 'main', extname: '.hbs'}))
app.set('view engine', 'hbs')

app.use(bodyParser.urlencoded({extended: true}))

// routes
app.get('/', (req, res) => {
  res.render('index')
})
app.post('/', (req, res) => {
  const originURL = req.body.originURL
  const host = req.headers.host
  let shortURL = urlgenerate(5)
  // make sure the shortURL is unique in database
  URL.find()
    .lean()
    .then(urls => {
      while(urls.some(url => url.shortURL === shortURL)) {
        shortURL = urlgenerate(5)
      }
    })
    .catch(error => console.log(error))
  
  return URL.findOne({ originURL })
    .lean()
    .then(url => {
      // get shortURL data if url exist
      shortURL = url? url.shortURL : shortURL
      // create a set of data if url not exist
      if (!url) URL.create({ originURL, shortURL})
      
      res.render('index', { shortURL, host })
    })
    .catch(error => console.log(error))
})
app.get('/:shortURL', (req, res) => {
  const shortURL = req.params.shortURL
  return URL.findOne({ shortURL })
    .lean()
    .then(url => {
      if (!url) return res.render('error')
      res.redirect(url.originURL)
    })
})
// app.listen
app.listen(PORT, () => console.log(`http://localhost:${PORT}`))
