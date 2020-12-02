const admin = require('firebase-admin')
const db = admin.firestore()

exports.getQuestionByRoom = async (req, res) => {
  const { roomId } = req.params
  const questionQuery = await db
    .collection('questions')
    .where('roomId', '==', roomId)
    .get()
  if (questionQuery.empty) {
    return res.status(200).json({ data: [] })
  }
  const questionList = questionQuery.docs.map((question) => {
    return {
      ...question.data(),
      id: question.id,
    }
  })
  return res.status(200).json({ data: questionList })
}

exports.showQuestion = async (req, res) => {
  const { id } = req.params
  const questionRef = db.collection('questions')
  const quenstionFound = await questionRef.doc(id).get()
  if (!quenstionFound.data()) {
    return res.status(403).send('Question not found')
  }
  questionRef.get().then((quesRef) => {
    const batch = db.batch()
    quesRef.docs.forEach((ques) => {
      batch.update(ques.ref, { show: false })
    })
  })

  await questionRef.doc(id).update({
    show: true,
  })
  return res.status(200)
}

exports.createQuestion = async (req, res) => {
  const questionRef = db.collection('questions')
  const { roomId } = req.params

  const roomFound = await db.collection('room').doc(roomId).get()
  if (!roomFound.id) {
    res.status(403).send('Room not found')
  }

  const {
    question,
    answerA,
    answerB,
    answerC,
    answerD,
    responseTime,
  } = req.body
  if (responseTime) {
    if (isNaN(responseTime))
      return res.status(403).send('response time must be a number')
  }
  if (!question && !answerA) {
    return res.status(403).send('You need to fill out information')
  }
  const newQuestion = await questionRef.add({
    question,
    answerA: answerA,
    answerB: answerB,
    answerC: answerC,
    answerD: answerD,
    responseTime,
    show: false,
    createdAt: new Date().getTime(),
    roomId,
  })
  if (newQuestion.id) {
    const newQues = await newQuestion.get()
    const currentQuestion = roomFound.data().questions
    await db
      .collection('room')
      .doc(roomId)
      .update({
        questions: [...currentQuestion, newQuestion.id],
      })
    return res
      .status(200)
      .json({ data: { ...newQues.data(), id: newQuestion.id } })
  }
  return res.status(403).send('Created fail')
}

exports.updateQuestion = async (req, res) => {
  try {
    const { id } = req.params
    const { userId } = req
    const {
      question,
      responseTime,
      answerA,
      answerB,
      answerC,
      answerD,
    } = req.body
    const questionRef = db.collection('questions')
    const roomRef = db.collection('room')
    const questionFound = await questionRef.doc(id).get()
    if (!questionFound.id) {
      return res.status(403).send('Question not found')
    }
    const { roomId } = questionFound.data()
    const roomData = await roomRef.doc(roomId).get()
    if (!roomData.id) {
      return res.status(403).send('Room not found')
    }
    const { createdBy } = roomData.data()
    if (createdBy !== userId) {
      return res.status(403).send('Unauthorized')
    }
    const updatedQuestion = await questionRef.doc(id).update({
      question,
      responseTime,
      answerA,
      answerB,
      answerC,
      answerD,
    })
    return res.status(200).json({ data: updatedQuestion })
  } catch (err) {
    console.log(err)
  }
}

exports.deleteQuestion = async (req, res) => {
  try {
    const { id } = req.params
    const { userId } = req
    const questionRef = db.collection('questions')
    const roomRef = db.collection('room')
    const questionFound = await questionRef.doc(id).get()
    if (!questionFound.id) {
      return res.status(403).send('Question not found')
    }
    const { roomId } = questionFound.data()
    const roomData = await roomRef.doc(roomId).get()
    if (!roomData.id) {
      return res.status(403).send('Room not found')
    }
    const { createdBy } = roomData.data()
    if (createdBy !== userId) {
      return res.status(403).send('Unauthorized')
    }
    await questionRef.doc(id).delete()
    return res.send(200)
  } catch (err) {
    console.log(err)
  }
}
