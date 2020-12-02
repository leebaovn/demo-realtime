const express = require('express')

const router = express.Router()
const { createAnswer } = require('./answer.controller')

router.post('/:id', createAnswer)
module.exports = router
