const functions = require('firebase-functions')
const admin = require('./firebase')

const cors = require('cors')
require('dotenv').config()

const express = require('express')

const app = express()
app.use(cors({ origin: '*' }))

//middleware
const authMiddleware = require('./middlewares/auth.middleware')

//require router
const roomRouter = require('./modules/room/room.router')
const questionRouter = require('./modules/questions/question.router')
const guestRouter = require('./modules/guest/guest.router')
const answerRouter = require('./modules/answers/answer.router')

//define route
app.use('/room', authMiddleware, roomRouter)
app.use('/question', authMiddleware, questionRouter)
app.use('/guest', guestRouter)
app.use('/answer', answerRouter)

exports.api = functions.region('asia-northeast1').https.onRequest(app)
