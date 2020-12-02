const admin = require('./../../firebase')
const db = admin.firestore()

exports.createGuest = async (req, res) => {
  const { roomId } = req.params
  const { email, displayName } = req.body

  const guestRef = db.collection('guest')
  const roomRef = db.collection('room')

  const roomFound = await roomRef.doc(roomId).get()
  if (!roomFound.id) {
    res.status(403).send('Room not found')
  }

  const newGuest = await guestRef.add({
    email,
    displayName,
  })

  const currentMembers = roomFound.data().members
  await roomRef.doc(roomId).update({
    members: [...currentMembers, newGuest.id],
  })
  return res.status(200).json({ data: newGuest.id })
}
