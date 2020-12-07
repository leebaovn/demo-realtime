const admin = require('./../../firebase')
const db = admin.firestore()

exports.getRoom = async (req, res) => {
  const { userId } = req
  const roomSnapshot = await db
    .collection('room')
    .where('createdBy', '==', userId)
    // .orderBy('createdAt', 'desc')
    .get()
  const roomList = roomSnapshot.docs.map((room) => {
    return {
      ...room.data(),
      id: room.id,
    }
  })
  return res.status(200).json({ data: roomList })
}

exports.createRoom = async (req, res) => {
  const { userId } = req
  const { title, description } = req.body
  if (!title && !description) {
    return res.status(403).send('You need to fill out information')
  }
  const createdRoom = await db.collection('room').add({
    title,
    description,
    createdBy: userId,
    members: [],
    questions: [],
    createdAt: new Date().getTime(),
  })
  if (createdRoom.id) {
    const newRoom = await createdRoom.get()
    return res
      .status(200)
      .json({ data: { ...newRoom.data(), id: createdRoom.id } })
  }
  return res.status(403).send('Created fail')
}

exports.deleteRoom = async (req, res) => {
  const { userId } = req
  const { id: roomId } = req.params
  const roomFound = await db.collection('room').doc(roomId).get()
  if (!roomFound.exists) {
    return res.send(403).send('Room not found')
  }
  const roomData = roomFound.data()
  if (roomData.createdBy !== userId) {
    return res.send(403).send('You dont have permission to delete this room')
  }
  await db.collection('room').doc(roomId).delete()
  return res.send(200).send('Room deleted successfully')
}

exports.updateRoom = async (req, res) => {
  const { userId } = req
  const { id: roomId } = req.params
  const { title, description } = req.body
  const roomFound = await db.collection('room').doc(roomId).get()
  if (!roomFound.exists) {
    return res.send(403).send('Room not found')
  }
  const roomData = roomFound.data()
  if (roomData.createdBy !== userId) {
    return res.send(403).send('You dont have permission to delete this room')
  }
  await db.collection('room').doc(roomId).update({
    title,
    description,
  })
  return res.send(200)
}
