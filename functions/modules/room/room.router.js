const express = require('express')

const router = express.Router()
const {
  getRoom,
  createRoom,
  deleteRoom,
  updateRoom,
} = require('./room.controller')

router.get('/', getRoom)
router.post('/', createRoom)
router.delete('/:id', deleteRoom)
router.patch('/:id', updateRoom)
module.exports = router
