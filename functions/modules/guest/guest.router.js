const express = require('express')

const router = express.Router()
const { createGuest } = require('./guest.controller')

router.post('/:roomId', createGuest)

module.exports = router
