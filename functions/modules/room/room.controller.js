const admin = require('firebase-admin')
const db = admin.firestore()

exports.getRoom = async (req, res) => {
  const roomSnapshot = await db.collection('room').get()
  const roomList = roomSnapshot.docs.map((room) => {
    return {
      ...room.data(),
      id: room.id,
    }
  })
  return res.status(200).json({ data: roomList })
}
