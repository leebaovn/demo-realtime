const express = require('express')

const router = express.Router()
const answerMiddleware = require('./../../middlewares/answer.middware')
const { createAnswer } = require('./answer.controller')

router.post('/:id', answerMiddleware, createAnswer)
module.exports = router
