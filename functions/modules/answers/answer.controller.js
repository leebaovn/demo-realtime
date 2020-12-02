const admin = require('./../../firebase')
const db = admin.firestore()

exports.createAnswer = async (req, res) => {
  const { id } = req.params
  const { answer, guestId } = req.body

  const questionRef = db.collection('questions')
  const answerRef = db.collection('answer')

  const questionFound = await questionRef.doc(id).get()
  if (!questionFound.id) {
    res.status(403).send('Question not found')
  }

  await answerRef.add({
    answer,
    guestId,
    questionId: id,
    createdAt: new Date().getTime(),
  })

  return res.send(200)
}
