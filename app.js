// modules import
const express = require('express')
const exphbs = require('express-handlebars')
const bodyParser = require('body-parser')
const mongoose = require('mongoose')
const routes = require('./routes/index')
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
app.use(routes)

// app.listen
app.listen(PORT, () => console.log(`http://localhost:${PORT}`))
