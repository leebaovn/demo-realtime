const express = require('express')

const router = express.Router()
const {
  getQuestionByRoom,
  showQuestion,
  createQuestion,
  updateQuestion,
  deleteQuestion,
} = require('./question.controller')

router.get('/:roomId', getQuestionByRoom)
router.post('/:id', showQuestion)
router.post('/create/:roomId', createQuestion)
router.patch('/:id', updateQuestion)
router.delete('/:id', deleteQuestion)
module.exports = router
