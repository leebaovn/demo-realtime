const functions = require('firebase-functions')
const admin = require('firebase-admin')

const cors = require('cors')
const authMiddleware = require('./middlewares/auth.middleware')
require('dotenv').config()

const express = require('express')

const app = express()
app.use(cors({ origin: '*' }))

//middleware
app.use('/', authMiddleware)
function checkAuth(req, res, next) {
  if (req.headers.authtoken) {
    admin
      .auth()
      .verifyIdToken(req.headers.authtoken)
      .then(() => {
        next()
      })
      .catch(() => {
        res.status(403).send('Unauthorized')
      })
  } else {
    res.status(403).send('Unauthorized')
  }
}

app.use('/', checkAuth)
//require router
const roomRouter = require('./modules/room/room.router')

//define route
app.use('/room', roomRouter)

exports.api = functions.region('asia-northeast1').https.onRequest(app)
