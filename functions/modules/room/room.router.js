const express = require('express')

const router = express.Router()
const { getRoom } = require('./room.controller')

router.get('/', getRoom)
module.exports = router
