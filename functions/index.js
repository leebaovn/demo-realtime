const functions = require('firebase-functions')
const admin = require('firebase-admin')

const cors = require('cors')
const authMiddleware = require('./middlewares/auth.middleware')
require('dotenv').config()

const express = require('express')

const app = express()
app.use(cors({ origin: '*' }))

//middleware
// app.use('/', authMiddleware)
async function checkAuth(req, res, next) {
  const tokenBearer = req.get('Authorization')
  if (!tokenBearer) {
    return res.status(403).send('Token is not provided')
  }
  const token = tokenBearer.split(' ')[1]
  if (token) {
    const decodedToken = await admin.auth().verifyIdToken(token)
    req.userId = decodedToken.uid
    next()
  } else {
    res.status(403).send('Unauthorized')
  }
}

app.use('/', checkAuth)
//require router
const roomRouter = require('./modules/room/room.router')
const questionRouter = require('./modules/questions/question.router')
//define route
app.use('/room', roomRouter)
app.use('/question', questionRouter)

exports.api = functions.region('asia-northeast1').https.onRequest(app)
