const express = require('express')
const router = express.Router()
const URL = require('../../models/url')
const urlgenerate = require('../../urlgenerate')

// initial page
router.get('/', (req, res) => {
  res.render('index')
})
// get shortURL
router.post('/', (req, res) => {
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
// redirect to originURL
router.get('/:shortURL', (req, res) => {
  const shortURL = req.params.shortURL
  return URL.findOne({ shortURL })
    .lean()
    .then(url => {
      if (!url) return res.render('error')
      res.redirect(url.originURL)
    })
})

module.exports = router