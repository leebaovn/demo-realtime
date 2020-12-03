const functions = require('firebase-functions')
const admin = require('./firebase')

const cors = require('cors')
require('dotenv').config()

const express = require('express')

const app = express()
app.use(cors({ origin: '*' }))

//middleware
async function checkAuth(req, res, next) {
  const tokenBearer = req.get('Authorization')
  if (!tokenBearer) {
    return res.status(403).send('Token is not provided')
  }
  const token = tokenBearer.split(' ')[1]
  if (token) {
    const decodedToken = await admin.auth().verifyIdToken(token)
    req.userId = decodedToken.uid
    return next()
  } else {
    return res.status(403).send('Unauthorized')
  }
}

// app.use('/', checkAuth)
//require router
const roomRouter = require('./modules/room/room.router')
const questionRouter = require('./modules/questions/question.router')
const guestRouter = require('./modules/guest/guest.router')
const answerRouter = require('./modules/answers/answer.router')
//define route
app.use('/room', checkAuth, roomRouter)
app.use('/question', checkAuth, questionRouter)
app.use('/guest', guestRouter)
app.use('/answer', answerRouter)

exports.api = functions.region('asia-northeast1').https.onRequest(app)
